export interface Employee {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  department: string;
  title: string;
  location: string;
  avatar: string;
  hireDate: string;
  salary: number;
  manager?: string;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
  fullName?: string;
  customAvatar?: string | null;
}

export interface CreateEmployeeDto {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  department: string;
  title: string;
  location: string;
  salary: number;
  manager?: string;
  customAvatar?: string | null;
}

export interface UpdateEmployeeDto {
  firstName?: string;
  lastName?: string;
  email?: string;
  phone?: string;
  department?: string;
  title?: string;
  location?: string;
  salary?: number;
  manager?: string;
  isActive?: boolean;
  customAvatar?: string | null;
}

export interface EmployeeFilters {
  department?: string;
  title?: string;
  location?: string;
  search?: string;
  page?: number;
  limit?: number;
}

export interface PaginatedEmployees {
  employees: Employee[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
} 