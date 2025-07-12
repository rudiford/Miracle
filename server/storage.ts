import {
  users,
  posts,
  connections,
  messages,
  comments,
  prayers,
  type User,
  type UpsertUser,
  type Post,
  type InsertPost,
  type Connection,
  type InsertConnection,
  type Message,
  type InsertMessage,
  type Comment,
  type InsertComment,
  type Prayer,
} from "@shared/schema";

export interface IStorage {
  // User operations (mandatory for Replit Auth)
  getUser(id: string): Promise<User | undefined>;
  upsertUser(user: UpsertUser): Promise<User>;
  updateUserProfile(id: string, data: Partial<User>): Promise<User | undefined>;
  getAllUsers(): Promise<User[]>;
  deleteUser(id: string): Promise<boolean>;
  
  // Post operations
  createPost(userId: string, post: InsertPost): Promise<Post>;
  getAllPosts(): Promise<(Post & { user: User })[]>;
  getPostsByUser(userId: string): Promise<Post[]>;
  updatePost(id: number, data: Partial<InsertPost>): Promise<Post | undefined>;
  deletePost(id: number): Promise<boolean>;
  incrementPrayerCount(postId: number): Promise<void>;
  decrementPrayerCount(postId: number): Promise<void>;
  
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
}

export class MemStorage implements IStorage {
  private users: Map<string, User> = new Map();
  private posts: Map<number, Post> = new Map();
  private connections: Map<number, Connection> = new Map();
  private messages: Map<number, Message> = new Map();
  private comments: Map<number, Comment> = new Map();
  private prayers: Map<number, Prayer> = new Map();
  
  private currentPostId = 1;
  private currentConnectionId = 1;
  private currentMessageId = 1;
  private currentCommentId = 1;
  private currentPrayerId = 1;

  // User operations
  async getUser(id: string): Promise<User | undefined> {
    return this.users.get(id);
  }

  async upsertUser(userData: UpsertUser): Promise<User> {
    const existingUser = this.users.get(userData.id!);
    const user: User = {
      id: userData.id!,
      email: userData.email ?? null,
      firstName: userData.firstName ?? null,
      lastName: userData.lastName ?? null,
      profileImageUrl: userData.profileImageUrl ?? null,
      age: userData.age ?? null,
      gender: userData.gender ?? null,
      city: userData.city ?? null,
      state: userData.state ?? null,
      country: userData.country ?? null,
      isAdmin: userData.id === 'rudycced@gmail.com' || existingUser?.isAdmin || false,
      createdAt: existingUser?.createdAt ?? new Date(),
      updatedAt: new Date(),
    };
    this.users.set(user.id, user);
    return user;
  }

  async updateUserProfile(id: string, data: Partial<User>): Promise<User | undefined> {
    const user = this.users.get(id);
    if (!user) return undefined;
    
    const updatedUser = { ...user, ...data, updatedAt: new Date() };
    this.users.set(id, updatedUser);
    return updatedUser;
  }

  async getAllUsers(): Promise<User[]> {
    return Array.from(this.users.values());
  }

  async deleteUser(id: string): Promise<boolean> {
    return this.users.delete(id);
  }

  // Post operations
  async createPost(userId: string, postData: InsertPost): Promise<Post> {
    const post: Post = {
      id: this.currentPostId++,
      userId,
      content: postData.content,
      imageUrl: postData.imageUrl ?? null,
      latitude: postData.latitude ?? null,
      longitude: postData.longitude ?? null,
      location: postData.location ?? null,
      prayerCount: 0,
      commentCount: 0,
      createdAt: new Date(),
    };
    this.posts.set(post.id, post);
    return post;
  }

  async getAllPosts(): Promise<(Post & { user: User })[]> {
    const postsArray = Array.from(this.posts.values());
    const postsWithUsers = postsArray.map(post => {
      const user = this.users.get(post.userId);
      return { ...post, user: user! };
    }).filter(post => post.user);
    
    // Sort by creation date, newest first
    return postsWithUsers.sort((a, b) => new Date(b.createdAt!).getTime() - new Date(a.createdAt!).getTime());
  }

  async getPostsByUser(userId: string): Promise<Post[]> {
    return Array.from(this.posts.values()).filter(post => post.userId === userId);
  }

  async updatePost(id: number, data: Partial<InsertPost>): Promise<Post | undefined> {
    const existingPost = this.posts.get(id);
    if (!existingPost) {
      return undefined;
    }

    const updatedPost: Post = {
      ...existingPost,
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
      post.prayerCount = (post.prayerCount || 0) + 1;
      this.posts.set(postId, post);
    }
  }

  async decrementPrayerCount(postId: number): Promise<void> {
    const post = this.posts.get(postId);
    if (post && post.prayerCount && post.prayerCount > 0) {
      post.prayerCount = post.prayerCount - 1;
      this.posts.set(postId, post);
    }
  }

  // Connection operations
  async createConnection(requesterId: string, connectionData: InsertConnection): Promise<Connection> {
    const connection: Connection = {
      id: this.currentConnectionId++,
      requesterId,
      ...connectionData,
      status: "pending",
      createdAt: new Date(),
    };
    this.connections.set(connection.id, connection);
    return connection;
  }

  async getConnectionsByUser(userId: string): Promise<(Connection & { requester: User; addressee: User })[]> {
    const userConnections = Array.from(this.connections.values())
      .filter(conn => conn.requesterId === userId || conn.addresseeId === userId);
    
    return userConnections.map(conn => {
      const requester = this.users.get(conn.requesterId);
      const addressee = this.users.get(conn.addresseeId);
      return { ...conn, requester: requester!, addressee: addressee! };
    }).filter(conn => conn.requester && conn.addressee);
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
      .filter(conn => 
        (conn.requesterId === userId || conn.addresseeId === userId) && 
        conn.status === "accepted"
      );
    
    const connectedUserIds = acceptedConnections.map(conn => 
      conn.requesterId === userId ? conn.addresseeId : conn.requesterId
    );
    
    return connectedUserIds.map(id => this.users.get(id)).filter(Boolean) as User[];
  }

  // Message operations
  async createMessage(senderId: string, messageData: InsertMessage): Promise<Message> {
    const message: Message = {
      id: this.currentMessageId++,
      senderId,
      ...messageData,
      read: false,
      createdAt: new Date(),
    };
    this.messages.set(message.id, message);
    return message;
  }

  async getConversations(userId: string): Promise<{ user: User; lastMessage: Message; unreadCount: number }[]> {
    const userMessages = Array.from(this.messages.values())
      .filter(msg => msg.senderId === userId || msg.receiverId === userId);
    
    const conversationMap = new Map<string, { messages: Message[]; otherUserId: string }>();
    
    userMessages.forEach(msg => {
      const otherUserId = msg.senderId === userId ? msg.receiverId : msg.senderId;
      if (!conversationMap.has(otherUserId)) {
        conversationMap.set(otherUserId, { messages: [], otherUserId });
      }
      conversationMap.get(otherUserId)!.messages.push(msg);
    });
    
    const conversations = Array.from(conversationMap.values()).map(conv => {
      const user = this.users.get(conv.otherUserId);
      const sortedMessages = conv.messages.sort((a, b) => 
        new Date(b.createdAt!).getTime() - new Date(a.createdAt!).getTime()
      );
      const lastMessage = sortedMessages[0];
      const unreadCount = conv.messages.filter(msg => 
        msg.senderId === conv.otherUserId && !msg.read
      ).length;
      
      return { user: user!, lastMessage, unreadCount };
    }).filter(conv => conv.user);
    
    return conversations.sort((a, b) => 
      new Date(b.lastMessage.createdAt!).getTime() - new Date(a.lastMessage.createdAt!).getTime()
    );
  }

  async getMessagesBetweenUsers(userId1: string, userId2: string): Promise<(Message & { sender: User })[]> {
    const messages = Array.from(this.messages.values())
      .filter(msg => 
        (msg.senderId === userId1 && msg.receiverId === userId2) ||
        (msg.senderId === userId2 && msg.receiverId === userId1)
      );
    
    return messages.map(msg => {
      const sender = this.users.get(msg.senderId);
      return { ...msg, sender: sender! };
    }).filter(msg => msg.sender)
      .sort((a, b) => new Date(a.createdAt!).getTime() - new Date(b.createdAt!).getTime());
  }

  async markMessagesAsRead(senderId: string, receiverId: string): Promise<void> {
    Array.from(this.messages.values())
      .filter(msg => msg.senderId === senderId && msg.receiverId === receiverId)
      .forEach(msg => {
        msg.read = true;
        this.messages.set(msg.id, msg);
      });
  }

  // Comment operations
  async createComment(userId: string, commentData: InsertComment): Promise<Comment & { user: User }> {
    const comment: Comment = {
      id: this.currentCommentId++,
      userId,
      ...commentData,
      createdAt: new Date(),
    };
    this.comments.set(comment.id, comment);
    
    // Increment comment count on post
    const post = this.posts.get(commentData.postId);
    if (post) {
      post.commentCount = (post.commentCount || 0) + 1;
      this.posts.set(post.id, post);
    }
    
    const user = this.users.get(userId);
    return { ...comment, user: user! };
  }

  async getCommentsByPost(postId: number): Promise<(Comment & { user: User })[]> {
    const postComments = Array.from(this.comments.values())
      .filter(comment => comment.postId === postId);
    
    return postComments.map(comment => {
      const user = this.users.get(comment.userId);
      return { ...comment, user: user! };
    }).filter(comment => comment.user)
      .sort((a, b) => new Date(a.createdAt!).getTime() - new Date(b.createdAt!).getTime());
  }

  // Prayer operations
  async addPrayer(userId: string, postId: number): Promise<Prayer> {
    const prayer: Prayer = {
      id: this.currentPrayerId++,
      userId,
      postId,
      createdAt: new Date(),
    };
    this.prayers.set(prayer.id, prayer);
    await this.incrementPrayerCount(postId);
    return prayer;
  }

  async removePrayer(userId: string, postId: number): Promise<boolean> {
    const prayer = Array.from(this.prayers.values())
      .find(p => p.userId === userId && p.postId === postId);
    
    if (prayer) {
      this.prayers.delete(prayer.id);
      await this.decrementPrayerCount(postId);
      return true;
    }
    return false;
  }

  async hasUserPrayed(userId: string, postId: number): Promise<boolean> {
    return Array.from(this.prayers.values())
      .some(p => p.userId === userId && p.postId === postId);
  }
}

export const storage = new MemStorage();
