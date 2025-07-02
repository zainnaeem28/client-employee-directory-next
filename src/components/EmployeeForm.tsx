import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion, AnimatePresence } from 'framer-motion';
import { Employee, CreateEmployeeDto, UpdateEmployeeDto } from '@/types/employee';
import { employeeApi } from '@/lib/api';
import Button from './ui/Button';
import Input from './ui/Input';
import { X } from 'lucide-react';

const employeeSchema = z.object({
  firstName: z.string().min(1, 'First name is required').max(50, 'First name must be less than 50 characters'),
  lastName: z.string().min(1, 'Last name is required').max(50, 'Last name must be less than 50 characters'),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(1, 'Phone number is required'),
  department: z.string().min(1, 'Department is required'),
  title: z.string().min(1, 'Job title is required'),
  location: z.string().min(1, 'Location is required'),
  salary: z.number().min(0, 'Salary must be positive'),
  manager: z.string().optional(),
});

type EmployeeFormData = z.infer<typeof employeeSchema>;

interface EmployeeFormProps {
  employee?: Employee;
  onClose: () => void;
  onSuccess: () => void;
}

const EmployeeForm: React.FC<EmployeeFormProps> = ({ employee, onClose, onSuccess }) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<EmployeeFormData>({
    resolver: zodResolver(employeeSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      department: '',
      title: '',
      location: '',
      salary: 0,
      manager: '',
    },
  });

  useEffect(() => {
    if (employee) {
      reset({
        firstName: employee.firstName,
        lastName: employee.lastName,
        email: employee.email,
        phone: employee.phone,
        department: employee.department,
        title: employee.title,
        location: employee.location,
        salary: employee.salary,
        manager: employee.manager || '',
      });
    }
  }, [employee, reset]);

  const onSubmit = async (data: EmployeeFormData) => {
    try {
      // Clean up the data before sending
      const cleanData = {
        ...data,
        manager: data.manager?.trim() || null, // Use null instead of undefined
        salary: Math.min(data.salary, 1000000), // Ensure salary doesn't exceed backend limit
      };

      if (employee) {
        // For updates, only send fields that have changed or are required
        const updateData: UpdateEmployeeDto = {};
        
        // Only include fields that are different from the original employee
        if (cleanData.firstName !== employee.firstName) updateData.firstName = cleanData.firstName;
        if (cleanData.lastName !== employee.lastName) updateData.lastName = cleanData.lastName;
        if (cleanData.email !== employee.email) updateData.email = cleanData.email;
        if (cleanData.phone !== employee.phone) updateData.phone = cleanData.phone;
        if (cleanData.department !== employee.department) updateData.department = cleanData.department;
        if (cleanData.title !== employee.title) updateData.title = cleanData.title;
        if (cleanData.location !== employee.location) updateData.location = cleanData.location;
        if (cleanData.salary !== employee.salary) updateData.salary = cleanData.salary;
        if (cleanData.manager !== employee.manager) updateData.manager = cleanData.manager || undefined;
        
        await employeeApi.update(employee.id, updateData);
      } else {
        await employeeApi.create(cleanData as CreateEmployeeDto);
      }
      onSuccess();
      onClose();
    } catch (error) {
      console.error('Error saving employee:', error);
      // Log the data being sent for debugging
      if (employee) {
        // Reconstruct updateData for logging purposes
        const updateData: UpdateEmployeeDto = {};
        const cleanData = {
          ...data,
          manager: data.manager?.trim() || null,
          salary: Math.min(data.salary, 1000000),
        };
        
        if (cleanData.firstName !== employee.firstName) updateData.firstName = cleanData.firstName;
        if (cleanData.lastName !== employee.lastName) updateData.lastName = cleanData.lastName;
        if (cleanData.email !== employee.email) updateData.email = cleanData.email;
        if (cleanData.phone !== employee.phone) updateData.phone = cleanData.phone;
        if (cleanData.department !== employee.department) updateData.department = cleanData.department;
        if (cleanData.title !== employee.title) updateData.title = cleanData.title;
        if (cleanData.location !== employee.location) updateData.location = cleanData.location;
        if (cleanData.salary !== employee.salary) updateData.salary = cleanData.salary;
        if (cleanData.manager !== employee.manager) updateData.manager = cleanData.manager || undefined;
        
        console.log('Update data being sent:', {
          id: employee.id,
          originalData: employee,
          newData: data,
          updateData: updateData
        });
      } else {
        console.log('Create data being sent:', data);
      }
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <motion.div
          className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
        >
          <div className="p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">
                {employee ? 'Edit Employee' : 'Add New Employee'}
              </h2>
              <Button
                variant="ghost"
                size="sm"
                onClick={onClose}
                className="p-2"
              >
                <X className="w-5 h-5" />
              </Button>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input
                  label="First Name"
                  error={errors.firstName?.message}
                  {...register('firstName')}
                />
                <Input
                  label="Last Name"
                  error={errors.lastName?.message}
                  {...register('lastName')}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input
                  label="Email"
                  type="email"
                  error={errors.email?.message}
                  {...register('email')}
                />
                <Input
                  label="Phone"
                  error={errors.phone?.message}
                  {...register('phone')}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input
                  label="Department"
                  error={errors.department?.message}
                  {...register('department')}
                />
                <Input
                  label="Job Title"
                  error={errors.title?.message}
                  {...register('title')}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input
                  label="Location"
                  error={errors.location?.message}
                  {...register('location')}
                />
                <Input
                  label="Salary"
                  type="number"
                  error={errors.salary?.message}
                  {...register('salary', { valueAsNumber: true })}
                />
              </div>

              <Input
                label="Manager (Optional)"
                error={errors.manager?.message}
                {...register('manager')}
              />

              <div className="flex justify-end space-x-4 pt-6">
                <Button
                  type="button"
                  variant="secondary"
                  onClick={onClose}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  loading={isSubmitting}
                >
                  {employee ? 'Update Employee' : 'Create Employee'}
                </Button>
              </div>
            </form>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default EmployeeForm; 