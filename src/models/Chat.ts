import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IMessage {
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
  sources?: Array<{
    doc_name: string;
    category: string;
    similarity: number;
    preview: string;
  }>;
}

export interface IChat extends Document {
  userId: mongoose.Types.ObjectId;
  chatId: string;
  title: string;
  messages: IMessage[];
  createdAt: Date;
  updatedAt: Date;
  metadata: {
    totalMessages: number;
    topics: string[];
    documentIds: string[];
    lastMessageAt: Date;
  };
}

const MessageSchema = new Schema<IMessage>({
  role: {
    type: String,
    enum: ['user', 'assistant', 'system'],
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
  sources: [{
    doc_name: String,
    category: String,
    similarity: Number,
    preview: String,
  }],
}, { _id: false });

const ChatSchema = new Schema<IChat>({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true,
  },
  chatId: {
    type: String,
    required: true,
    unique: true,
    index: true,
  },
  title: {
    type: String,
    required: true,
    default: 'New chat',
  },
  messages: {
    type: [MessageSchema],
    default: [],
  },
  metadata: {
    totalMessages: {
      type: Number,
      default: 0,
    },
    topics: {
      type: [String],
      default: [],
    },
    documentIds: {
      type: [String],
      default: [],
    },
    lastMessageAt: {
      type: Date,
      default: Date.now,
    },
  },
}, {
  timestamps: true,
});

// Indexes for better query performance
ChatSchema.index({ userId: 1, updatedAt: -1 });
ChatSchema.index({ chatId: 1 });

// Pre-save middleware to update metadata
ChatSchema.pre('save', function(next) {
  if (this.messages && this.messages.length > 0) {
    this.metadata.totalMessages = this.messages.length;
    this.metadata.lastMessageAt = this.messages[this.messages.length - 1].timestamp;
  }
  next();
});

// Static method to find user's chats
ChatSchema.statics.findByUserId = function(userId: string) {
  return this.find({ userId })
    .sort({ updatedAt: -1 })
    .select('-messages') // Exclude messages for list view
    .limit(50);
};

// Static method to extract topics from messages (basic NLP)
ChatSchema.statics.extractTopics = function(messages: IMessage[]): string[] {
  const topics = new Set<string>();
  const educationalKeywords = [
    'math', 'science', 'history', 'english', 'physics', 'chemistry', 
    'biology', 'algebra', 'calculus', 'geometry', 'literature',
    'grammar', 'writing', 'reading', 'essay', 'equation', 'formula',
    'theory', 'concept', 'homework', 'study', 'exam', 'test', 'quiz'
  ];

  messages.forEach(msg => {
    if (msg.role === 'user') {
      const lowerContent = msg.content.toLowerCase();
      educationalKeywords.forEach(keyword => {
        if (lowerContent.includes(keyword)) {
          topics.add(keyword);
        }
      });
    }
  });

  return Array.from(topics);
};

// Prevent model recompilation in development
const Chat: Model<IChat> = mongoose.models.Chat || mongoose.model<IChat>('Chat', ChatSchema);

export default Chat;
