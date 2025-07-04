import React, { useEffect, useState, useRef } from 'react';
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
import { AxiosError } from 'axios';
import axios from 'axios';
import Image from 'next/image';

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
  customAvatar: z.string().nullable().optional(),
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

const IMGBB_API_KEY = process.env.NEXT_PUBLIC_IMGBB_API_KEY;

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
    setValue,
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
      customAvatar: null,
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
        customAvatar: employee.customAvatar || null,
      });
      setImagePreview(employee.customAvatar || employee.avatar || null);
      
      // Set initial image type
      if (employee.customAvatar) {
        setImageType('customAvatar');
      } else {
        setImageType('avatar');
      }
      setImageChanged(false);
    }
  }, [employee, dropdownsLoaded, departments, titles, locations, reset]);

  const [emailError, setEmailError] = useState<string | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(employee?.customAvatar || employee?.avatar || null);
  const [uploading, setUploading] = useState(false);
  
  // Track image state and changes
  const [imageType, setImageType] = useState<'avatar' | 'customAvatar' | null>(null);
  const [imageChanged, setImageChanged] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setUploading(true);
    const formData = new FormData();
    formData.append('image', file);
    try {
      const res = await axios.post(
        `https://api.imgbb.com/1/upload?key=${IMGBB_API_KEY}`,
        formData
      );
      setImagePreview(res.data.data.url);
      setValue('customAvatar', res.data.data.url);
      setImageType('customAvatar');
      setImageChanged(true);
    } catch (err) {
      toast.error('Image upload failed');
    }
    setUploading(false);
  };

  const handleRemoveImage = () => {
    setImagePreview(null);
    setValue('customAvatar', null);
    setImageType('avatar');
    setImageChanged(true);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  /**
   * Handle form submission for both create and update operations
   * - Cleans and prepares data
   * - For updates, only sends changed fields
   * - Handles API errors and logs for debugging
   */
  const onSubmit = async (data: EmployeeFormData) => {
    setEmailError(null);
    try {
      // Clean up the data before sending to API
      const cleanData = {
        ...data,
        manager: data.manager?.trim() || null,
        salary: Math.min(data.salary, 1000000),
      };

      if (employee) {
        // UPDATE OPERATION: Only send fields that have changed
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
        
        // SIMPLE IMAGE LOGIC: Only send image data if it was changed
        if (imageChanged) {
          if (imageType === 'customAvatar') {
            // User uploaded a custom image
            updateData.customAvatar = data.customAvatar || null;
          } else if (imageType === 'avatar') {
            // User removed custom image, use alphabet avatar
            updateData.customAvatar = null;
          }
        }
        // If imageChanged is false, don't send any image data at all
        
        const result = await employeeApi.update(employee.id, updateData);
        if ('error' in result) {
          setEmailError(result.error as string);
          return;
        }
        toast.success('Employee updated successfully!');
      } else {
        // CREATE OPERATION: Send all required fields
        const result = await employeeApi.create(cleanData as CreateEmployeeDto);
        if ('error' in result) {
          setEmailError(result.error as string);
          return;
        }
        toast.success('Employee added successfully!');
      }
      onSuccess();
      onClose();
    } catch (error: unknown) {
      console.error('Error saving employee:', error);
      if (
        error &&
        typeof error === 'object' &&
        (error as AxiosError).isAxiosError &&
        (error as AxiosError<{ message?: string }>).response?.data?.message
      ) {
        setEmailError((error as AxiosError<{ message?: string }>).response!.data!.message!);
      }
    }
  };

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 bg-gradient-to-br from-blue-900/80 via-blue-800/70 to-blue-900/90 backdrop-blur-xl flex items-center justify-center p-4 z-50"
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
              <h2 className="text-2xl font-bold text-gray-900 flex-1">
                {employee ? 'Edit Employee' : 'Add New Employee'}
              </h2>
              <div className="flex items-center gap-4">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onClose}
                  className="p-2"
                >
                  <X className="w-5 h-5" />
                </Button>
              </div>
            </div>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <div className="flex items-center gap-4">
                <div className="relative w-20 h-20 flex-shrink-0">
                  {imagePreview ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={imagePreview}
                      alt="Avatar"
                      className="w-20 h-20 rounded-full object-cover border-2 border-gray-200 bg-gray-100"
                    />
                  ) : (
                    <div className="w-20 h-20 rounded-full flex items-center justify-center border-2 border-gray-300 bg-gray-300 text-white text-3xl font-bold select-none">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-white opacity-80" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                      </svg>
                    </div>
                  )}
                  {imagePreview && (
                    <button
                      type="button"
                      onClick={handleRemoveImage}
                      className="absolute -top-2 -right-2 bg-white border border-red-500 text-red-500 rounded-full w-6 h-6 flex items-center justify-center"
                      aria-label="Remove image"
                    >
                      ×
                    </button>
                  )}
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    className="absolute inset-0 opacity-0 cursor-pointer"
                    onChange={handleImageChange}
                    disabled={uploading}
                    aria-label="Upload avatar"
                  />
                  {uploading && (
                    <div className="absolute inset-0 bg-white bg-opacity-70 flex items-center justify-center rounded-full">
                      Uploading...
                    </div>
                  )}
                </div>
                <span className="text-gray-500 text-sm whitespace-nowrap">Upload an image</span>
              </div>
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
                  error={emailError || errors.email?.message}
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