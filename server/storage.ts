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