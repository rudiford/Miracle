import type { Express } from "express";
import express from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth, isAuthenticated, supabase } from "./supabaseAuth";
import { insertUserSchema, insertPostSchema, insertConnectionSchema, insertMessageSchema, insertCommentSchema, insertReportSchema } from "@shared/schema";
import multer from "multer";
import path from "path";
import fs from "fs";

// Configure multer for file uploads
const upload = multer({
  dest: 'uploads/',
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed'));
    }
  },
});

export async function registerRoutes(app: Express): Promise<Server> {
  // Auth middleware
  await setupAuth(app);

  // Serve uploaded files with better error handling
  app.use('/uploads', express.static('uploads', {
    maxAge: '7d', // Cache for 7 days
    etag: true,
    lastModified: true
  }));

  // Health check for images
  app.get('/api/health/images', (req, res) => {
    try {
      const uploadsDir = 'uploads';
      const exists = fs.existsSync(uploadsDir);
      const files = exists ? fs.readdirSync(uploadsDir).filter(f => f.endsWith('.jpg') || f.endsWith('.png')) : [];
      
      res.json({
        uploadsDirectoryExists: exists,
        totalImageFiles: files.length,
        recentFiles: files.slice(-5),
        diskSpace: exists ? fs.statSync(uploadsDir) : null
      });
    } catch (error) {
      res.status(500).json({ error: 'Failed to check image health' });
    }
  });

  // Auth routes
  app.get('/api/auth/user', isAuthenticated, async (req: any, res) => {
    try {
      const userId = (req as any).user?.id;
      if (!userId) {
        return res.status(401).json({ message: "No user session" });
      }
      const user = await storage.getUser(userId);
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      res.json(user);
    } catch (error) {
      console.error("Error fetching user:", error);
      res.status(500).json({ message: "Failed to fetch user" });
    }
  });

  // Account deletion endpoint (GDPR compliance)
  app.delete('/api/users/delete-account', isAuthenticated, async (req: any, res) => {
    try {
      const userId = (req as any).user?.id;

      const deleted = await storage.deleteUserCompletely(userId);

      if (!deleted) {
        return res.status(404).json({ message: "User not found" });
      }

      res.json({
        message: "Account and all associated data have been permanently deleted",
        deletedAt: new Date().toISOString()
      });
    } catch (error) {
      console.error("Error deleting user account:", error);
      res.status(500).json({ message: "Failed to delete account" });
    }
  });

  // User profile routes
  app.put('/api/users/profile', isAuthenticated, async (req: any, res) => {
    try {
      const userId = (req as any).user?.id;
      const userEmail = (req as any).user?.email;
      const validatedData = insertUserSchema.parse(req.body);
      // Ensure user row exists before updating (handles new users)
      await storage.upsertUser({ id: userId, email: userEmail });
      const updatedUser = await storage.updateUserProfile(userId, validatedData);
      if (!updatedUser) {
        return res.status(404).json({ message: "User not found" });
      }
      res.json(updatedUser);
    } catch (error) {
      console.error("Error updating profile:", error);
      res.status(500).json({ message: "Failed to update profile" });
    }
  });

  app.post('/api/users/profile-picture', isAuthenticated, upload.single('profilePicture'), async (req: any, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({ message: "No file uploaded" });
      }

      const userId = (req as any).user?.id;
      const filename = `${userId}-${Date.now()}${path.extname(req.file.originalname)}`;
      const newPath = path.join('uploads', filename);
      
      fs.renameSync(req.file.path, newPath);
      
      const profileImageUrl = `/uploads/${filename}`;
      const updatedUser = await storage.updateUserProfile(userId, { profileImageUrl });
      
      res.json({ profileImageUrl });
    } catch (error) {
      console.error("Error uploading profile picture:", error);
      res.status(500).json({ message: "Failed to upload profile picture" });
    }
  });

  // Admin routes
  app.get('/api/admin/users', isAuthenticated, async (req: any, res) => {
    try {
      const userId = (req as any).user?.id;
      const user = await storage.getUser(userId);
      
      if (!user?.isAdmin) {
        return res.status(403).json({ message: "Admin access required" });
      }
      
      const users = await storage.getAllUsers();
      res.json(users);
    } catch (error) {
      console.error("Error fetching users:", error);
      res.status(500).json({ message: "Failed to fetch users" });
    }
  });

  app.delete('/api/admin/users/:id', isAuthenticated, async (req: any, res) => {
    try {
      const userId = (req as any).user?.id;
      const user = await storage.getUser(userId);
      
      if (!user?.isAdmin) {
        return res.status(403).json({ message: "Admin access required" });
      }
      
      const targetUserId = req.params.id;
      const deleted = await storage.deleteUser(targetUserId);
      
      if (!deleted) {
        return res.status(404).json({ message: "User not found" });
      }
      
      res.json({ message: "User deleted successfully" });
    } catch (error) {
      console.error("Error deleting user:", error);
      res.status(500).json({ message: "Failed to delete user" });
    }
  });

  app.get('/api/admin/stats', isAuthenticated, async (req: any, res) => {
    try {
      const userId = (req as any).user?.id;
      const user = await storage.getUser(userId);
      
      if (!user?.isAdmin) {
        return res.status(403).json({ message: "Admin access required" });
      }
      
      const users = await storage.getAllUsers();
      const posts = await storage.getAllPosts();
      const reports = await storage.getAllReports();
      const pendingReports = reports.filter(r => r.status === 'pending');
      
      res.json({
        totalUsers: users.length,
        totalPosts: posts.length,
        reportedContent: pendingReports.length,
        activeMiracles: posts.length,
      });
    } catch (error) {
      console.error("Error fetching admin stats:", error);
      res.status(500).json({ message: "Failed to fetch admin stats" });
    }
  });

  // Post routes
  app.get('/api/posts', isAuthenticated, async (req: any, res) => {
    try {
      const userId = (req as any).user?.id;
      const posts = await storage.getAllPosts(userId);
      res.json(posts);
    } catch (error) {
      console.error("Error fetching posts:", error);
      res.status(500).json({ message: "Failed to fetch posts" });
    }
  });

  app.post('/api/posts', isAuthenticated, upload.single('image'), async (req: any, res) => {
    try {
      const userId = (req as any).user?.id;
      
      let imageUrl = null;
      
      if (req.file) {
        const fileBuffer = fs.readFileSync(req.file.path);
        const ext = path.extname(req.file.originalname) || '.jpg';
        const fileName = `${Date.now()}-${Math.random().toString(36).slice(2)}${ext}`;

        const { error: uploadError } = await supabase.storage
          .from('post-images')
          .upload(fileName, fileBuffer, { contentType: req.file.mimetype });

        fs.unlinkSync(req.file.path);

        if (uploadError) throw uploadError;

        const { data: { publicUrl } } = supabase.storage
          .from('post-images')
          .getPublicUrl(fileName);

        imageUrl = publicUrl;
      }
      
      const postData = {
        ...req.body,
        imageUrl,
      };
      
      const validatedData = insertPostSchema.parse(postData);
      const post = await storage.createPost(userId, validatedData);
      
      res.json(post);
    } catch (error) {
      console.error("Error creating post:", error);
      console.error("Error stack:", (error as Error).stack);
      res.status(500).json({ message: "Failed to create post" });
    }
  });

  app.patch('/api/posts/:id', isAuthenticated, async (req: any, res) => {
    try {
      const userId = (req as any).user?.id;
      const postId = parseInt(req.params.id);
      
      // Get the post to check ownership
      const posts = await storage.getAllPosts();
      const post = posts.find(p => p.id === postId);
      
      if (!post) {
        return res.status(404).json({ message: "Post not found" });
      }
      
      // Only post owner can edit
      if (post.user.id !== userId) {
        return res.status(403).json({ message: "You can only edit your own posts" });
      }
      
      const validatedData = insertPostSchema.partial().parse(req.body);
      const updatedPost = await storage.updatePost(postId, validatedData);
      
      if (!updatedPost) {
        return res.status(404).json({ message: "Post not found" });
      }
      
      res.json(updatedPost);
    } catch (error) {
      console.error("Error updating post:", error);
      res.status(500).json({ message: "Failed to update post" });
    }
  });

  app.delete('/api/posts/:id', isAuthenticated, async (req: any, res) => {
    try {
      const userId = (req as any).user?.id;
      const user = await storage.getUser(userId);
      const postId = parseInt(req.params.id);
      
      // First, get all posts to find the specific post
      const allPosts = await storage.getAllPosts();
      const post = allPosts.find(p => p.id === postId);
      
      if (!post) {
        return res.status(404).json({ message: "Post not found" });
      }
      
      // Check if user owns the post OR is admin
      if (post.userId !== userId && !user?.isAdmin) {
        return res.status(403).json({ message: "You can only delete your own posts" });
      }
      
      const deleted = await storage.deletePost(postId);
      
      if (!deleted) {
        return res.status(404).json({ message: "Post not found" });
      }
      
      res.json({ message: "Post deleted successfully" });
    } catch (error) {
      console.error("Error deleting post:", error);
      res.status(500).json({ message: "Failed to delete post" });
    }
  });

  // Prayer routes
  app.post('/api/posts/:id/prayer', isAuthenticated, async (req: any, res) => {
    try {
      const userId = (req as any).user?.id;
      const postId = parseInt(req.params.id);
      
      const hasPrayed = await storage.hasUserPrayed(userId, postId);
      if (hasPrayed) {
        await storage.removePrayer(userId, postId);
        res.json({ action: 'removed' });
      } else {
        await storage.addPrayer(userId, postId);
        res.json({ action: 'added' });
      }
    } catch (error) {
      console.error("Error toggling prayer:", error);
      res.status(500).json({ message: "Failed to toggle prayer" });
    }
  });

  // Love routes
  app.post('/api/posts/:id/love', isAuthenticated, async (req: any, res) => {
    try {
      const userId = (req as any).user?.id;
      const postId = parseInt(req.params.id);
      
      const hasLoved = await storage.hasUserLoved(userId, postId);
      if (hasLoved) {
        await storage.removeLove(userId, postId);
        res.json({ action: 'removed' });
      } else {
        await storage.addLove(userId, postId);
        res.json({ action: 'added' });
      }
    } catch (error) {
      console.error("Error toggling love:", error);
      res.status(500).json({ message: "Failed to toggle love" });
    }
  });

  // User posts route
  app.get('/api/users/:id/posts', isAuthenticated, async (req: any, res) => {
    try {
      const posts = await storage.getPostsByUser(req.params.id);
      res.json(posts);
    } catch (error) {
      console.error("Error fetching user posts:", error);
      res.status(500).json({ message: "Failed to fetch user posts" });
    }
  });

  // Comment routes
  app.get('/api/posts/:id/comments', isAuthenticated, async (req: any, res) => {
    try {
      const postId = parseInt(req.params.id);
      const comments = await storage.getCommentsByPost(postId);
      res.json(comments);
    } catch (error) {
      console.error("Error fetching comments:", error);
      res.status(500).json({ message: "Failed to fetch comments" });
    }
  });

  app.post('/api/posts/:id/comments', isAuthenticated, async (req: any, res) => {
    try {
      const userId = (req as any).user?.id;
      const postId = parseInt(req.params.id);
      
      const commentData = {
        postId,
        content: req.body.content,
      };
      
      const validatedData = insertCommentSchema.parse(commentData);
      const comment = await storage.createComment(userId, validatedData);
      
      res.json(comment);
    } catch (error) {
      console.error("Error creating comment:", error);
      res.status(500).json({ message: "Failed to create comment" });
    }
  });

  // Connection routes
  app.get('/api/connections', isAuthenticated, async (req: any, res) => {
    try {
      const userId = (req as any).user?.id;
      const connections = await storage.getConnectionsByUser(userId);
      res.json(connections);
    } catch (error) {
      console.error("Error fetching connections:", error);
      res.status(500).json({ message: "Failed to fetch connections" });
    }
  });

  app.post('/api/connections', isAuthenticated, async (req: any, res) => {
    try {
      const userId = (req as any).user?.id;
      const validatedData = insertConnectionSchema.parse(req.body);
      const connection = await storage.createConnection(userId, validatedData);
      res.json(connection);
    } catch (error) {
      console.error("Error creating connection:", error);
      res.status(500).json({ message: "Failed to create connection" });
    }
  });

  app.put('/api/connections/:id', isAuthenticated, async (req: any, res) => {
    try {
      const userId = (req as any).user?.id;
      const connectionId = parseInt(req.params.id);
      const { status } = req.body;

      const connections = await storage.getConnectionsByUser(userId);
      const connection = connections.find(c => c.id === connectionId);
      if (!connection) {
        return res.status(404).json({ message: "Connection not found" });
      }
      if (connection.addresseeId !== userId) {
        return res.status(403).json({ message: "Not authorized to update this connection" });
      }

      const updated = await storage.updateConnectionStatus(connectionId, status);
      res.json(updated);
    } catch (error) {
      console.error("Error updating connection:", error);
      res.status(500).json({ message: "Failed to update connection" });
    }
  });

  app.get('/api/connections/accepted', isAuthenticated, async (req: any, res) => {
    try {
      const userId = (req as any).user?.id;
      const connections = await storage.getAcceptedConnections(userId);
      res.json(connections);
    } catch (error) {
      console.error("Error fetching accepted connections:", error);
      res.status(500).json({ message: "Failed to fetch accepted connections" });
    }
  });

  // Message routes
  app.get('/api/conversations', isAuthenticated, async (req: any, res) => {
    try {
      const userId = (req as any).user?.id;
      const conversations = await storage.getConversations(userId);
      res.json(conversations);
    } catch (error) {
      console.error("Error fetching conversations:", error);
      res.status(500).json({ message: "Failed to fetch conversations" });
    }
  });

  app.get('/api/conversations/:userId', isAuthenticated, async (req: any, res) => {
    try {
      const currentUserId = (req as any).user?.id;
      const otherUserId = req.params.userId;
      
      const messages = await storage.getMessagesBetweenUsers(currentUserId, otherUserId);
      await storage.markMessagesAsRead(otherUserId, currentUserId);
      
      res.json(messages);
    } catch (error) {
      console.error("Error fetching messages:", error);
      res.status(500).json({ message: "Failed to fetch messages" });
    }
  });

  app.post('/api/messages', isAuthenticated, async (req: any, res) => {
    try {
      const userId = (req as any).user?.id;
      const validatedData = insertMessageSchema.parse(req.body);
      const message = await storage.createMessage(userId, validatedData);
      res.json(message);
    } catch (error) {
      console.error("Error sending message:", error);
      res.status(500).json({ message: "Failed to send message" });
    }
  });

  // User search route
  app.get('/api/users/search', isAuthenticated, async (req: any, res) => {
    try {
      const query = req.query.q as string;
      if (!query || query.length < 2) {
        return res.json([]);
      }
      
      const users = await storage.getAllUsers();
      const filteredUsers = users.filter(user => {
        const fullName = `${user.firstName || ''} ${user.lastName || ''}`.toLowerCase();
        return fullName.includes(query.toLowerCase()) || 
               (user.email && user.email.toLowerCase().includes(query.toLowerCase()));
      });
      
      const safeUsers = filteredUsers.map(({ email, ...rest }) => rest);
      res.json(safeUsers);
    } catch (error) {
      console.error("Error searching users:", error);
      res.status(500).json({ message: "Failed to search users" });
    }
  });

  // Block user routes
  app.post('/api/users/:id/block', isAuthenticated, async (req: any, res) => {
    try {
      const blockedId = req.params.id;
      const blockerId = (req as any).user?.id;
      
      if (blockerId === blockedId) {
        return res.status(400).json({ message: "Cannot block yourself" });
      }

      await storage.blockUser(blockerId, blockedId);
      res.json({ message: "User blocked successfully" });
    } catch (error) {
      console.error("Error blocking user:", error);
      res.status(500).json({ message: "Failed to block user" });
    }
  });

  app.delete('/api/users/:id/block', isAuthenticated, async (req: any, res) => {
    try {
      const blockedId = req.params.id;
      const blockerId = (req as any).user?.id;
      
      const success = await storage.unblockUser(blockerId, blockedId);
      if (success) {
        res.json({ message: "User unblocked successfully" });
      } else {
        res.status(404).json({ message: "Block not found" });
      }
    } catch (error) {
      console.error("Error unblocking user:", error);
      res.status(500).json({ message: "Failed to unblock user" });
    }
  });

  app.get('/api/users/:id/blocked', isAuthenticated, async (req: any, res) => {
    try {
      const blockedId = req.params.id;
      const blockerId = (req as any).user?.id;
      
      const isBlocked = await storage.isUserBlocked(blockerId, blockedId);
      res.json({ isBlocked });
    } catch (error) {
      console.error("Error checking block status:", error);
      res.status(500).json({ message: "Failed to check block status" });
    }
  });

  app.get('/api/blocked-users', isAuthenticated, async (req: any, res) => {
    try {
      const userId = (req as any).user?.id;
      const blockedUsers = await storage.getBlockedUsers(userId);
      res.json(blockedUsers);
    } catch (error) {
      console.error("Error fetching blocked users:", error);
      res.status(500).json({ message: "Failed to fetch blocked users" });
    }
  });

  // Report routes
  app.post('/api/reports', isAuthenticated, async (req: any, res) => {
    try {
      const reporterId = (req as any).user?.id;
      const validatedData = insertReportSchema.parse(req.body);
      const report = await storage.createReport(reporterId, validatedData);
      res.json(report);
    } catch (error) {
      console.error("Error creating report:", error);
      res.status(500).json({ message: "Failed to create report" });
    }
  });

  app.get('/api/admin/reports', isAuthenticated, async (req: any, res) => {
    try {
      const userId = (req as any).user?.id;
      const user = await storage.getUser(userId);
      
      if (!user?.isAdmin) {
        return res.status(403).json({ message: "Admin access required" });
      }
      
      const reports = await storage.getAllReports();
      res.json(reports);
    } catch (error) {
      console.error("Error fetching reports:", error);
      res.status(500).json({ message: "Failed to fetch reports" });
    }
  });

  app.patch('/api/admin/reports/:id', isAuthenticated, async (req: any, res) => {
    try {
      const userId = (req as any).user?.id;
      const user = await storage.getUser(userId);
      const reportId = parseInt(req.params.id);
      
      if (!user?.isAdmin) {
        return res.status(403).json({ message: "Admin access required" });
      }
      
      const { status } = req.body;
      const updatedReport = await storage.updateReportStatus(reportId, status, userId);
      
      if (!updatedReport) {
        return res.status(404).json({ message: "Report not found" });
      }
      
      res.json(updatedReport);
    } catch (error) {
      console.error("Error updating report:", error);
      res.status(500).json({ message: "Failed to update report" });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}
