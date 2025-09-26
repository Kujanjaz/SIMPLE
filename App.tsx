import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { CheckSquare, Target, BarChart3, Settings, Plus } from 'lucide-react';
import { TaskList } from './TaskList';
import { GoalList } from './GoalList';
import { SigilDisplay } from './SigilDisplay';
import { ProgressDashboard } from './ProgressDashboard';
import { useAppStore } from '../store';

type TabType = 'tasks' | 'goals' | 'sigil' | 'progress';

export const App: React.FC = () => {
  const { user, loadData } = useAppStore();
  const [activeTab, setActiveTab] = useState<TabType>('tasks');

  React.useEffect(() => {
    loadData();
  }, [loadData]);

  const tabs = [
    { id: 'tasks' as TabType, label: 'Tasks', icon: CheckSquare },
    { id: 'goals' as TabType, label: 'Goals', icon: Target },
    { id: 'sigil' as TabType, label: 'Sigil', icon: Plus },
    { id: 'progress' as TabType, label: 'Progress', icon: BarChart3 },
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'tasks':
        return <TaskList tasks={user.tasks} />;
      case 'goals':
        return <GoalList goals={user.goals} />;
      case 'sigil':
        return <SigilDisplay sigil={user.sigil} />;
      case 'progress':
        return <ProgressDashboard />;
      default:
        return <TaskList tasks={user.tasks} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-blue-500 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">IM</span>
              </div>
              <h1 className="text-xl font-bold text-gray-900">Inner Mastery</h1>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="text-sm text-gray-600">
                {user.stats.totalTasksCompleted} tasks completed
              </div>
              <button className="p-2 text-gray-400 hover:text-gray-600 transition-colors">
                <Settings size={20} />
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <nav className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center space-x-2 py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === tab.id
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  <Icon size={16} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {renderContent()}
        </motion.div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="text-center text-sm text-gray-500">
            <p>Inner Mastery - Building a high-agency life system</p>
            <p className="mt-1">Focus on inner transformation through symbolic progression</p>
          </div>
        </div>
      </footer>
    </div>
  );
};
