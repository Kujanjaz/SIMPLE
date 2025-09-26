import React from 'react';
import { motion } from 'framer-motion';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line } from 'recharts';
import { TrendingUp, Calendar, Target } from 'lucide-react';
import { useAppStore } from '../store';

export const ProgressDashboard: React.FC = () => {
  const { user } = useAppStore();
  const { stats, dailyProgress } = user;

  // Prepare chart data
  const last7Days = dailyProgress.slice(-7).map(progress => ({
    date: new Date(progress.date).toLocaleDateString('en-US', { weekday: 'short' }),
    tasks: progress.tasksCompleted.length,
    energy: progress.energyLevel,
    deepWork: progress.deepWorkMinutes
  }));

  const aspectData = Object.entries(user.sigil.aspects).map(([aspect, value]) => ({
    aspect: aspect.charAt(0).toUpperCase() + aspect.slice(1),
    value
  }));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-900">Progress Dashboard</h2>
        <div className="flex items-center space-x-2 text-sm text-gray-600">
          <Calendar size={16} />
          <span>Last 7 days</span>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <motion.div
          className="card"
          whileHover={{ scale: 1.02 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        >
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-green-100 rounded-lg">
              <Target className="text-green-600" size={20} />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900">{stats.totalTasksCompleted}</div>
              <div className="text-sm text-gray-600">Tasks Completed</div>
            </div>
          </div>
        </motion.div>

        <motion.div
          className="card"
          whileHover={{ scale: 1.02 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        >
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <TrendingUp className="text-blue-600" size={20} />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900">{stats.currentStreak}</div>
              <div className="text-sm text-gray-600">Day Streak</div>
            </div>
          </div>
        </motion.div>

        <motion.div
          className="card"
          whileHover={{ scale: 1.02 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        >
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-purple-100 rounded-lg">
              <TrendingUp className="text-purple-600" size={20} />
            </div>
            <div>
              <div className="text-2xl font-bold text-gray-900">{stats.deepWorkHours.toFixed(1)}h</div>
              <div className="text-sm text-gray-600">Deep Work</div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Daily Tasks Chart */}
        <motion.div
          className="card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Daily Task Completion</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={last7Days}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="tasks" fill="#3B82F6" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Energy Level Chart */}
        <motion.div
          className="card"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Energy Levels</h3>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={last7Days}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis domain={[0, 10]} />
              <Tooltip />
              <Line 
                type="monotone" 
                dataKey="energy" 
                stroke="#10B981" 
                strokeWidth={2}
                dot={{ fill: '#10B981', strokeWidth: 2, r: 4 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </motion.div>
      </div>

      {/* Sigil Aspects Chart */}
      <motion.div
        className="card"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Mastery Aspects</h3>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={aspectData} layout="horizontal">
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis type="number" domain={[0, 'dataMax']} />
            <YAxis dataKey="aspect" type="category" width={80} />
            <Tooltip />
            <Bar dataKey="value" fill="#8B5CF6" radius={[0, 4, 4, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </motion.div>

      {/* Recent Progress */}
      <motion.div
        className="card"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Progress</h3>
        <div className="space-y-3">
          {dailyProgress.slice(-5).reverse().map((progress, index) => (
            <div key={progress.date} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div>
                <div className="font-medium text-gray-900">
                  {new Date(progress.date).toLocaleDateString()}
                </div>
                <div className="text-sm text-gray-600">
                  {progress.tasksCompleted.length} tasks completed
                </div>
              </div>
              <div className="text-right">
                <div className="text-sm font-medium text-gray-900">
                  Energy: {progress.energyLevel}/10
                </div>
                <div className="text-sm text-gray-600">
                  {progress.deepWorkMinutes}min deep work
                </div>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};
