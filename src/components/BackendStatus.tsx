import React, { useState, useEffect } from 'react';
import { CheckCircle, XCircle, Loader2 } from 'lucide-react';
import { healthApi } from '@/lib/api';

interface BackendStatusProps {
  className?: string;
}

const BackendStatus: React.FC<BackendStatusProps> = ({ className = '' }) => {
  const [status, setStatus] = useState<'loading' | 'healthy' | 'unhealthy'>('loading');
  const [lastCheck, setLastCheck] = useState<Date | null>(null);

  const checkHealth = async () => {
    try {
      setStatus('loading');
      await healthApi.check();
      setStatus('healthy');
      setLastCheck(new Date());
    } catch {
      setStatus('unhealthy');
      setLastCheck(new Date());
    }
  };

  useEffect(() => {
    checkHealth();
    
    // Check health every 30 seconds
    const interval = setInterval(checkHealth, 30000);
    return () => clearInterval(interval);
  }, []);

  const getStatusIcon = () => {
    switch (status) {
      case 'loading':
        return <Loader2 className="w-4 h-4 animate-spin text-blue-500" />;
      case 'healthy':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'unhealthy':
        return <XCircle className="w-4 h-4 text-red-500" />;
    }
  };

  const getStatusText = () => {
    switch (status) {
      case 'loading':
        return 'Checking...';
      case 'healthy':
        return 'API Healthy';
      case 'unhealthy':
        return 'API Unavailable';
    }
  };

  const getStatusColor = () => {
    switch (status) {
      case 'loading':
        return 'text-blue-600';
      case 'healthy':
        return 'text-green-600';
      case 'unhealthy':
        return 'text-red-600';
    }
  };

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