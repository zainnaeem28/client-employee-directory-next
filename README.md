# Employee Directory App

A modern, responsive employee management system built with Next.js 15, React 19, and TypeScript. This application provides a comprehensive interface for managing employee data with real-time filtering, search, and CRUD operations.

![Employee Directory App](https://img.shields.io/badge/Next.js-15.3.4-black?style=for-the-badge&logo=next.js)
![React](https://img.shields.io/badge/React-19.0.0-blue?style=for-the-badge&logo=react)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue?style=for-the-badge&logo=typescript)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-4.0-38B2AC?style=for-the-badge&logo=tailwind-css)

## ✨ Features

### 🎯 Core Functionality
- **Employee Management**: Full CRUD operations (Create, Read, Update, Delete)
- **Real-time Search**: Search employees by name, email, or any field
- **Advanced Filtering**: Filter by department, title, location, and status
- **Pagination**: Efficient data loading with configurable page sizes
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile

### 🎨 User Experience
- **Modern UI**: Clean, intuitive interface with smooth animations
- **Form Validation**: Client-side validation with Zod schema
- **Error Handling**: Comprehensive error boundaries and user feedback
- **Loading States**: Skeleton loading and progress indicators
- **Confirmation Dialogs**: Safe delete operations with user confirmation

### 🔧 Technical Features
- **TypeScript**: Full type safety throughout the application
- **API Proxy**: CORS-free API communication in production
- **Optimized Performance**: Lazy loading, code splitting, and efficient rendering
- **Health Monitoring**: Backend status monitoring and error reporting
- **Environment Configuration**: Flexible configuration for different environments

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn
- Backend API running (see [Backend Setup](#backend-setup))

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd client-employee-directory-next
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp env.example .env.local
   ```
   
   Update `.env.local` with your API URL:
   ```env
   NEXT_PUBLIC_API_URL=http://localhost:3001
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🏗️ Project Structure

```
src/
├── app/                    # Next.js App Router
│   ├── api/               # API routes (proxy)
│   ├── globals.css        # Global styles
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Main page component
├── components/            # React components
│   ├── ui/               # Reusable UI components
│   │   ├── Button.tsx
│   │   ├── Input.tsx
│   │   └── Select.tsx
│   ├── EmployeeCard.tsx   # Employee display card
│   ├── EmployeeForm.tsx   # Add/Edit employee form
│   ├── EmployeeFilters.tsx # Search and filter controls
│   ├── Header.tsx         # Application header
│   ├── Pagination.tsx     # Pagination component
│   └── BackendStatus.tsx  # API health monitoring
├── lib/                   # Utility libraries
│   ├── api.ts            # API client configuration
│   ├── auth.ts           # Authentication utilities
│   └── utils.ts          # Helper functions
└── types/                # TypeScript type definitions
    └── employee.ts       # Employee-related types
```

## 🛠️ Available Scripts

| Script | Description |
|--------|-------------|
| `npm run dev` | Start development server with Turbopack |
| `npm run build` | Build for production |
| `npm run start` | Start production server |
| `npm run lint` | Run ESLint for code quality |

## 🎨 UI Components

### Core Components
- **EmployeeCard**: Displays employee information with edit/delete actions
- **EmployeeForm**: Modal form for adding/editing employees
- **EmployeeFilters**: Search and filter interface
- **Pagination**: Page navigation with configurable limits

### UI Components
- **Button**: Versatile button component with loading states
- **Input**: Form input with validation support
- **Select**: Dropdown select component

## 🔌 API Integration

The application uses a proxy-based API architecture:

### Development
- Direct API calls to backend service
- CORS headers handled by backend

### Production
- API proxy through Next.js routes
- No CORS issues
- Better security and performance

### API Endpoints
- `GET /api/v1/employees` - List employees with filters
- `GET /api/v1/employees/:id` - Get employee by ID
- `POST /api/v1/employees` - Create new employee
- `PATCH /api/v1/employees/:id` - Update employee
- `DELETE /api/v1/employees/:id` - Delete employee
- `GET /api/v1/employees/departments` - Get departments list
- `GET /api/v1/employees/titles` - Get job titles list
- `GET /api/v1/employees/locations` - Get locations list

## 🔒 Security & Performance Improvements

### Security Enhancements
- **Server-side Image Upload**: ImgBB API key is now securely stored on the server and not exposed to the client
- **Production Logging**: Console logs are only shown in development mode to prevent sensitive data exposure
- **Input Validation**: Comprehensive validation on both client and server sides

### Performance Optimizations
- **Debounced Search**: Search inputs are debounced to reduce unnecessary API calls
- **Server-Side Rendering**: Initial page load is now server-rendered for better SEO and performance
- **Optimized Re-renders**: Smart filtering prevents unnecessary API calls on initial load

## 🎯 Key Features Explained

### Employee Management
- **Create**: Add new employees with comprehensive form validation
- **Read**: View employee details in responsive cards
- **Update**: Edit employee information with change detection
- **Delete**: Remove employees with confirmation dialogs

### Search & Filtering
- **Global Search**: Search across all employee fields
- **Department Filter**: Filter by specific departments
- **Title Filter**: Filter by job titles
- **Location Filter**: Filter by office locations
- **Combined Filters**: Use multiple filters simultaneously

### Data Validation
- **Client-side**: Zod schema validation for immediate feedback
- **Server-side**: API validation for data integrity
- **Type Safety**: TypeScript ensures data consistency

## 🚀 Deployment

### Vercel (Recommended)
1. Connect your GitHub repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Environment Variables
```env
NEXT_PUBLIC_API_URL=https://your-backend-api.com
```

## 🔧 Configuration

### Next.js Config
- CORS headers for cross-origin requests
- Optimized build settings
- API proxy configuration

### Tailwind CSS
- Custom color palette
- Responsive breakpoints
- Component-specific styles

## 🧪 Testing

The project includes:
- TypeScript for type safety
- ESLint for code quality
- Error boundaries for runtime error handling
- Comprehensive error logging

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

If you encounter any issues:

1. Check the browser console for error messages
2. Verify your backend API is running and accessible
3. Ensure environment variables are correctly set
4. Check the network tab for API request failures

## 🔗 Related Projects

- **Backend API**: [Employee Directory Backend](https://github.com/your-username/employee-directory-backend)
- **Documentation**: [API Documentation](https://your-api-docs.com)

## Image Upload & Avatar Hosting

This app supports employee profile image uploads using [imgbb.com](https://imgbb.com/) as a free image hosting service.

### How it works
- When adding or editing an employee, users can upload a profile image.
- Uploaded images are hosted on imgbb.com and the image URL is stored in the employee record.
- If no image is uploaded, a default avatar is generated using the employee's initials (via ui-avatars.com).

### Environment Variable Required
To enable image uploads, you must set the following environment variable in your `.env.local` file:

```
IMGBB_API_KEY=your_imgbb_api_key
```

- Get your API key by signing up at [imgbb.com API](https://api.imgbb.com/).
- Restart your dev server after adding or changing this variable.

### Notes
- The image upload feature works in both development and production.
- The API key is now securely stored on the server-side and not exposed to the client.
- If the API key is missing or invalid, image uploads will fail.

---

Built with ❤️ using Next.js, React, and TypeScript 