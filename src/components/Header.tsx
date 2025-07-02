import React from 'react';
import { motion } from 'framer-motion';
import { Users, Plus } from 'lucide-react';
import Button from './ui/Button';
import BackendStatus from './BackendStatus';

interface HeaderProps {
  onAddEmployee: () => void;
}

const Header: React.FC<HeaderProps> = ({ onAddEmployee }) => {
  return (
    <motion.header
      className="w-full sticky top-0 z-50 backdrop-blur-md bg-gradient-to-r from-blue-500/70 via-blue-400/60 to-blue-600/70 shadow-lg border-b border-blue-200/30"
      initial={{ y: -60, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      style={{ WebkitBackdropFilter: 'blur(12px)', backdropFilter: 'blur(12px)' }}
    >
      <div className="max-w-7xl mx-auto px-6 py-3 flex items-center justify-between">
        {/* Branding */}
        <div className="flex items-center gap-4">
          <div className="p-2 rounded-xl bg-white/30 shadow-md flex items-center justify-center">
            <Users className="w-7 h-7 text-blue-700" />
          </div>
          <div>
            <h1 className="text-2xl font-extrabold text-white drop-shadow-sm tracking-tight">Employee Directory</h1>
            <p className="text-sm text-blue-100/90 font-medium mt-0.5">Manage your organization&apos;s employees</p>
          </div>
        </div>
        {/* Actions */}
        <div className="flex items-center gap-3">
          <BackendStatus className="text-white" />
          <Button
            onClick={onAddEmployee}
            className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-5 py-2 rounded-lg shadow-md"
          >
            <Plus className="w-4 h-4" />
            <span>Add Employee</span>
          </Button>
        </div>
      </div>
    </motion.header>
  );
};

export default Header; 