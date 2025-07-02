import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, Filter, X } from 'lucide-react';
import { EmployeeFilters } from '@/types/employee';
import { employeeApi } from '@/lib/api';
import Button from './ui/Button';
import Input from './ui/Input';
import Select from './ui/Select';

interface EmployeeFiltersProps {
  filters: EmployeeFilters;
  onFiltersChange: (filters: EmployeeFilters) => void;
}

const EmployeeFiltersComponent: React.FC<EmployeeFiltersProps> = ({ filters, onFiltersChange }) => {
  const [departments, setDepartments] = useState<string[]>([]);
  const [titles, setTitles] = useState<string[]>([]);
  const [locations, setLocations] = useState<string[]>([]);
  const [showFilters, setShowFilters] = useState(false);

  useEffect(() => {
    const loadFilterOptions = async () => {
      try {
        const [deptData, titleData, locationData] = await Promise.all([
          employeeApi.getDepartments(),
          employeeApi.getTitles(),
          employeeApi.getLocations(),
        ]);
        setDepartments(deptData);
        setTitles(titleData);
        setLocations(locationData);
      } catch (error) {
        console.error('Error loading filter options:', error);
      }
    };

    loadFilterOptions();
  }, []);

  const handleFilterChange = (key: keyof EmployeeFilters, value: string | number) => {
    onFiltersChange({
      ...filters,
      [key]: value,
      page: 1,
    });
  };

  const clearFilters = () => {
    onFiltersChange({
      page: 1,
      limit: 10,
    });
  };

  const hasActiveFilters = filters.department || filters.title || filters.location || filters.search;

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 mb-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-4 flex-1">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input
              placeholder="Search employees..."
              value={filters.search || ''}
              onChange={(e) => handleFilterChange('search', e.target.value)}
              className="pl-10"
            />
          </div>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => setShowFilters(!showFilters)}
            className="flex items-center space-x-2"
          >
            <Filter className="w-4 h-4" />
            <span>Filters</span>
          </Button>
          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearFilters}
              className="flex items-center space-x-2 text-red-600 hover:text-red-700"
            >
              <X className="w-4 h-4" />
              <span>Clear</span>
            </Button>
          )}
        </div>
      </div>

      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-gray-200 mx-2">
              <Select
                label="Department"
                value={filters.department || ''}
                onChange={(e) => handleFilterChange('department', e.target.value)}
                options={departments.map(dept => ({ value: dept, label: dept }))}
              />
              <Select
                label="Job Title"
                value={filters.title || ''}
                onChange={(e) => handleFilterChange('title', e.target.value)}
                options={titles.map(title => ({ value: title, label: title }))}
              />
              <Select
                label="Location"
                value={filters.location || ''}
                onChange={(e) => handleFilterChange('location', e.target.value)}
                options={locations.map(location => ({ value: location, label: location }))}
              />
              </div>
          </motion.div>
        )}
      </AnimatePresence>

      {hasActiveFilters && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex flex-wrap gap-2 mt-4 pt-4 border-t border-gray-200"
        >
          {filters.department && (
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800">
              Department: {filters.department}
              <button
                onClick={() => handleFilterChange('department', '')}
                className="ml-2 text-blue-600 hover:text-blue-800"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          )}
          {filters.title && (
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-green-100 text-green-800">
              Title: {filters.title}
              <button
                onClick={() => handleFilterChange('title', '')}
                className="ml-2 text-green-600 hover:text-green-800"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          )}
          {filters.location && (
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-purple-100 text-purple-800">
              Location: {filters.location}
              <button
                onClick={() => handleFilterChange('location', '')}
                className="ml-2 text-purple-600 hover:text-purple-800"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          )}
          {filters.search && (
            <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-orange-100 text-orange-800">
              Search: {filters.search}
              <button
                onClick={() => handleFilterChange('search', '')}
                className="ml-2 text-orange-600 hover:text-orange-800"
              >
                <X className="w-3 h-3" />
              </button>
            </span>
          )}
        </motion.div>
      )}
    </div>
  );
};

export default EmployeeFiltersComponent; 