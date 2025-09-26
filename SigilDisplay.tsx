import React from 'react';
import { motion } from 'framer-motion';
import { Sparkles, Zap } from 'lucide-react';
import { SigilState } from '../types';

interface SigilDisplayProps {
  sigil: SigilState;
}

export const SigilDisplay: React.FC<SigilDisplayProps> = ({ sigil }) => {
  const { aspects, level } = sigil;
  
  const getLevelColor = (level: string) => {
    switch (level) {
      case 'novice': return 'from-gray-100 to-gray-200';
      case 'apprentice': return 'from-blue-100 to-blue-200';
      case 'adept': return 'from-purple-100 to-purple-200';
      case 'master': return 'from-gold-100 to-gold-200';
      default: return 'from-gray-100 to-gray-200';
    }
  };

  const getLevelTitle = (level: string) => {
    switch (level) {
      case 'novice': return 'Novice';
      case 'apprentice': return 'Apprentice';
      case 'adept': return 'Adept';
      case 'master': return 'Master';
      default: return 'Novice';
    }
  };

  const totalAspects = Object.values(aspects).reduce((sum, value) => sum + value, 0);
  const maxAspect = Math.max(...Object.values(aspects));

  return (
    <div className="card">
      <div className="text-center space-y-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Your Sigil</h2>
          <p className="text-gray-600">Symbol of your inner mastery</p>
        </div>

        <motion.div
          className={`sigil-container mx-auto ${getLevelColor(level)}`}
          whileHover={{ scale: 1.05 }}
          transition={{ type: "spring", stiffness: 300, damping: 30 }}
        >
          <div className="text-center">
            <motion.div
              className="text-4xl mb-2"
              animate={{ rotate: 360 }}
              transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
            >
              {level === 'novice' && '○'}
              {level === 'apprentice' && '◐'}
              {level === 'adept' && '◑'}
              {level === 'master' && '●'}
            </motion.div>
            <div className="text-sm font-medium text-gray-700">
              {getLevelTitle(level)}
            </div>
          </div>
        </motion.div>

        <div className="space-y-4">
          <div className="text-center">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Aspects of Mastery</h3>
            <div className="grid grid-cols-2 gap-3">
              {Object.entries(aspects).map(([aspect, value]) => (
                <motion.div
                  key={aspect}
                  className="bg-gray-50 rounded-lg p-3"
                  whileHover={{ scale: 1.02 }}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-medium text-gray-700 capitalize">
                      {aspect}
                    </span>
                    <span className="text-sm text-gray-600">{value}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <motion.div
                      className="bg-blue-500 h-2 rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${(value / Math.max(maxAspect, 1)) * 100}%` }}
                      transition={{ duration: 0.8, ease: "easeOut" }}
                    />
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-lg p-4">
            <div className="flex items-center justify-center space-x-2 mb-2">
              <Sparkles className="text-purple-600" size={20} />
              <span className="font-semibold text-purple-800">Total Mastery</span>
            </div>
            <div className="text-2xl font-bold text-purple-900">{totalAspects}</div>
            <div className="text-sm text-purple-700">
              {totalAspects < 10 && "Begin your journey"}
              {totalAspects >= 10 && totalAspects < 25 && "Building momentum"}
              {totalAspects >= 25 && totalAspects < 50 && "Growing stronger"}
              {totalAspects >= 50 && "Transcendent mastery"}
            </div>
          </div>
        </div>

        <motion.div
          className="flex items-center justify-center space-x-2 text-sm text-gray-600"
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <Zap size={14} />
          <span>Your sigil evolves with each completed task</span>
        </motion.div>
      </div>
    </div>
  );
};
