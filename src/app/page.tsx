/*
# @Author: Muhammad Zain Naeem PMP®, APMC® <zain.naeem@invozone.dev>
# @Role: Senior Software Engineer, Designer & Writer
# @GitHub: https://github.com/scriptsamurai28
# @CodeStats: https://codestats.net/users/scriptsamurai28
# @Date: July 04, 2025
# @Version: 1.0.0
# @Status: Production Ready ✅
#
# 💡 "Code is poetry written in logic"
# 📍 Built with ❤️ in Lahore, Pakistan
# 🎯 Turning ideas into digital reality
*/

import React from 'react';
import { Suspense } from 'react';
import { EmployeeFilters, PaginatedEmployees } from '@/types/employee';
import Header from '@/components/Header';
import StatsCards from '@/components/StatsCards';
import EmployeeList from '@/components/EmployeeList';
import { employeeApi } from '@/lib/api';

// Default filters for initial server-side render
const defaultFilters: EmployeeFilters = {
  page: 1,
  limit: 10,
};

// Server-side data fetching
async function getInitialData(): Promise<PaginatedEmployees> {
  try {
    const data = await employeeApi.getAll(defaultFilters);
    return data;
  } catch (error) {
    // Return empty data structure on error - silent error handling
    return {
      employees: [],
      total: 0,
      page: 1,
      totalPages: 1,
      limit: 10,
    };
  }
}

export default async function Home() {
  // Fetch initial data on the server
  const initialData = await getInitialData();

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <StatsCards />
        <Suspense fallback={<div>Loading...</div>}>
          <EmployeeList initialData={initialData} />
        </Suspense>
      </div>
    </div>
  );
}
