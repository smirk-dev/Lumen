# Lumen

A comprehensive student achievement tracking and management platform built with React and TypeScript. Lumen provides a modern, role-based system for students, faculty, and administrators to manage academic activities, track progress, and generate reports.

## Features

### Student Features
- **Activity Submission**: Submit achievements, certificates, competitions, and other academic activities
- **Progress Tracking**: Visual analytics of submitted activities and their approval status
- **Profile Management**: Comprehensive student profiles with academic records
- **Real-time Status Updates**: Track submission status (pending, approved, rejected)
- **Document Management**: Upload and view proof documents with built-in PDF viewer

### Faculty Features
- **Activity Review System**: Review and approve/reject student submissions
- **Advanced Search & Filtering**: Find specific activities with enhanced search capabilities
- **Student Directory**: View and manage student information across departments
- **Bulk Operations**: Efficiently process multiple submissions
- **Comment System**: Provide detailed feedback on submissions

### Administrative Features
- **Comprehensive Dashboard**: System-wide analytics and statistics
- **User Management**: Create and manage student and faculty accounts
- **Advanced Reporting**: Generate detailed reports in CSV and PDF formats
- **System Analytics**: Track usage patterns and performance metrics
- **Data Export**: Bulk export capabilities for institutional reporting

### Technical Features
- **Role-based Access Control**: Secure authentication system with different user roles
- **Responsive Design**: Mobile-first design that works across all devices
- **PDF Document Handling**: Built-in PDF viewer with zoom, rotation, and download capabilities
- **Real-time Search**: Global search functionality across activities and users
- **Local Storage Integration**: Persistent data storage with localStorage backup
- **Modern UI Components**: Built with shadcn/ui for consistent, accessible design

## Project Structure

```
src/
├── components/
│   ├── student/           # Student dashboard and activity submission
│   │   ├── StudentDashboard.tsx
│   │   ├── AddActivityDialog.tsx
│   │   ├── StudentStats.tsx
│   │   └── StudentProfileView.tsx
│   ├── faculty/           # Faculty review and management tools
│   │   ├── FacultyDashboard.tsx
│   │   ├── FacultyReviewView.tsx
│   │   ├── ReviewActivityDialog.tsx
│   │   ├── PendingActivityCard.tsx
│   │   └── FacultyStudentsView.tsx
│   ├── admin/             # Administrative dashboard and tools
│   │   ├── AdminDashboard.tsx
│   │   ├── UserManagement.tsx
│   │   ├── AdminStats.tsx
│   │   ├── AdminAnalytics.tsx
│   │   └── ExportDialog.tsx
│   ├── auth/              # Authentication components
│   ├── shared/            # Shared utility components
│   │   ├── PDFViewer.tsx
│   │   ├── PDFViewerDialog.tsx
│   │   ├── GlobalSearch.tsx
│   │   ├── RoleHeader.tsx
│   │   └── SearchWithSuggestions.tsx
│   ├── reports/           # Reporting components
│   ├── settings/          # User settings and preferences
│   └── ui/                # Reusable UI components (shadcn/ui)
├── hooks/                 # Custom React hooks
├── styles/                # Global styling
├── guidelines/            # Project documentation
└── main.tsx              # Application entry point
```

## Key Components

### Core Features
- **[`PDFViewer`](src/components/shared/PDFViewer.tsx)**: Advanced PDF viewing with zoom, rotation, and download capabilities
- **[`GlobalSearch`](src/components/shared/GlobalSearch.tsx)**: Comprehensive search across activities, users, and system functions
- **[`RoleHeader`](src/components/shared/RoleHeader.tsx)**: Dynamic navigation based on user roles

### Student Components
- **[`StudentDashboard`](src/components/student/StudentDashboard.tsx)**: Main student interface with activity overview
- **[`AddActivityDialog`](src/components/student/AddActivityDialog.tsx)**: Activity submission form with file upload

### Faculty Components
- **[`FacultyReviewView`](src/components/faculty/FacultyReviewView.tsx)**: Enhanced review interface with filtering and search
- **[`ReviewActivityDialog`](src/components/faculty/ReviewActivityDialog.tsx)**: Detailed activity review with approval/rejection workflow

### Administrative Components
- **[`AdminDashboard`](src/components/admin/AdminDashboard.tsx)**: Comprehensive admin interface with analytics
- **[`UserManagement`](src/components/admin/UserManagement.tsx)**: Complete user account management system
- **[`ExportDialog`](src/components/admin/ExportDialog.tsx)**: Data export functionality in multiple formats

## Getting Started

### Prerequisites

- Node.js (v18 or higher)
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/lumen.git
   cd lumen
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

3. Start the development server:
   ```bash
   npm run dev
   ```

4. Open your browser and navigate to `http://localhost:3000`

### Default Login Credentials

The application comes with sample users for testing:

**Student Account:**
- Email: `john.smith@university.edu`
- Role: Student

**Faculty Account:**
- Email: `emily.chen@university.edu`
- Role: Faculty

**Admin Account:**
- Email: `michael.johnson@university.edu`
- Role: Administrator

### Building for Production

```bash
npm run build
```

The production build will be available in the `build` directory.

## Technology Stack

### Core Technologies
- **React 18**: Modern React with hooks and functional components
- **TypeScript**: Full type safety and enhanced developer experience
- **Vite**: Fast build tool and development server

### UI & Styling
- **Tailwind CSS**: Utility-first CSS framework
- **shadcn/ui**: High-quality, accessible UI component library
- **Lucide React**: Consistent iconography
- **Radix UI**: Accessible, unstyled UI primitives

### Additional Libraries
- **jsPDF**: PDF generation for reports
- **Sonner**: Elegant toast notifications
- **date-fns**: Date formatting and manipulation
- **Recharts**: Data visualization and charts

## Key Features Deep Dive

### Authentication & Authorization
- Role-based access control (Student, Faculty, Admin)
- Secure session management
- Protected routes based on user roles

### Activity Management
- Multi-step submission process with validation
- File upload with type and size validation
- Status tracking (pending, approved, rejected)
- Faculty review workflow with comments

### Analytics & Reporting
- Real-time dashboard statistics
- Interactive charts and visualizations
- CSV and PDF export capabilities
- Advanced filtering and search

### Document Management
- Built-in PDF viewer with controls
- File type validation (PDF, JPG, PNG)
- Secure file handling and storage simulation
- Document preview and download functionality

## Development Guidelines

### Code Style
- TypeScript strict mode enabled
- ESLint configuration for code quality
- Consistent component structure and naming
- Comprehensive type definitions

### Component Architecture
- Functional components with hooks
- Props interfaces for type safety
- Reusable UI components
- Clear separation of concerns

### State Management
- React hooks for local state
- localStorage for data persistence
- Prop drilling minimized with context where appropriate

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Attributions

This project includes:
- Components from [shadcn/ui](https://ui.shadcn.com/) used under [MIT license](https://github.com/shadcn-ui/ui/blob/main/LICENSE.md)
- Photos from [Unsplash](https://unsplash.com) used under their [license](https://unsplash.com/license)

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## Author

**SHREY TRIPATHI**

For questions or support, please open an issue on the GitHub repository.
