import React, { Suspense } from 'react';
import { Employee } from '@/types/employee';

// Lazy load the EmployeeCard component
const EmployeeCard = React.lazy(() => import('./EmployeeCard'));

interface LazyEmployeeCardProps {
  employee: Employee;
  onEdit: (employee: Employee) => void;
  onDelete: (id: string) => void;
}

const LazyEmployeeCard: React.FC<LazyEmployeeCardProps> = ({ employee, onEdit, onDelete }) => {
  return (
    <Suspense
      fallback={
        <div className="bg-white rounded-lg shadow-md p-6 animate-pulse">
          <div className="flex items-center space-x-4 mb-4">
            <div className="w-16 h-16 bg-gray-200 rounded-full"></div>
            <div className="flex-1">
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-1/2"></div>
            </div>
          </div>
          <div className="space-y-3">
            <div className="h-3 bg-gray-200 rounded"></div>
            <div className="h-3 bg-gray-200 rounded"></div>
            <div className="h-3 bg-gray-200 rounded"></div>
          </div>
        </div>
      }
    >
      <EmployeeCard
        employee={employee}
        onEdit={onEdit}
        onDelete={onDelete}
      />
    </Suspense>
  );
};

export default LazyEmployeeCard; 