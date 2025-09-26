import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User, Task, Goal, DailyProgress, SigilEvolution, defaultUser } from '../types';

interface AppState {
  user: User;
  
  // Task management
  addTask: (task: Omit<Task, 'id' | 'createdAt' | 'completed' | 'animationState'>) => void;
  completeTask: (taskId: string) => void;
  deleteTask: (taskId: string) => void;
  updateTask: (taskId: string, updates: Partial<Task>) => void;
  
  // Goal management
  addGoal: (goal: Omit<Goal, 'id' | 'createdAt' | 'progress' | 'dailyProgress'>) => void;
  updateGoalProgress: (goalId: string, progressChange: number, taskIds: string[]) => void;
  deleteGoal: (goalId: string) => void;
  updateGoal: (goalId: string, updates: Partial<Goal>) => void;
  
  // Progress tracking
  recordDailyProgress: (progress: Partial<DailyProgress>) => void;
  getTodayProgress: () => DailyProgress | null;
  
  // Sigil evolution
  evolveSigil: (evolution: SigilEvolution) => void;
  generateSigilDesign: () => string;
  
  // Stats
  updateStats: () => void;
  
  // Data persistence
  saveData: () => void;
  loadData: () => void;
  exportData: () => string;
  importData: (data: string) => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      user: defaultUser,
      
      addTask: (taskData) => {
        const newTask: Task = {
          ...taskData,
          id: `task-${Date.now()}`,
          createdAt: new Date(),
          completed: false,
          animationState: 'idle'
        };
        
        set((state) => ({
          user: {
            ...state.user,
            tasks: [...state.user.tasks, newTask]
          }
        }));
      },
      
      completeTask: (taskId) => {
        set((state) => {
          const task = state.user.tasks.find(t => t.id === taskId);
          if (!task) return state;
          
          const updatedTask = {
            ...task,
            completed: true,
            completedAt: new Date(),
            animationState: 'completing' as const
          };
          
          // Update stats
          const newStats = {
            ...state.user.stats,
            totalTasksCompleted: state.user.stats.totalTasksCompleted + 1,
            lastActiveDate: new Date()
          };
          
          // Evolve sigil based on task completion
          const sigilEvolution: SigilEvolution = {
            aspect: 'discipline',
            change: 1,
            reason: `Completed task: ${task.title}`,
            timestamp: new Date()
          };
          
          const updatedSigil = {
            ...state.user.sigil,
            aspects: {
              ...state.user.sigil.aspects,
              discipline: state.user.sigil.aspects.discipline + 1
            },
            evolutionHistory: [...state.user.sigil.evolutionHistory, sigilEvolution]
          };
          
          return {
            user: {
              ...state.user,
              tasks: state.user.tasks.map(t => t.id === taskId ? updatedTask : t),
              stats: newStats,
              sigil: updatedSigil
            }
          };
        });
        
        // Handle task disappearance after animation
        setTimeout(() => {
          set((state) => {
            const task = state.user.tasks.find(t => t.id === taskId);
            if (!task || !task.shouldDisappear) return state;
            
            return {
              user: {
                ...state.user,
                tasks: state.user.tasks.filter(t => t.id !== taskId)
              }
            };
          });
        }, 1500);
      },
      
      deleteTask: (taskId) => {
        set((state) => ({
          user: {
            ...state.user,
            tasks: state.user.tasks.filter(t => t.id !== taskId)
          }
        }));
      },
      
      updateTask: (taskId, updates) => {
        set((state) => ({
          user: {
            ...state.user,
            tasks: state.user.tasks.map(t => 
              t.id === taskId ? { ...t, ...updates } : t
            )
          }
        }));
      },
      
      addGoal: (goalData) => {
        const newGoal: Goal = {
          ...goalData,
          id: `goal-${Date.now()}`,
          createdAt: new Date(),
          progress: 0,
          dailyProgress: []
        };
        
        set((state) => ({
          user: {
            ...state.user,
            goals: [...state.user.goals, newGoal]
          }
        }));
      },
      
      updateGoalProgress: (goalId, progressChange, taskIds) => {
        set((state) => {
          const goal = state.user.goals.find(g => g.id === goalId);
          if (!goal) return state;
          
          const newProgress = Math.min(100, Math.max(0, goal.progress + progressChange));
          
          const goalProgress = {
            goalId,
            progressChange,
            tasksCompleted: taskIds,
            timeSpent: 0,
            date: new Date().toISOString().split('T')[0]
          };
          
          return {
            user: {
              ...state.user,
              goals: state.user.goals.map(g => 
                g.id === goalId 
                  ? { 
                      ...g, 
                      progress: newProgress,
                      dailyProgress: [...g.dailyProgress, goalProgress]
                    }
                  : g
              )
            }
          };
        });
      },
      
      deleteGoal: (goalId) => {
        set((state) => ({
          user: {
            ...state.user,
            goals: state.user.goals.filter(g => g.id !== goalId)
          }
        }));
      },
      
      updateGoal: (goalId, updates) => {
        set((state) => ({
          user: {
            ...state.user,
            goals: state.user.goals.map(g => 
              g.id === goalId ? { ...g, ...updates } : g
            )
          }
        }));
      },
      
      recordDailyProgress: (progressData) => {
        const today = new Date().toISOString().split('T')[0];
        
        set((state) => {
          const existingProgress = state.user.dailyProgress.find(p => p.date === today);
          
          if (existingProgress) {
            return {
              user: {
                ...state.user,
                dailyProgress: state.user.dailyProgress.map(p => 
                  p.date === today ? { ...p, ...progressData } : p
                )
              }
            };
          } else {
            const newProgress: DailyProgress = {
              date: today,
              tasksCompleted: [],
              goalsProgress: [],
              sigilChanges: [],
              energyLevel: 5,
              deepWorkMinutes: 0,
              ...progressData
            };
            
            return {
              user: {
                ...state.user,
                dailyProgress: [...state.user.dailyProgress, newProgress]
              }
            };
          }
        });
      },
      
      getTodayProgress: () => {
        const today = new Date().toISOString().split('T')[0];
        const state = get();
        return state.user.dailyProgress.find(p => p.date === today) || null;
      },
      
      evolveSigil: (evolution) => {
        set((state) => {
          const updatedSigil = {
            ...state.user.sigil,
            aspects: {
              ...state.user.sigil.aspects,
              [evolution.aspect]: Math.max(0, state.user.sigil.aspects[evolution.aspect] + evolution.change)
            },
            evolutionHistory: [...state.user.sigil.evolutionHistory, evolution]
          };
          
          return {
            user: {
              ...state.user,
              sigil: updatedSigil
            }
          };
        });
      },
      
      generateSigilDesign: () => {
        // Simple sigil generation based on aspects
        const { sigil } = get().user;
        const { discipline, knowledge, creativity, physical, spiritual } = sigil.aspects;
        
        // Create a simple geometric pattern based on aspect values
        const total = discipline + knowledge + creativity + physical + spiritual;
        const complexity = Math.min(total / 10, 1);
        
        // This is a placeholder - in a real implementation, you'd generate actual SVG patterns
        return `sigil-${Math.floor(complexity * 10)}`;
      },
      
      updateStats: () => {
        set((state) => {
          const today = new Date().toISOString().split('T')[0];
          const recentProgress = state.user.dailyProgress.filter(p => p.date >= today);
          
          const newStats = {
            ...state.user.stats,
            averageDailyCompletion: recentProgress.length > 0 
              ? recentProgress.reduce((sum, p) => sum + p.tasksCompleted.length, 0) / recentProgress.length
              : 0
          };
          
          return {
            user: {
              ...state.user,
              stats: newStats
            }
          };
        });
      },
      
      saveData: () => {
        const state = get();
        localStorage.setItem('inner-mastery-data', JSON.stringify(state.user));
      },
      
      loadData: () => {
        const saved = localStorage.getItem('inner-mastery-data');
        if (saved) {
          try {
            const userData = JSON.parse(saved);
            set({ user: userData });
          } catch (error) {
            console.error('Failed to load saved data:', error);
          }
        }
      },
      
      exportData: () => {
        const state = get();
        return JSON.stringify(state.user, null, 2);
      },
      
      importData: (data) => {
        try {
          const userData = JSON.parse(data);
          set({ user: userData });
        } catch (error) {
          console.error('Failed to import data:', error);
        }
      }
    }),
    {
      name: 'inner-mastery-storage',
      partialize: (state) => ({ user: state.user })
    }
  )
);
