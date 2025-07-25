'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, Plus, Loader2 } from 'lucide-react';
import { Employee, EmployeeFilters, PaginatedEmployees } from '@/types/employee';
import { employeeApi } from '@/lib/api';
import EmployeeCard from '@/components/EmployeeCard';
import EmployeeForm from '@/components/EmployeeForm';
import EmployeeFiltersComponent from '@/components/EmployeeFilters';
import Pagination from '@/components/Pagination';
import Button from '@/components/ui/Button';
import ConfirmModal from '@/components/ConfirmModal';
import toast from 'react-hot-toast';

interface EmployeeListProps {
  initialData: PaginatedEmployees;
}

export default function EmployeeList({ initialData }: EmployeeListProps) {
  const [employees, setEmployees] = useState<PaginatedEmployees>(initialData);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<Employee | undefined>();
  const [filters, setFilters] = useState<EmployeeFilters>({
    page: 1,
    limit: 10,
  });
  const [deleteId, setDeleteId] = useState<string | null>(null);

  const loadEmployees = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await employeeApi.getAll(filters);
      setEmployees(data);
    } catch (err) {
      setError('Failed to load employees. Please try again.');
    } finally {
      setLoading(false);
    }
  }, [filters]);

  // Load employees when filters change
  useEffect(() => {
    loadEmployees();
  }, [loadEmployees, filters]);

  const handleFiltersChange = (newFilters: EmployeeFilters) => {
    setFilters(newFilters);
  };

  const handlePageChange = (page: number) => {
    setFilters(prev => ({ ...prev, page }));
  };

  const handleAddEmployee = () => {
    setEditingEmployee(undefined);
    setShowForm(true);
  };

  const handleEditEmployee = (employee: Employee) => {
    setEditingEmployee(employee);
    setShowForm(true);
  };

  const handleDeleteEmployee = (id: string) => {
    setDeleteId(id);
  };

  const confirmDeleteEmployee = async () => {
    if (!deleteId) return;
    try {
      await employeeApi.delete(deleteId);
      setDeleteId(null);
      loadEmployees();
      toast.success('Employee deleted successfully!');
    } catch (err) {
      setError('Failed to delete employee. Please try again.');
      setDeleteId(null);
      if (process.env.NODE_ENV === 'development') {
        console.error('Error deleting employee:', err);
      }
    }
  };

  const handleFormSuccess = () => {
    loadEmployees();
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingEmployee(undefined);
  };

  return (
    <>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Employees</h2>
        <Button
          onClick={handleAddEmployee}
          className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded-lg shadow-md"
        >
          <Plus className="w-4 h-4" />
          <span>Add Employee</span>
        </Button>
      </div>
      <EmployeeFiltersComponent
        filters={filters}
        onFiltersChange={handleFiltersChange}
      />
      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg"
        >
          <p className="text-red-800">{error}</p>
        </motion.div>
      )}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="flex items-center space-x-2">
            <Loader2 className="w-6 h-6 animate-spin text-blue-600" />
            <span className="text-gray-600">Loading employees...</span>
          </div>
        </div>
      ) : employees ? (
        <>
          <div className="mb-6">
            <p className="text-sm text-gray-600">
              Showing {employees.employees.length} of {employees.total} employees
            </p>
          </div>
          {employees.employees.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-12"
            >
              <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No employees found</h3>
              <p className="text-gray-600 mb-4">
                {filters.search || filters.department || filters.title || filters.location
                  ? 'Try adjusting your filters or search terms.'
                  : 'Get started by adding your first employee.'}
              </p>
              {!filters.search && !filters.department && !filters.title && !filters.location && (
                <Button onClick={handleAddEmployee}>
                  <Plus className="w-4 h-4 mr-2" />
                  Add Employee
                </Button>
              )}
            </motion.div>
          ) : (
            <motion.div
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              layout
            >
              <AnimatePresence>
                {employees.employees.map((employee) => (
                  <EmployeeCard
                    key={employee.id}
                    employee={employee}
                    onEdit={handleEditEmployee}
                    onDelete={handleDeleteEmployee}
                  />
                ))}
              </AnimatePresence>
            </motion.div>
          )}
          {employees.totalPages > 1 && (
            <Pagination
              currentPage={employees.page}
              totalPages={employees.totalPages}
              onPageChange={handlePageChange}
            />
          )}
        </>
      ) : null}
      <AnimatePresence>
        {showForm && (
          <EmployeeForm
            employee={editingEmployee}
            onClose={handleCloseForm}
            onSuccess={handleFormSuccess}
          />
        )}
      </AnimatePresence>
      <ConfirmModal
        open={!!deleteId}
        title="Delete Employee"
        description="Are you sure you want to delete this employee? This action cannot be undone."
        confirmText="Delete"
        cancelText="Cancel"
        onConfirm={confirmDeleteEmployee}
        onCancel={() => setDeleteId(null)}
      />
    </>
  );
} 