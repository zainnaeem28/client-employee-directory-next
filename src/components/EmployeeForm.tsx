import React, { useEffect, useState } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion, AnimatePresence } from 'framer-motion';
import { Employee, CreateEmployeeDto, UpdateEmployeeDto } from '@/types/employee';
import { employeeApi } from '@/lib/api';
import Button from './ui/Button';
import Input from './ui/Input';
import Select from './ui/Select';
import { X } from 'lucide-react';
import toast from 'react-hot-toast';

const employeeSchema = z.object({
  firstName: z.string().min(1, 'First name is required').max(50, 'First name must be less than 50 characters'),
  lastName: z.string().min(1, 'Last name is required').max(50, 'Last name must be less than 50 characters'),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(1, 'Phone number is required'),
  department: z.string().min(1, 'Department is required'),
  title: z.string().min(1, 'Job title is required'),
  location: z.string().min(1, 'Location is required'),
  salary: z.coerce.number().min(20000, 'Salary must be at least $20,000').max(1000000, 'Salary cannot exceed $1,000,000'),
  manager: z.string().optional(),
});

type EmployeeFormData = z.infer<typeof employeeSchema>;

interface EmployeeFormProps {
  employee?: Employee;
  onClose: () => void;
  onSuccess: () => void;
}

// Helper to normalize dropdown values for matching
function normalize(str: string | undefined | null) {
  return (str || '').trim().toLowerCase();
}

const EmployeeForm: React.FC<EmployeeFormProps> = ({ employee, onClose, onSuccess }) => {
  // State for dropdown options - load from API
  const [departments, setDepartments] = useState<string[]>([]);
  const [titles, setTitles] = useState<string[]>([]);
  const [locations, setLocations] = useState<string[]>([]);

  // Track when dropdown options are loaded
  const [dropdownsLoaded, setDropdownsLoaded] = useState(false);

  // Form configuration with validation
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
    control,
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

  // Load dropdown options from API on component mount
  // This ensures department, title, and location dropdowns are always up-to-date
  useEffect(() => {
    const loadDropdownOptions = async () => {
      try {
        const [deptData, titleData, locationData] = await Promise.all([
          employeeApi.getDepartments(),
          employeeApi.getTitles(),
          employeeApi.getLocations(),
        ]);
        // Normalize all dropdown options
        setDepartments(Array.from(new Set(deptData.map(d => d.trim()))));
        setTitles(Array.from(new Set(titleData.map(t => t.trim()))));
        setLocations(Array.from(new Set(locationData.map(l => l.trim()))));
        setDropdownsLoaded(true);
      } catch (error) {
        console.error('Error loading dropdown options:', error);
      }
    };
    loadDropdownOptions();
  }, []);

  // Populate form with employee data when editing, but only after dropdowns are loaded
  // This ensures dropdowns are populated before setting default values
  useEffect(() => {
    if (employee && dropdownsLoaded) {
      // Find the matching dropdown value for each field
      const department = departments.find(d => normalize(d) === normalize(employee.department)) || '';
      const title = titles.find(t => normalize(t) === normalize(employee.title)) || '';
      const location = locations.find(l => normalize(l) === normalize(employee.location)) || '';
      reset({
        firstName: employee.firstName,
        lastName: employee.lastName,
        email: employee.email,
        phone: employee.phone,
        department,
        title,
        location,
        salary: employee.salary,
        manager: employee.manager || '',
      });
    }
  }, [employee, dropdownsLoaded, departments, titles, locations, reset]);

  /**
   * Handle form submission for both create and update operations
   * - Cleans and prepares data
   * - For updates, only sends changed fields
   * - Handles API errors and logs for debugging
   */
  const onSubmit = async (data: EmployeeFormData) => {
    try {
      // Clean up the data before sending to API
      const cleanData = {
        ...data,
        manager: data.manager?.trim() || null, // Convert empty string to null for backend
        salary: Math.min(data.salary, 1000000), // Cap salary to prevent backend validation issues
      };

      if (employee) {
        // UPDATE OPERATION: Only send fields that have changed to optimize API calls
        const updateData: UpdateEmployeeDto = {};
        
        // Compare each field and only include changed values
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
        toast.success('Employee updated successfully!');
      } else {
        // CREATE OPERATION: Send all required fields
        await employeeApi.create(cleanData as CreateEmployeeDto);
        toast.success('Employee added successfully!');
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
        className="fixed inset-0 bg-blue-900/60 backdrop-blur-md flex items-center justify-center p-4 z-50"
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
                  placeholder="Enter first name"
                  error={errors.firstName?.message}
                  {...register('firstName')}
                />
                <Input
                  label="Last Name"
                  placeholder="Enter last name"
                  error={errors.lastName?.message}
                  {...register('lastName')}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Input
                  label="Email"
                  type="email"
                  placeholder="Enter email address"
                  error={errors.email?.message}
                  {...register('email')}
                />
                <Input
                  label="Phone"
                  placeholder="Enter phone number"
                  error={errors.phone?.message}
                  {...register('phone')}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Controller
                  name="department"
                  control={control}
                  render={({ field }) => (
                    <Select
                      label="Department"
                      error={errors.department?.message}
                      options={departments.map(dept => ({ value: dept, label: dept }))}
                      {...field}
                    />
                  )}
                />
                <Controller
                  name="title"
                  control={control}
                  render={({ field }) => (
                    <Select
                      label="Job Title"
                      error={errors.title?.message}
                      options={titles.map(title => ({ value: title, label: title }))}
                      {...field}
                    />
                  )}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Controller
                  name="location"
                  control={control}
                  render={({ field }) => (
                    <Select
                      label="Location"
                      error={errors.location?.message}
                      options={locations.map(location => ({ value: location, label: location }))}
                      {...field}
                    />
                  )}
                />
                <Input
                  label="Salary"
                  type="number"
                  min="20000"
                  placeholder="Enter salary amount (minimum $20,000)"
                  error={errors.salary?.message}
                  {...register('salary', {
                    valueAsNumber: true,
                    min: { value: 20000, message: 'Salary must be at least $20,000' },
                    max: { value: 1000000, message: 'Salary cannot exceed $1,000,000' }
                  })}
                />
              </div>

              <Input
                label="Manager (Optional)"
                placeholder="Enter manager's name (optional)"
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