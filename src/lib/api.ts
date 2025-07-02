import axios from 'axios';
import { Employee, CreateEmployeeDto, UpdateEmployeeDto, EmployeeFilters, PaginatedEmployees } from '@/types/employee';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

const api = axios.create({
  baseURL: `${API_BASE_URL.replace(/\/$/, '')}/api/v1`,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 second timeout
});

// Request interceptor for logging
api.interceptors.request.use(
  (config) => {
    console.log(`🚀 API Request: ${config.method?.toUpperCase()} ${config.url}`);
    return config;
  },
  (error) => {
    console.error('❌ API Request Error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => {
    console.log(`✅ API Response: ${response.status} ${response.config.url}`);
    return response;
  },
  (error) => {
    console.error('❌ API Response Error:', {
      status: error.response?.status,
      message: error.response?.data?.message || error.message,
      url: error.config?.url,
    });
    return Promise.reject(error);
  }
);

export const employeeApi = {
  getAll: async (filters: EmployeeFilters = {}): Promise<PaginatedEmployees> => {
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== '') {
        params.append(key, value.toString());
      }
    });
    
    const response = await api.get(`/employees?${params.toString()}`);
    return response.data;
  },

  getById: async (id: string): Promise<Employee> => {
    const response = await api.get(`/employees/${id}`);
    return response.data;
  },

  create: async (employee: CreateEmployeeDto): Promise<Employee> => {
    const response = await api.post('/employees', employee);
    return response.data;
  },

  update: async (id: string, employee: UpdateEmployeeDto): Promise<Employee> => {
    const response = await api.patch(`/employees/${id}`, employee);
    return response.data;
  },

  delete: async (id: string): Promise<void> => {
    await api.delete(`/employees/${id}`);
  },

  getDepartments: async (): Promise<string[]> => {
    const response = await api.get('/employees/departments');
    return response.data;
  },

  getTitles: async (): Promise<string[]> => {
    const response = await api.get('/employees/titles');
    return response.data;
  },

  getLocations: async (): Promise<string[]> => {
    const response = await api.get('/employees/locations');
    return response.data;
  },
};

// Health check API
export const healthApi = {
  check: async () => {
    const response = await api.get('/health');
    return response.data;
  },
  
  ready: async () => {
    const response = await api.get('/health/ready');
    return response.data;
  },
  
  live: async () => {
    const response = await api.get('/health/live');
    return response.data;
  },
}; 