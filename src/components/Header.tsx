'use client';

import React from 'react';
import { motion } from 'framer-motion';
import { Users, Plus } from 'lucide-react';
import Button from './ui/Button';
import BackendStatus from './BackendStatus';

interface HeaderProps {
  onAddEmployee?: () => void;
}

const Header: React.FC<HeaderProps> = ({ onAddEmployee }) => {
  return (
    <motion.header
      className="w-full sticky top-0 z-50 bg-gradient-to-br from-blue-700/70 via-blue-500/60 to-blue-800/80 backdrop-blur-xl shadow-lg border-b border-blue-200/40"
      initial={{ y: -60, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      style={{ WebkitBackdropFilter: 'blur(16px)', backdropFilter: 'blur(16px)' }}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between">
        {/* Branding - Responsive layout */}
        <div className="flex items-center gap-2 sm:gap-4 min-w-0">
          <div className="p-1.5 sm:p-2 rounded-xl bg-white/30 shadow-md flex items-center justify-center flex-shrink-0">
            <Users className="w-5 h-5 sm:w-7 sm:h-7 text-blue-700" />
          </div>
          <div className="min-w-0 flex-1">
            <h1 className="text-lg sm:text-2xl font-extrabold text-white drop-shadow-sm tracking-tight truncate">
              Employee Directory
            </h1>
            <p className="text-xs sm:text-sm text-blue-100/90 font-medium mt-0.5 hidden sm:block">
              Manage your organization&apos;s employees
            </p>
          </div>
        </div>
        
        {/* Actions - Responsive layout */}
        <div className="flex items-center gap-2 sm:gap-3 flex-shrink-0">
          <BackendStatus className="text-white hidden sm:block" />
          {onAddEmployee && (
            <Button
              onClick={onAddEmployee}
              className="flex items-center space-x-1 sm:space-x-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-3 sm:px-5 py-2 rounded-lg shadow-md text-sm sm:text-base"
            >
              <Plus className="w-3 h-3 sm:w-4 sm:h-4" />
              <span className="hidden sm:inline">Add Employee</span>
              <span className="sm:hidden">Add</span>
            </Button>
          )}
        </div>
      </div>
    </motion.header>
  );
};

export default Header; 