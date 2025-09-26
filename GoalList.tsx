import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Target, Plus, X, TrendingUp } from 'lucide-react';
import { Goal } from '../types';
import { useAppStore } from '../store';

interface GoalItemProps {
  goal: Goal;
}

export const GoalItem: React.FC<GoalItemProps> = ({ goal }) => {
  const { updateGoalProgress, deleteGoal } = useAppStore();
  const [progressInput, setProgressInput] = useState('');

  const handleProgressUpdate = () => {
    const change = parseFloat(progressInput);
    if (!isNaN(change) && change !== 0) {
      updateGoalProgress(goal.id, change, []);
      setProgressInput('');
    }
  };

  const getProgressColor = (progress: number) => {
    if (progress < 25) return 'bg-red-500';
    if (progress < 50) return 'bg-orange-500';
    if (progress < 75) return 'bg-yellow-500';
    return 'bg-green-500';
  };

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="card"
    >
      <div className="space-y-4">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h3 className="text-lg font-semibold text-gray-900">{goal.title}</h3>
            <p className="text-gray-600 mt-1">{goal.description}</p>
            
            {goal.targetDate && (
              <p className="text-sm text-gray-500 mt-2">
                Target: {new Date(goal.targetDate).toLocaleDateString()}
              </p>
            )}
          </div>
          
          <button
            onClick={() => deleteGoal(goal.id)}
            className="p-1 text-gray-400 hover:text-red-500 transition-colors"
          >
            <X size={16} />
          </button>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-gray-700">Progress</span>
            <span className="text-sm text-gray-600">{goal.progress}%</span>
          </div>
          
          <div className="w-full bg-gray-200 rounded-full h-2">
            <motion.div
              className={`h-2 rounded-full ${getProgressColor(goal.progress)}`}
              initial={{ width: 0 }}
              animate={{ width: `${goal.progress}%` }}
              transition={{ duration: 0.5, ease: "easeOut" }}
            />
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <input
            type="number"
            value={progressInput}
            onChange={(e) => setProgressInput(e.target.value)}
            className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Progress change (+/-)"
            min="-100"
            max="100"
            step="1"
          />
          <button
            onClick={handleProgressUpdate}
            className="btn-primary flex items-center space-x-1"
          >
            <TrendingUp size={14} />
            <span>Update</span>
          </button>
        </div>

        {goal.linkedTasks.length > 0 && (
          <div className="pt-2 border-t border-gray-200">
            <p className="text-sm text-gray-600">
              Linked to {goal.linkedTasks.length} task(s)
            </p>
          </div>
        )}
      </div>
    </motion.div>
  );
};

interface GoalListProps {
  goals: Goal[];
}

export const GoalList: React.FC<GoalListProps> = ({ goals }) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [newGoalTitle, setNewGoalTitle] = useState('');
  const [newGoalDescription, setNewGoalDescription] = useState('');
  const [newGoalCategory, setNewGoalCategory] = useState('');
  const [newGoalTargetDate, setNewGoalTargetDate] = useState('');
  const { addGoal } = useAppStore();

  const handleAddGoal = () => {
    if (newGoalTitle.trim()) {
      addGoal({
        title: newGoalTitle.trim(),
        description: newGoalDescription.trim(),
        category: newGoalCategory.trim(),
        linkedTasks: [],
        targetDate: newGoalTargetDate ? new Date(newGoalTargetDate) : undefined
      });
      
      setNewGoalTitle('');
      setNewGoalDescription('');
      setNewGoalCategory('');
      setNewGoalTargetDate('');
      setShowAddForm(false);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-900">Goals & Projects</h2>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="btn-primary flex items-center space-x-2"
        >
          <Plus size={16} />
          <span>Add Goal</span>
        </button>
      </div>

      {showAddForm && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          className="card"
        >
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Goal Title
              </label>
              <input
                type="text"
                value={newGoalTitle}
                onChange={(e) => setNewGoalTitle(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="e.g., Learn React Mastery"
                autoFocus
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Description
              </label>
              <textarea
                value={newGoalDescription}
                onChange={(e) => setNewGoalDescription(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Describe what you want to achieve..."
                rows={3}
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Category
                </label>
                <input
                  type="text"
                  value={newGoalCategory}
                  onChange={(e) => setNewGoalCategory(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="e.g., Learning"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Target Date
                </label>
                <input
                  type="date"
                  value={newGoalTargetDate}
                  onChange={(e) => setNewGoalTargetDate(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>
            
            <div className="flex space-x-3">
              <button onClick={handleAddGoal} className="btn-primary">
                Add Goal
              </button>
              <button 
                onClick={() => setShowAddForm(false)}
                className="btn-secondary"
              >
                Cancel
              </button>
            </div>
          </div>
        </motion.div>
      )}

      <div className="space-y-4">
        <AnimatePresence>
          {goals.map((goal) => (
            <GoalItem key={goal.id} goal={goal} />
          ))}
        </AnimatePresence>
        
        {goals.length === 0 && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-8 text-gray-500"
          >
            <Target size={48} className="mx-auto mb-4 text-gray-300" />
            <p>No goals yet. Create your first goal to start tracking progress!</p>
          </motion.div>
        )}
      </div>
    </div>
  );
};
