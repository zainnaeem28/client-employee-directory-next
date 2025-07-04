import axios from 'axios';
import { Employee, CreateEmployeeDto, UpdateEmployeeDto, EmployeeFilters, PaginatedEmployees } from '@/types/employee';

/**
 * API Configuration
 * 
 * This module handles all API communication with the backend service.
 * In production, requests are proxied through Next.js API routes to avoid CORS issues.
 * In development, direct API calls are made to the backend service.
 */

// Environment-based API configuration
const isProduction = process.env.NODE_ENV === 'production';
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

// Create axios instance with common configuration
const api = axios.create({
  baseURL: isProduction ? '/api/proxy' : `${API_BASE_URL.replace(/\/$/, '')}/api/v1`,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 second timeout for all requests
});

/**
 * Request Interceptor
 * Logs all outgoing API requests for debugging purposes
 */
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

/**
 * Response Interceptor
 * Logs all API responses and handles common error scenarios
 */
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

/**
 * employeeApi provides all employee-related API operations
 * Includes CRUD, filtering, and dropdown data retrieval
 */
export const employeeApi = {
  /**
   * Get all employees with optional filtering and pagination
   * @param filters - Optional filters for department, title, location, search, page, limit
   * @returns Promise with paginated employee data
   */
  getAll: async (filters: EmployeeFilters = {}): Promise<PaginatedEmployees> => {
    // Build query parameters from filters object
    const params = new URLSearchParams();
    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== '') {
        params.append(key, value.toString());
      }
    });
    
    const response = await api.get(`/employees?${params.toString()}`);
    return response.data;
  },

  /**
   * Get a single employee by ID
   * @param id - Employee unique identifier
   * @returns Promise with employee data
   */
  getById: async (id: string): Promise<Employee> => {
    const response = await api.get(`/employees/${id}`);
    return response.data;
  },

  /**
   * Create a new employee
   * @param employee - Employee data to create
   * @returns Promise with created employee data
   */
  create: async (employee: CreateEmployeeDto): Promise<Employee> => {
    const response = await api.post('/employees', employee);
    return response.data;
  },

  /**
   * Update an existing employee
   * @param id - Employee unique identifier
   * @param employee - Updated employee data (partial)
   * @returns Promise with updated employee data
   */
  update: async (id: string, employee: UpdateEmployeeDto): Promise<Employee> => {
    const response = await api.patch(`/employees/${id}`, employee);
    return response.data;
  },

  /**
   * Delete an employee
   * @param id - Employee unique identifier
   * @returns Promise that resolves when deletion is complete
   */
  delete: async (id: string): Promise<void> => {
    await api.delete(`/employees/${id}`);
  },

  /**
   * Get all available departments for dropdown options
   * @returns Promise with array of department names
   */
  getDepartments: async (): Promise<string[]> => {
    const response = await api.get('/employees/departments');
    return response.data;
  },

  /**
   * Get all available job titles for dropdown options
   * @returns Promise with array of job title names
   */
  getTitles: async (): Promise<string[]> => {
    const response = await api.get('/employees/titles');
    return response.data;
  },

  /**
   * Get all available locations for dropdown options
   * @returns Promise with array of location names
   */
  getLocations: async (): Promise<string[]> => {
    const response = await api.get('/employees/locations');
    return response.data;
  },

  /**
   * Get employee statistics for dashboard
   * @returns Promise with employee statistics data
   */
  getStats: async () => {
    const response = await api.get('/employees/stats');
    return response.data;
  },
};

/**
 * Health Check API Service
 * 
 * Provides methods to check the health and status of the backend service.
 * Used for monitoring and ensuring the API is available before making requests.
 */
export const healthApi = {
  /**
   * General health check endpoint
   * @returns Promise with health status data
   */
  check: async () => {
    const response = await api.get('/health');
    return response.data;
  },
  
  /**
   * Readiness check - indicates if the service is ready to accept requests
   * @returns Promise with readiness status data
   */
  ready: async () => {
    const response = await api.get('/health/ready');
    return response.data;
  },
  
  /**
   * Liveness check - indicates if the service is running
   * @returns Promise with liveness status data
   */
  live: async () => {
    const response = await api.get('/health/live');
    return response.data;
  },
}; 