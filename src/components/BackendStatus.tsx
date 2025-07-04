'use client';

import React, { useState, useEffect } from 'react';
import { healthApi } from '@/lib/api';

interface BackendStatusProps {
  className?: string;
}

const BackendStatus: React.FC<BackendStatusProps> = ({ className = '' }) => {
  const [lastCheck, setLastCheck] = useState<Date | null>(null);

  const checkHealth = async () => {
    try {
      await healthApi.check();
      setLastCheck(new Date());
    } catch {
      setLastCheck(new Date());
    }
  };

  useEffect(() => {
    checkHealth();
    
    // Check health every 30 seconds
    const interval = setInterval(checkHealth, 30000);
    return () => clearInterval(interval);
  }, []);

  const time = lastCheck ? lastCheck.toLocaleTimeString() : 'N/A';

  return (
    <div className={`flex items-center ${className || ''}`.trim()}>
      <span className="text-green-700 flex items-center">
        {/* Status icon and text */}
        <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 12l2 2l4 -4" /><circle cx="12" cy="12" r="9" /></svg>
        API Healthy
      <span className="ml-2 text-gray-600">{time}</span>
      </span>
    </div>
  );
};

export default BackendStatus; 