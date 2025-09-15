# Lumen

A modern educational platform built with React and TypeScript, providing comprehensive student management, academic tracking, and administrative tools.

## Features

- **Student Management**: Complete student profiles with academic records and achievement tracking
- **Dashboard Analytics**: Real-time statistics and progress visualization with interactive charts
- **Achievement System**: Gallery view of student achievements with easy addition/editing capabilities
- **Course Management**: Add and manage courses with detailed academic tracking
- **Administrative Tools**: Comprehensive admin dashboard with advanced analytics
- **Faculty Interface**: Dedicated tools for faculty management and course oversight
- **PDF Document Handling**: Built-in PDF viewer with zoom, rotation, and download capabilities
- **Responsive Design**: Modern UI components with responsive layouts using shadcn/ui
- **Authentication System**: Secure user authentication and role-based access

## Project Structure

```

src/
├── components/
│   ├── student/           # Student-specific components
│   ├── faculty/           # Faculty management tools
│   ├── admin/             # Administrative dashboard and analytics
│   ├── auth/              # Authentication components
│   ├── shared/            # Shared utility components (PDFViewer, etc.)
│   ├── figma/             # Figma design integration components
│   └── ui/                # Reusable UI components (shadcn/ui based)
├── styles/                # Global styling and CSS modules
└── guidelines/            # Project documentation and guidelines

```

## Key Components

- **PDFViewer**: Advanced PDF viewing component with zoom, rotation, and download features
- **DashboardStats**: Real-time analytics and statistics display
- **AchievementGallery**: Interactive gallery for student achievements
- **ProgressCharts**: Visual progress tracking and analytics
- **AdminAnalytics**: Comprehensive administrative reporting tools

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Clone the repository
2. Install dependencies:

   ```bash
   npm install
   ```

3. Start the development server:

   ```bash
   npm run dev
   ```

4. Open your browser and navigate to `http://localhost:5173`

### Building for Production

```bash
npm run build
```

## Technology Stack

- **Frontend**: React 18 + TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS + CSS Modules
- **UI Components**: shadcn/ui component library
- **Icons**: Lucide React
- **Notifications**: Sonner for toast notifications
- **Development**: ESLint + TypeScript for code quality

## Dependencies

This project uses several key dependencies:

- **Radix UI**: For accessible, unstyled UI primitives
- **Lucide React**: For consistent iconography
- **Sonner**: For elegant toast notifications

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Attributions

This project includes components from [shadcn/ui](https://ui.shadcn.com/) used under [MIT license](https://github.com/shadcn-ui/ui/blob/main/LICENSE.md) and photos from [Unsplash](https://unsplash.com) used under their [license](https://unsplash.com/license).

## Author

SHREY TRIPATHI
