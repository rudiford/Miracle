import { type User, type UpsertUser, type Post, type InsertPost, type Connection, type InsertConnection, type Message, type InsertMessage, type Comment, type InsertComment, type Prayer, type Block, type InsertBlock, type Report, type InsertReport } from "@shared/schema";

export interface IStorage {
  // User operations (mandatory for Replit Auth)
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;
  updateUserProfile(id: string, data: Partial<User>): Promise<User | undefined>;
  getAllUsers(): Promise<User[]>;
  deleteUser(id: string): Promise<boolean>;
  deleteUserCompletely(id: string): Promise<boolean>;
  
  // Post operations
  createPost(userId: string, post: InsertPost): Promise<Post>;
  getAllPosts(): Promise<(Post & { user: User })[]>;
  getPostsByUser(userId: string): Promise<Post[]>;
  updatePost(id: number, data: Partial<InsertPost>): Promise<Post | undefined>;
  deletePost(id: number): Promise<boolean>;
  incrementPrayerCount(postId: number): Promise<void>;
  decrementPrayerCount(postId: number): Promise<void>;
  
  // Love operations
  addLove(userId: string, postId: number): Promise<any>;
  removeLove(userId: string, postId: number): Promise<boolean>;
  hasUserLoved(userId: string, postId: number): Promise<boolean>;
  incrementLoveCount(postId: number): Promise<void>;
  decrementLoveCount(postId: number): Promise<void>;
  
  // Connection operations
  createConnection(requesterId: string, connection: InsertConnection): Promise<Connection>;
  getConnectionsByUser(userId: string): Promise<(Connection & { requester: User; addressee: User })[]>;
  updateConnectionStatus(id: number, status: string): Promise<Connection | undefined>;
  getAcceptedConnections(userId: string): Promise<User[]>;
  
  // Message operations
  createMessage(senderId: string, message: InsertMessage): Promise<Message>;
  getConversations(userId: string): Promise<{ user: User; lastMessage: Message; unreadCount: number }[]>;
  getMessagesBetweenUsers(userId1: string, userId2: string): Promise<(Message & { sender: User })[]>;
  markMessagesAsRead(senderId: string, receiverId: string): Promise<void>;
  
  // Comment operations
  createComment(userId: string, comment: InsertComment): Promise<Comment & { user: User }>;
  getCommentsByPost(postId: number): Promise<(Comment & { user: User })[]>;
  
  // Prayer operations
  addPrayer(userId: string, postId: number): Promise<Prayer>;
  removePrayer(userId: string, postId: number): Promise<boolean>;
  hasUserPrayed(userId: string, postId: number): Promise<boolean>;
  
  // Block operations
  blockUser(blockerId: string, blockedId: string): Promise<any>;
  unblockUser(blockerId: string, blockedId: string): Promise<boolean>;
  isUserBlocked(blockerId: string, blockedId: string): Promise<boolean>;
  getBlockedUsers(userId: string): Promise<User[]>;
  
  // Report operations
  createReport(reporterId: string, report: InsertReport): Promise<Report>;
  getAllReports(): Promise<(Report & { reporter: User; post: Post & { user: User } })[]>;
  updateReportStatus(reportId: number, status: string, reviewedBy?: string): Promise<Report | undefined>;
  getReportsByStatus(status: string): Promise<(Report & { reporter: User; post: Post & { user: User } })[]>;
}

export class MemStorage implements IStorage {
  private users: Map<string, User> = new Map();
  private posts: Map<number, Post> = new Map();
  private connections: Map<number, Connection> = new Map();
  private messages: Map<number, Message> = new Map();
  private comments: Map<number, Comment> = new Map();
  private prayers: Map<number, Prayer> = new Map();
  private loves: Map<number, any> = new Map();
  private blocks: Map<number, Block> = new Map();
  private reports: Map<number, Report> = new Map();

  private currentPostId = 1;
  private currentConnectionId = 1;
  private currentMessageId = 1;
  private currentCommentId = 1;
  private currentPrayerId = 1;
  private currentLoveId = 1;
  private currentBlockId = 1;
  private currentReportId = 1;

  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const existingUser = this.users.get(userData.id);
    const user: User = {
      id: userData.id,
      email: userData.email || null,
      firstName: userData.firstName || null,
      lastName: userData.lastName || null,
      profileImageUrl: userData.profileImageUrl || null,
      age: existingUser?.age || null,
      gender: existingUser?.gender || null,
      city: existingUser?.city || null,
      state: existingUser?.state || null,
      country: existingUser?.country || null,
      isAdmin: existingUser?.isAdmin || false,
      createdAt: existingUser?.createdAt || new Date(),
      updatedAt: new Date(),
    };
    this.users.set(userData.id, user);
    return user;
  }

  async updateUserProfile(id: string, data: Partial<User>): Promise<User | undefined> {
    const user = this.users.get(id);
    if (!user) return undefined;
    
    const updatedUser: User = {
      ...user,
      ...data,
      updatedAt: new Date(),
    };
    this.users.set(id, updatedUser);
    return updatedUser;
  }

  async getAllUsers(): Promise<User[]> {
    return Array.from(this.users.values()).sort((a, b) => 
      new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime()
    );
  }

  async deleteUser(id: string): Promise<boolean> {
    return this.users.delete(id);
  }

  async deleteUserCompletely(id: string): Promise<boolean> {
    // Delete all user-related data
    for (const [reportId, report] of this.reports) {
      if (report.reporterId === id) {
        this.reports.delete(reportId);
      }
    }
    
    for (const [blockId, block] of this.blocks) {
      if (block.blockerId === id || block.blockedId === id) {
        this.blocks.delete(blockId);
      }
    }
    
    for (const [loveId, love] of this.loves) {
      if (love.userId === id) {
        this.loves.delete(loveId);
      }
    }
    
    for (const [prayerId, prayer] of this.prayers) {
      if (prayer.userId === id) {
        this.prayers.delete(prayerId);
      }
    }
    
    for (const [commentId, comment] of this.comments) {
      if (comment.userId === id) {
        this.comments.delete(commentId);
      }
    }
    
    for (const [messageId, message] of this.messages) {
      if (message.senderId === id || message.receiverId === id) {
        this.messages.delete(messageId);
      }
    }
    
    for (const [connectionId, connection] of this.connections) {
      if (connection.requesterId === id || connection.addresseeId === id) {
        this.connections.delete(connectionId);
      }
    }
    
    for (const [postId, post] of this.posts) {
      if (post.userId === id) {
        this.posts.delete(postId);
      }
    }
    
    return this.users.delete(id);
  }

  async createPost(userId: string, postData: InsertPost): Promise<Post> {
    const post: Post = {
      id: this.currentPostId++,
      userId,
      content: postData.content,
      imageUrl: postData.imageUrl || null,
      location: postData.location || null,
      latitude: postData.latitude || null,
      longitude: postData.longitude || null,
      prayerCount: 0,
      commentCount: 0,
      loveCount: 0,
      createdAt: new Date(),
    };
    this.posts.set(post.id, post);
    return post;
  }

  async getAllPosts(currentUserId?: string): Promise<(Post & { user: User })[]> {
    const blockedUserIds: string[] = [];
    
    if (currentUserId) {
      for (const block of this.blocks.values()) {
        if (block.blockerId === currentUserId) {
          blockedUserIds.push(block.blockedId);
        }
      }
    }

    const postsWithUsers = Array.from(this.posts.values())
      .filter(post => !blockedUserIds.includes(post.userId))
      .map(post => {
        const user = this.users.get(post.userId);
        if (!user) throw new Error(`User ${post.userId} not found`);
        return { ...post, user };
      })
      .sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());

    return postsWithUsers;
  }

  async getPostsByUser(userId: string): Promise<Post[]> {
    return Array.from(this.posts.values())
      .filter(post => post.userId === userId)
      .sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());
  }

  async updatePost(id: number, data: Partial<InsertPost>): Promise<Post | undefined> {
    const post = this.posts.get(id);
    if (!post) return undefined;
    
    const updatedPost: Post = {
      ...post,
      ...data,
    };
    this.posts.set(id, updatedPost);
    return updatedPost;
  }

  async deletePost(id: number): Promise<boolean> {
    return this.posts.delete(id);
  }

  async incrementPrayerCount(postId: number): Promise<void> {
    const post = this.posts.get(postId);
    if (post) {
      post.prayerCount++;
      this.posts.set(postId, post);
    }
  }

  async decrementPrayerCount(postId: number): Promise<void> {
    const post = this.posts.get(postId);
    if (post && post.prayerCount > 0) {
      post.prayerCount--;
      this.posts.set(postId, post);
    }
  }

  async createConnection(requesterId: string, connectionData: InsertConnection): Promise<Connection> {
    const connection: Connection = {
      id: this.currentConnectionId++,
      requesterId,
      addresseeId: connectionData.addresseeId,
      status: connectionData.status || 'pending',
      createdAt: new Date(),
    };
    this.connections.set(connection.id, connection);
    return connection;
  }

  async getConnectionsByUser(userId: string): Promise<(Connection & { requester: User; addressee: User })[]> {
    const userConnections = Array.from(this.connections.values())
      .filter(connection => connection.addresseeId === userId)
      .map(connection => {
        const requester = this.users.get(connection.requesterId);
        const addressee = this.users.get(connection.addresseeId);
        if (!requester || !addressee) throw new Error('User not found');
        return { ...connection, requester, addressee };
      });
    
    return userConnections;
  }

  async updateConnectionStatus(id: number, status: string): Promise<Connection | undefined> {
    const connection = this.connections.get(id);
    if (!connection) return undefined;
    
    connection.status = status;
    this.connections.set(id, connection);
    return connection;
  }

  async getAcceptedConnections(userId: string): Promise<User[]> {
    const acceptedConnections = Array.from(this.connections.values())
      .filter(connection => 
        connection.status === 'accepted' && 
        (connection.requesterId === userId || connection.addresseeId === userId)
      );
    
    const connectedUserIds = acceptedConnections.map(connection => 
      connection.requesterId === userId ? connection.addresseeId : connection.requesterId
    );
    
    return connectedUserIds
      .map(id => this.users.get(id))
      .filter((user): user is User => user !== undefined);
  }

  async createMessage(senderId: string, messageData: InsertMessage): Promise<Message> {
    const message: Message = {
      id: this.currentMessageId++,
      senderId,
      receiverId: messageData.receiverId,
      content: messageData.content,
      read: false,
      createdAt: new Date(),
    };
    this.messages.set(message.id, message);
    return message;
  }

  async getConversations(userId: string): Promise<{ user: User; lastMessage: Message; unreadCount: number }[]> {
    const userMessages = Array.from(this.messages.values())
      .filter(message => message.senderId === userId || message.receiverId === userId);
    
    const conversationMap = new Map<string, { lastMessage: Message; unreadCount: number }>();
    
    for (const message of userMessages) {
      const otherUserId = message.senderId === userId ? message.receiverId : message.senderId;
      const existing = conversationMap.get(otherUserId);
      
      if (!existing || (message.createdAt && existing.lastMessage.createdAt && 
          new Date(message.createdAt) > new Date(existing.lastMessage.createdAt))) {
        const unreadCount = message.receiverId === userId && !message.read ? 1 : 0;
        conversationMap.set(otherUserId, { lastMessage: message, unreadCount });
      }
    }
    
    const conversations = Array.from(conversationMap.entries()).map(([otherUserId, data]) => {
      const user = this.users.get(otherUserId);
      if (!user) throw new Error(`User ${otherUserId} not found`);
      return { user, ...data };
    });
    
    return conversations.sort((a, b) => 
      new Date(b.lastMessage.createdAt || 0).getTime() - new Date(a.lastMessage.createdAt || 0).getTime()
    );
  }

  async getMessagesBetweenUsers(userId1: string, userId2: string): Promise<(Message & { sender: User })[]> {
    const messages = Array.from(this.messages.values())
      .filter(message => 
        (message.senderId === userId1 && message.receiverId === userId2) ||
        (message.senderId === userId2 && message.receiverId === userId1)
      )
      .map(message => {
        const sender = this.users.get(message.senderId);
        if (!sender) throw new Error(`User ${message.senderId} not found`);
        return { ...message, sender };
      })
      .sort((a, b) => new Date(a.createdAt || 0).getTime() - new Date(b.createdAt || 0).getTime());
    
    return messages;
  }

  async markMessagesAsRead(senderId: string, receiverId: string): Promise<void> {
    for (const message of this.messages.values()) {
      if (message.senderId === senderId && message.receiverId === receiverId) {
        message.read = true;
      }
    }
  }

  async createComment(userId: string, commentData: InsertComment): Promise<Comment & { user: User }> {
    const comment: Comment = {
      id: this.currentCommentId++,
      userId,
      postId: commentData.postId,
      content: commentData.content,
      createdAt: new Date(),
    };
    this.comments.set(comment.id, comment);
    
    const user = this.users.get(userId);
    if (!user) throw new Error(`User ${userId} not found`);
    
    return { ...comment, user };
  }

  async getCommentsByPost(postId: number): Promise<(Comment & { user: User })[]> {
    return Array.from(this.comments.values())
      .filter(comment => comment.postId === postId)
      .map(comment => {
        const user = this.users.get(comment.userId);
        if (!user) throw new Error(`User ${comment.userId} not found`);
        return { ...comment, user };
      })
      .sort((a, b) => new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime());
  }

  async addPrayer(userId: string, postId: number): Promise<Prayer> {
    const prayer: Prayer = {
      id: this.currentPrayerId++,
      userId,
      postId,
      createdAt: new Date(),
    };
    this.prayers.set(prayer.id, prayer);
    return prayer;
  }

  async removePrayer(userId: string, postId: number): Promise<boolean> {
    for (const [id, prayer] of this.prayers) {
      if (prayer.userId === userId && prayer.postId === postId) {
        return this.prayers.delete(id);
      }
    }
    return false;
  }

  async hasUserPrayed(userId: string, postId: number): Promise<boolean> {
    for (const prayer of this.prayers.values()) {
      if (prayer.userId === userId && prayer.postId === postId) {
        return true;
      }
    }
    return false;
  }

  async addLove(userId: string, postId: number): Promise<any> {
    const love = {
      id: this.currentLoveId++,
      userId,
      postId,
      createdAt: new Date(),
    };
    this.loves.set(love.id, love);
    return love;
  }

  async removeLove(userId: string, postId: number): Promise<boolean> {
    for (const [id, love] of this.loves) {
      if (love.userId === userId && love.postId === postId) {
        return this.loves.delete(id);
      }
    }
    return false;
  }

  async hasUserLoved(userId: string, postId: number): Promise<boolean> {
    for (const love of this.loves.values()) {
      if (love.userId === userId && love.postId === postId) {
        return true;
      }
    }
    return false;
  }

  async incrementLoveCount(postId: number): Promise<void> {
    const post = this.posts.get(postId);
    if (post) {
      post.loveCount++;
      this.posts.set(postId, post);
    }
  }

  async decrementLoveCount(postId: number): Promise<void> {
    const post = this.posts.get(postId);
    if (post && post.loveCount > 0) {
      post.loveCount--;
      this.posts.set(postId, post);
    }
  }

  async blockUser(blockerId: string, blockedId: string): Promise<any> {
    // Remove any existing connection first
    for (const [connectionId, connection] of this.connections) {
      if ((connection.requesterId === blockerId && connection.addresseeId === blockedId) ||
          (connection.requesterId === blockedId && connection.addresseeId === blockerId)) {
        this.connections.delete(connectionId);
      }
    }
    
    const block: Block = {
      id: this.currentBlockId++,
      blockerId,
      blockedId,
      createdAt: new Date(),
    };
    this.blocks.set(block.id, block);
    return block;
  }

  async unblockUser(blockerId: string, blockedId: string): Promise<boolean> {
    for (const [id, block] of this.blocks) {
      if (block.blockerId === blockerId && block.blockedId === blockedId) {
        return this.blocks.delete(id);
      }
    }
    return false;
  }

  async isUserBlocked(blockerId: string, blockedId: string): Promise<boolean> {
    for (const block of this.blocks.values()) {
      if (block.blockerId === blockerId && block.blockedId === blockedId) {
        return true;
      }
    }
    return false;
  }

  async getBlockedUsers(userId: string): Promise<User[]> {
    const blockedUserIds = Array.from(this.blocks.values())
      .filter(block => block.blockerId === userId)
      .map(block => block.blockedId);
    
    return blockedUserIds
      .map(id => this.users.get(id))
      .filter((user): user is User => user !== undefined);
  }

  async createReport(reporterId: string, reportData: InsertReport): Promise<Report> {
    const report: Report = {
      id: this.currentReportId++,
      reporterId,
      postId: reportData.postId,
      reason: reportData.reason,
      description: reportData.description || null,
      status: 'pending',
      createdAt: new Date(),
      reviewedAt: null,
      reviewedBy: null,
    };
    this.reports.set(report.id, report);
    return report;
  }

  async getAllReports(): Promise<(Report & { reporter: User; post: Post & { user: User } })[]> {
    const allReports = Array.from(this.reports.values()).map(report => {
      const reporter = this.users.get(report.reporterId);
      const post = this.posts.get(report.postId);
      if (!reporter || !post) throw new Error('Reporter or post not found');
      
      const postUser = this.users.get(post.userId);
      if (!postUser) throw new Error('Post user not found');
      
      return {
        ...report,
        reporter,
        post: { ...post, user: postUser }
      };
    });
    
    return allReports.sort((a, b) => 
      new Date(b.createdAt || 0).getTime() - new Date(a.createdAt || 0).getTime()
    );
  }

  async updateReportStatus(reportId: number, status: string, reviewedBy?: string): Promise<Report | undefined> {
    const report = this.reports.get(reportId);
    if (!report) return undefined;
    
    report.status = status;
    report.reviewedBy = reviewedBy || null;
    report.reviewedAt = new Date();
    this.reports.set(reportId, report);
    return report;
  }

  async getReportsByStatus(status: string): Promise<(Report & { reporter: User; post: Post & { user: User } })[]> {
    const allReports = await this.getAllReports();
    return allReports.filter(report => report.status === status);
  }
}

import { users, posts, connections, messages, comments, prayers, loves, blocks, reports } from "@shared/schema";
import { db } from "./db";
import { eq, and, desc, sql, or } from "drizzle-orm";

export class DatabaseStorage implements IStorage {
  async getUser(id: string): Promise<User | undefined> {
    const [user] = await db.select().from(users).where(eq(users.id, id));
    return user || undefined;
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const [user] = await db
      .insert(users)
      .values(userData)
      .onConflictDoUpdate({
        target: users.id,
        set: {
          ...userData,
          updatedAt: new Date(),
        },
      })
      .returning();
    return user;
  }

  async updateUserProfile(id: string, data: Partial<User>): Promise<User | undefined> {
    const [user] = await db
      .update(users)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(users.id, id))
      .returning();
    return user || undefined;
  }

  async getAllUsers(): Promise<User[]> {
    return await db.select().from(users).orderBy(desc(users.createdAt));
  }

  async deleteUser(id: string): Promise<boolean> {
    const result = await db.delete(users).where(eq(users.id, id));
    return result.rowCount! > 0;
  }

  async deleteUserCompletely(id: string): Promise<boolean> {
    // Delete all user-related data in proper order (foreign key constraints)
    await db.delete(reports).where(eq(reports.reporterId, id));
    await db.delete(blocks).where(eq(blocks.blockerId, id));
    await db.delete(blocks).where(eq(blocks.blockedId, id));
    await db.delete(loves).where(eq(loves.userId, id));
    await db.delete(prayers).where(eq(prayers.userId, id));
    await db.delete(comments).where(eq(comments.userId, id));
    await db.delete(messages).where(eq(messages.senderId, id));
    await db.delete(messages).where(eq(messages.receiverId, id));
    await db.delete(connections).where(eq(connections.requesterId, id));
    await db.delete(connections).where(eq(connections.addresseeId, id));
    await db.delete(posts).where(eq(posts.userId, id));
    
    const result = await db.delete(users).where(eq(users.id, id));
    return result.rowCount! > 0;
  }

  async createPost(userId: string, postData: InsertPost): Promise<Post> {
    const [post] = await db
      .insert(posts)
      .values({ ...postData, userId })
      .returning();
    return post;
  }

  async getAllPosts(currentUserId?: string): Promise<(Post & { user: User })[]> {
    let blockedUserIds: string[] = [];
    
    if (currentUserId) {
      const blockRelations = await db
        .select({ blockedId: blocks.blockedId })
        .from(blocks)
        .where(eq(blocks.blockerId, currentUserId));
      blockedUserIds = blockRelations.map(b => b.blockedId);
    }

    const query = db
      .select({
        id: posts.id,
        content: posts.content,
        imageUrl: posts.imageUrl,
        location: posts.location,
        latitude: posts.latitude,
        longitude: posts.longitude,
        prayerCount: posts.prayerCount,
        commentCount: posts.commentCount,
        loveCount: posts.loveCount,
        createdAt: posts.createdAt,
        userId: posts.userId,
        user: {
          id: users.id,
          firstName: users.firstName,
          lastName: users.lastName,
          email: users.email,
          profileImageUrl: users.profileImageUrl,
          age: users.age,
          gender: users.gender,
          city: users.city,
          state: users.state,
          country: users.country,
          isAdmin: users.isAdmin,
          createdAt: users.createdAt,
          updatedAt: users.updatedAt,
        }
      })
      .from(posts)
      .innerJoin(users, eq(posts.userId, users.id))
      .orderBy(desc(posts.createdAt));

    const allPosts = await query;
    
    // Filter out posts from blocked users
    return allPosts.filter(post => !blockedUserIds.includes(post.userId));
  }

  async getPostsByUser(userId: string): Promise<Post[]> {
    return await db.select().from(posts).where(eq(posts.userId, userId)).orderBy(desc(posts.createdAt));
  }

  async updatePost(id: number, data: Partial<InsertPost>): Promise<Post | undefined> {
    const [post] = await db
      .update(posts)
      .set(data)
      .where(eq(posts.id, id))
      .returning();
    return post || undefined;
  }

  async deletePost(id: number): Promise<boolean> {
    const result = await db.delete(posts).where(eq(posts.id, id));
    return result.rowCount! > 0;
  }

  async incrementPrayerCount(postId: number): Promise<void> {
    await db
      .update(posts)
      .set({ prayerCount: sql`${posts.prayerCount} + 1` })
      .where(eq(posts.id, postId));
  }

  async decrementPrayerCount(postId: number): Promise<void> {
    await db
      .update(posts)
      .set({ prayerCount: sql`${posts.prayerCount} - 1` })
      .where(eq(posts.id, postId));
  }

  async createConnection(requesterId: string, connectionData: InsertConnection): Promise<Connection> {
    const [connection] = await db
      .insert(connections)
      .values({ ...connectionData, requesterId })
      .returning();
    return connection;
  }

  async getConnectionsByUser(userId: string): Promise<(Connection & { requester: User; addressee: User })[]> {
    // Simplified implementation for now - would need complex joins
    return [];
  }

  async updateConnectionStatus(id: number, status: string): Promise<Connection | undefined> {
    const [connection] = await db
      .update(connections)
      .set({ status })
      .where(eq(connections.id, id))
      .returning();
    return connection || undefined;
  }

  async getAcceptedConnections(userId: string): Promise<User[]> {
    // Simplified implementation for now
    return [];
  }

  async createMessage(senderId: string, messageData: InsertMessage): Promise<Message> {
    const [message] = await db
      .insert(messages)
      .values({ ...messageData, senderId })
      .returning();
    return message;
  }

  async getConversations(userId: string): Promise<{ user: User; lastMessage: Message; unreadCount: number }[]> {
    // Simplified implementation for now
    return [];
  }

  async getMessagesBetweenUsers(userId1: string, userId2: string): Promise<(Message & { sender: User })[]> {
    // Simplified implementation for now
    return [];
  }

  async markMessagesAsRead(senderId: string, receiverId: string): Promise<void> {
    await db
      .update(messages)
      .set({ read: true })
      .where(and(eq(messages.senderId, senderId), eq(messages.receiverId, receiverId)));
  }

  async createComment(userId: string, commentData: InsertComment): Promise<Comment & { user: User }> {
    const [comment] = await db
      .insert(comments)
      .values({ ...commentData, userId })
      .returning();

    const [user] = await db.select().from(users).where(eq(users.id, userId));
    
    // Increment the comment count on the post
    await db
      .update(posts)
      .set({ commentCount: sql`${posts.commentCount} + 1` })
      .where(eq(posts.id, commentData.postId));
    
    return { ...comment, user };
  }

  async getCommentsByPost(postId: number): Promise<(Comment & { user: User })[]> {
    return await db
      .select({
        id: comments.id,
        content: comments.content,
        createdAt: comments.createdAt,
        userId: comments.userId,
        postId: comments.postId,
        user: {
          id: users.id,
          firstName: users.firstName,
          lastName: users.lastName,
          email: users.email,
          profileImageUrl: users.profileImageUrl,
          age: users.age,
          gender: users.gender,
          city: users.city,
          state: users.state,
          country: users.country,
          isAdmin: users.isAdmin,
          createdAt: users.createdAt,
          updatedAt: users.updatedAt,
        }
      })
      .from(comments)
      .innerJoin(users, eq(comments.userId, users.id))
      .where(eq(comments.postId, postId))
      .orderBy(desc(comments.createdAt));
  }

  async addPrayer(userId: string, postId: number): Promise<Prayer> {
    const [prayer] = await db
      .insert(prayers)
      .values({ userId, postId })
      .returning();
    
    // Increment the prayer count on the post
    await this.incrementPrayerCount(postId);
    
    return prayer;
  }

  async removePrayer(userId: string, postId: number): Promise<boolean> {
    const result = await db
      .delete(prayers)
      .where(and(eq(prayers.userId, userId), eq(prayers.postId, postId)));
    
    if (result.rowCount! > 0) {
      // Decrement the prayer count on the post
      await this.decrementPrayerCount(postId);
      return true;
    }
    
    return false;
  }

  async hasUserPrayed(userId: string, postId: number): Promise<boolean> {
    const [prayer] = await db
      .select()
      .from(prayers)
      .where(and(eq(prayers.userId, userId), eq(prayers.postId, postId)));
    return !!prayer;
  }

  async addLove(userId: string, postId: number): Promise<any> {
    const [love] = await db
      .insert(loves)
      .values({ userId, postId })
      .returning();
    
    // Increment the love count on the post
    await this.incrementLoveCount(postId);
    
    return love;
  }

  async removeLove(userId: string, postId: number): Promise<boolean> {
    const result = await db
      .delete(loves)
      .where(and(eq(loves.userId, userId), eq(loves.postId, postId)));
    
    if (result.rowCount! > 0) {
      // Decrement the love count on the post
      await this.decrementLoveCount(postId);
      return true;
    }
    
    return false;
  }

  async hasUserLoved(userId: string, postId: number): Promise<boolean> {
    const [love] = await db
      .select()
      .from(loves)
      .where(and(eq(loves.userId, userId), eq(loves.postId, postId)));
    return !!love;
  }

  async incrementLoveCount(postId: number): Promise<void> {
    await db
      .update(posts)
      .set({ loveCount: sql`${posts.loveCount} + 1` })
      .where(eq(posts.id, postId));
  }

  async decrementLoveCount(postId: number): Promise<void> {
    await db
      .update(posts)
      .set({ loveCount: sql`${posts.loveCount} - 1` })
      .where(eq(posts.id, postId));
  }

  async blockUser(blockerId: string, blockedId: string): Promise<any> {
    const [block] = await db
      .insert(blocks)
      .values({ blockerId, blockedId })
      .returning();
    return block;
  }

  async unblockUser(blockerId: string, blockedId: string): Promise<boolean> {
    const result = await db
      .delete(blocks)
      .where(and(eq(blocks.blockerId, blockerId), eq(blocks.blockedId, blockedId)));
    return result.rowCount! > 0;
  }

  async isUserBlocked(blockerId: string, blockedId: string): Promise<boolean> {
    const [block] = await db
      .select()
      .from(blocks)
      .where(and(eq(blocks.blockerId, blockerId), eq(blocks.blockedId, blockedId)));
    return !!block;
  }

  async getBlockedUsers(userId: string): Promise<User[]> {
    return await db
      .select({
        id: users.id,
        firstName: users.firstName,
        lastName: users.lastName,
        email: users.email,
        profileImageUrl: users.profileImageUrl,
        age: users.age,
        gender: users.gender,
        city: users.city,
        state: users.state,
        country: users.country,
        isAdmin: users.isAdmin,
        createdAt: users.createdAt,
        updatedAt: users.updatedAt,
      })
      .from(blocks)
      .innerJoin(users, eq(blocks.blockedId, users.id))
      .where(eq(blocks.blockerId, userId));
  }

  async createReport(reporterId: string, reportData: InsertReport): Promise<Report> {
    const [report] = await db
      .insert(reports)
      .values({ 
        ...reportData, 
        reporterId,
        description: reportData.description || null
      })
      .returning();
    return report;
  }

  async getAllReports(): Promise<(Report & { reporter: User; post: Post & { user: User } })[]> {
    // Simplified implementation for now
    return [];
  }

  async updateReportStatus(reportId: number, status: string, reviewedBy?: string): Promise<Report | undefined> {
    const [report] = await db
      .update(reports)
      .set({ 
        status, 
        reviewedBy, 
        reviewedAt: new Date()
      })
      .where(eq(reports.id, reportId))
      .returning();
    return report || undefined;
  }

  async getReportsByStatus(status: string): Promise<(Report & { reporter: User; post: Post & { user: User } })[]> {
    // Simplified implementation for now
    return [];
  }
}

export const storage = new DatabaseStorage();