# Shared Components

## PDFViewer Component

Advanced PDF viewing component with interactive controls.

### Features
- **Zoom Controls**: 50% to 200% zoom range
- **Rotation**: 90-degree increments
- **Download**: Secure file download
- **Mobile Optimized**: Touch-friendly controls

### Usage
```tsx
import { PDFViewer } from '../shared/PDFViewer';

<PDFViewer
  fileUrl="/path/to/document.pdf"
  fileName="certificate.pdf"
  title="Achievement Certificate"
  studentName="John Doe"
  activityType="Competition"
/>
```

### Props
| Prop | Type | Required | Description |
|------|------|----------|-------------|
| fileUrl | string | No | URL to PDF file |
| fileName | string | No | Display name for file |
| title | string | Yes | Document title |
| studentName | string | Yes | Student's name |
| activityType | string | Yes | Type of activity |