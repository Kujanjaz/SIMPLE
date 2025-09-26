// Core data models and TypeScript interfaces

export interface Task {
  id: string;
  title: string;
  description?: string;
  completed: boolean;
  createdAt: Date;
  completedAt?: Date;
  linkedGoals: string[];
  type: 'one-off' | 'recurring';
  shouldDisappear: boolean; // True for unlinked one-off tasks
  animationState: 'idle' | 'completing' | 'disappearing' | 'completed';
}

export interface Goal {
  id: string;
  title: string;
  description: string;
  progress: number; // 0-100
  linkedTasks: string[];
  category: string;
  createdAt: Date;
  targetDate?: Date;
  dailyProgress: GoalProgress[];
}

export interface GoalProgress {
  goalId: string;
  progressChange: number;
  tasksCompleted: string[];
  timeSpent: number; // Minutes spent on this goal
  date: string;
}

export interface SigilState {
  level: 'novice' | 'apprentice' | 'adept' | 'master';
  aspects: {
    discipline: number;
    knowledge: number;
    creativity: number;
    physical: number;
    spiritual: number;
  };
  currentDesign: string; // Base64 encoded sigil
  evolutionHistory: SigilEvolution[];
}

export interface SigilEvolution {
  aspect: 'discipline' | 'knowledge' | 'creativity' | 'physical' | 'spiritual';
  change: number; // Positive or negative change
  reason: string; // What triggered the change
  timestamp: Date;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  category: 'consistency' | 'depth' | 'integration' | 'milestone';
  unlockedAt?: Date;
  icon: string;
}

export interface DailyProgress {
  date: string; // YYYY-MM-DD format
  tasksCompleted: string[]; // Array of task IDs
  goalsProgress: GoalProgress[];
  sigilChanges: SigilEvolution[];
  energyLevel: number; // 1-10 scale
  deepWorkMinutes: number;
  notes?: string;
}

export interface UserStats {
  totalTasksCompleted: number;
  currentStreak: number;
  longestStreak: number;
  averageDailyCompletion: number;
  sigilEvolutionCount: number;
  deepWorkHours: number;
  lastActiveDate: Date;
}

export interface UserSettings {
  theme: 'light' | 'dark' | 'auto';
  notifications: boolean;
  backupFrequency: 'daily' | 'weekly' | 'monthly';
  sigilComplexity: 'simple' | 'detailed';
  progressReminders: boolean;
}

export interface User {
  id: string;
  sigil: SigilState;
  achievements: Achievement[];
  tasks: Task[];
  goals: Goal[];
  stats: UserStats;
  dailyProgress: DailyProgress[];
  settings: UserSettings;
}

// Default user data
export const defaultUser: User = {
  id: 'user-1',
  sigil: {
    level: 'novice',
    aspects: {
      discipline: 0,
      knowledge: 0,
      creativity: 0,
      physical: 0,
      spiritual: 0
    },
    currentDesign: '',
    evolutionHistory: []
  },
  achievements: [],
  tasks: [],
  goals: [],
  stats: {
    totalTasksCompleted: 0,
    currentStreak: 0,
    longestStreak: 0,
    averageDailyCompletion: 0,
    sigilEvolutionCount: 0,
    deepWorkHours: 0,
    lastActiveDate: new Date()
  },
  dailyProgress: [],
  settings: {
    theme: 'light',
    notifications: true,
    backupFrequency: 'daily',
    sigilComplexity: 'simple',
    progressReminders: true
  }
};
