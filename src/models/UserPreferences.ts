import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IUserPreferences extends Document {
  userId: mongoose.Types.ObjectId;
  learningStyle: 'visual' | 'text' | 'interactive' | 'mixed';
  favoriteSubjects: string[];
  difficultyLevel: 'beginner' | 'intermediate' | 'advanced';
  chatSettings: {
    autoSaveChats: boolean;
    maxHistoryLength: number;
    preferredResponseStyle: 'concise' | 'detailed' | 'adaptive';
    enableCharts: boolean;
    enableCodeExamples: boolean;
  };
  conversationHistory: {
    totalChats: number;
    totalMessages: number;
    topicsDiscussed: string[];
    commonQuestions: string[];
    averageSessionLength: number; // in minutes
    preferredStudyTime: string[]; // e.g., ["morning", "evening"]
  };
  learningPatterns: {
    questionTypes: Map<string, number>; // e.g., {"explanation": 45, "problem-solving": 30}
    subjectFrequency: Map<string, number>; // e.g., {"math": 20, "science": 15}
    responseQuality: number; // 0-100, based on follow-up questions
    comprehensionLevel: number; // 0-100, estimated from interactions
  };
  personalizedPrompts: {
    greetingStyle: string;
    explanationDepth: string;
    examplePreference: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

const UserPreferencesSchema = new Schema<IUserPreferences>({
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true,
    index: true,
  },
  learningStyle: {
    type: String,
    enum: ['visual', 'text', 'interactive', 'mixed'],
    default: 'mixed',
  },
  favoriteSubjects: {
    type: [String],
    default: [],
  },
  difficultyLevel: {
    type: String,
    enum: ['beginner', 'intermediate', 'advanced'],
    default: 'intermediate',
  },
  chatSettings: {
    autoSaveChats: {
      type: Boolean,
      default: true,
    },
    maxHistoryLength: {
      type: Number,
      default: 50,
    },
    preferredResponseStyle: {
      type: String,
      enum: ['concise', 'detailed', 'adaptive'],
      default: 'adaptive',
    },
    enableCharts: {
      type: Boolean,
      default: true,
    },
    enableCodeExamples: {
      type: Boolean,
      default: true,
    },
  },
  conversationHistory: {
    totalChats: {
      type: Number,
      default: 0,
    },
    totalMessages: {
      type: Number,
      default: 0,
    },
    topicsDiscussed: {
      type: [String],
      default: [],
    },
    commonQuestions: {
      type: [String],
      default: [],
    },
    averageSessionLength: {
      type: Number,
      default: 0,
    },
    preferredStudyTime: {
      type: [String],
      default: [],
    },
  },
  learningPatterns: {
    questionTypes: {
      type: Map,
      of: Number,
      default: new Map(),
    },
    subjectFrequency: {
      type: Map,
      of: Number,
      default: new Map(),
    },
    responseQuality: {
      type: Number,
      default: 50,
      min: 0,
      max: 100,
    },
    comprehensionLevel: {
      type: Number,
      default: 50,
      min: 0,
      max: 100,
    },
  },
  personalizedPrompts: {
    greetingStyle: {
      type: String,
      default: 'friendly',
    },
    explanationDepth: {
      type: String,
      default: 'balanced',
    },
    examplePreference: {
      type: String,
      default: 'real-world',
    },
  },
}, {
  timestamps: true,
});

// Static method to get or create preferences
UserPreferencesSchema.statics.getOrCreate = async function(userId: string) {
  let preferences = await this.findOne({ userId });
  
  if (!preferences) {
    preferences = await this.create({
      userId,
      learningStyle: 'mixed',
      difficultyLevel: 'intermediate',
    });
  }
  
  return preferences;
};

// Instance method to update learning patterns from new message
UserPreferencesSchema.methods.updateFromMessage = function(message: string, isQuestion: boolean) {
  // Extract topics
  const topics = extractTopicsFromText(message);
  topics.forEach(topic => {
    if (!this.conversationHistory.topicsDiscussed.includes(topic)) {
      this.conversationHistory.topicsDiscussed.push(topic);
    }
    
    // Update subject frequency
    const currentFreq = this.learningPatterns.subjectFrequency.get(topic) || 0;
    this.learningPatterns.subjectFrequency.set(topic, currentFreq + 1);
  });
  
  // Classify question type
  if (isQuestion) {
    const questionType = classifyQuestion(message);
    const currentCount = this.learningPatterns.questionTypes.get(questionType) || 0;
    this.learningPatterns.questionTypes.set(questionType, currentCount + 1);
  }
  
  // Increment message count
  this.conversationHistory.totalMessages += 1;
  
  return this;
};

// Instance method to get personalized system prompt
UserPreferencesSchema.methods.getPersonalizedPrompt = function(): string {
  const basePrompt = "You are SynapseAI Student Assistant.";
  
  let additions = [];
  
  // Adapt based on learning style
  if (this.learningStyle === 'visual') {
    additions.push("Focus on suggesting charts, diagrams, and visual representations.");
  }
  
  // Adapt based on difficulty level
  if (this.difficultyLevel === 'beginner') {
    additions.push("Use simple language and provide more examples. Break down concepts into very small steps.");
  } else if (this.difficultyLevel === 'advanced') {
    additions.push("You can use technical terminology and provide in-depth explanations.");
  }
  
  // Adapt based on favorite subjects
  if (this.favoriteSubjects.length > 0) {
    additions.push(`The student often studies: ${this.favoriteSubjects.join(', ')}.`);
  }
  
  // Adapt based on response style
  if (this.chatSettings.preferredResponseStyle === 'concise') {
    additions.push("Keep responses brief and to the point.");
  } else if (this.chatSettings.preferredResponseStyle === 'detailed') {
    additions.push("Provide comprehensive, detailed explanations with multiple examples.");
  }
  
  return additions.length > 0 
    ? `${basePrompt} ${additions.join(' ')}` 
    : basePrompt;
};

// Helper functions
function extractTopicsFromText(text: string): string[] {
  const topics: string[] = [];
  const lowerText = text.toLowerCase();
  
  const topicKeywords: { [key: string]: string[] } = {
    math: ['math', 'algebra', 'calculus', 'geometry', 'equation', 'formula'],
    science: ['science', 'physics', 'chemistry', 'biology', 'experiment'],
    history: ['history', 'war', 'revolution', 'ancient', 'century'],
    english: ['english', 'grammar', 'writing', 'essay', 'literature'],
    programming: ['code', 'programming', 'python', 'javascript', 'algorithm'],
  };
  
  Object.entries(topicKeywords).forEach(([topic, keywords]) => {
    if (keywords.some(keyword => lowerText.includes(keyword))) {
      topics.push(topic);
    }
  });
  
  return topics;
}

function classifyQuestion(question: string): string {
  const lowerQuestion = question.toLowerCase();
  
  if (lowerQuestion.includes('explain') || lowerQuestion.includes('what is') || lowerQuestion.includes('how does')) {
    return 'explanation';
  } else if (lowerQuestion.includes('solve') || lowerQuestion.includes('calculate') || lowerQuestion.includes('find')) {
    return 'problem-solving';
  } else if (lowerQuestion.includes('example') || lowerQuestion.includes('show me')) {
    return 'example-request';
  } else if (lowerQuestion.includes('study') || lowerQuestion.includes('prepare') || lowerQuestion.includes('plan')) {
    return 'study-planning';
  } else if (lowerQuestion.includes('practice') || lowerQuestion.includes('quiz') || lowerQuestion.includes('test')) {
    return 'practice';
  }
  
  return 'general';
}

// Prevent model recompilation in development
const UserPreferences: Model<IUserPreferences> = 
  mongoose.models.UserPreferences || 
  mongoose.model<IUserPreferences>('UserPreferences', UserPreferencesSchema);

export default UserPreferences;
