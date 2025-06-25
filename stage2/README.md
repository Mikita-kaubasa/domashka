# User Management Application

A modern React TypeScript application for managing user data with comprehensive features including data fetching, caching, error handling, and interactive user interfaces.

## 🚀 Features

- **User Data Management**: Display, view, and delete users with a modern table interface
- **Interactive Modals**: Detailed user information display with accessibility features
- **Data Caching**: Intelligent caching system with automatic expiration and request deduplication
- **Error Handling**: Comprehensive error boundaries and user-friendly error messages
- **Performance Optimization**: Debouncing, throttling, and lazy loading for optimal performance
- **Accessibility**: Full keyboard navigation, ARIA labels, and screen reader support
- **Responsive Design**: Modern UI that works across all device sizes
- **Type Safety**: Full TypeScript implementation with comprehensive type definitions

## 📁 Project Structure

```
src/
├── components/           # React components
│   ├── ui/              # Reusable UI components
│   │   └── ErrorBoundary.tsx
│   ├── UserList.tsx     # Main user list component
│   ├── UserDetailsModal.tsx  # User details modal
│   └── ConfirmDeleteModal.tsx # Delete confirmation modal
├── hooks/               # Custom React hooks
│   └── useUsers.ts      # User data management hook
├── services/            # API and external services
│   └── api.ts           # API service with caching
├── utils/               # Utility functions
│   ├── formatters.ts    # Data formatting utilities
│   └── performance.ts   # Performance optimization utilities
├── types/               # TypeScript type definitions
│   └── types.ts         # Core application types
├── constants/           # Application constants
│   └── api.ts           # API configuration constants
└── App.tsx              # Main application component
```

## 🛠️ Technology Stack

- **React 18** - Modern React with hooks and functional components
- **TypeScript** - Type-safe development with comprehensive interfaces
- **CSS3** - Custom styling with modern design patterns
- **Fetch API** - Modern HTTP client for API requests
- **JSONPlaceholder API** - Free fake API for testing and prototyping

## 📖 API Documentation

### Core Types

The application uses comprehensive TypeScript interfaces for type safety:

```typescript
interface User {
  id: number;
  name: string;
  username: string;
  email: string;
  address: Address;
  phone: string;
  website: string;
  company: Company;
}
```

### Components

#### App Component
Main application component that orchestrates the user interface and manages application state.

**Features:**
- Loading state management
- Error handling with retry functionality
- Integration with useUsers hook
- Error boundary wrapping

#### UserList Component
Interactive table component for displaying and managing users.

**Features:**
- Tabular user data display
- Click-to-view user details
- Delete user functionality with confirmation
- Accessibility features (ARIA labels, keyboard navigation)
- Lazy loading of modal components

#### UserDetailsModal Component
Modal component for displaying comprehensive user information.

**Features:**
- Complete user details display
- Interactive map links
- Clickable contact information
- Keyboard navigation (Escape to close)
- Body scroll prevention

#### ConfirmDeleteModal Component
Confirmation dialog for user deletion operations.

**Features:**
- Clear confirmation messaging
- Keyboard shortcuts (Escape to cancel, Enter/Space to confirm)
- Auto-focus on cancel button for safety

#### ErrorBoundary Component
Error boundary for catching and handling React component errors.

**Features:**
- Catches JavaScript errors in child components
- Logs error information for debugging
- Displays fallback UI when errors occur
- Supports custom fallback components

### Custom Hooks

#### useUsers Hook
Custom React hook for managing user data fetching and state.

**Features:**
- Automatic data fetching on mount
- Loading state management
- Error handling with user-friendly messages
- Manual refetch capability
- Memoized return values

### Services

#### API Service
Comprehensive API service with advanced features.

**Features:**
- HTTP request handling with proper error management
- Request caching with configurable expiration (5 minutes)
- Automatic retry logic with exponential backoff
- Request deduplication to prevent duplicate calls
- Type-safe API responses

### Utilities

#### Formatters
Utility functions for formatting user data consistently.

**Available Functions:**
- `formatAddress()` - Formats address into readable string
- `formatPhoneNumber()` - Standardizes phone number formats
- `formatWebsite()` - Ensures proper URL protocols
- `getMapUrl()` - Generates Google Maps URLs
- `truncateText()` - Truncates text with ellipsis

#### Performance Utilities
Performance optimization utilities for React applications.

**Available Functions:**
- `debounce()` - Creates debounced function versions
- `throttle()` - Creates throttled function versions
- `chunkArray()` - Splits arrays into smaller chunks
- `measurePerformance()` - Measures function execution time
- `createIntersectionObserver()` - Creates intersection observers for lazy loading

## 🚀 Getting Started

### Prerequisites

- Node.js (version 16 or higher)
- npm or yarn package manager

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd user-management-app
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

4. Open [http://localhost:3000](http://localhost:3000) to view it in the browser.

### Available Scripts

- `npm start` - Runs the app in development mode
- `npm test` - Launches the test runner
- `npm run build` - Builds the app for production
- `npm run eject` - Ejects from Create React App (one-way operation)

## 🧪 Testing

The application includes comprehensive test coverage:

- Unit tests for all components
- Hook testing with React Testing Library
- API service testing
- Utility function testing
- Performance testing

Run tests with:
```bash
npm test
```

## 📚 Usage Examples

### Basic Usage

```tsx
import { useUsers } from './hooks/useUsers';
import UserList from './components/UserList';

function App() {
  const { users, loading, error, refetch } = useUsers();

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return <UserList users={users} />;
}
```

### Custom Error Boundary

```tsx
import ErrorBoundary from './components/ui/ErrorBoundary';

function App() {
  return (
    <ErrorBoundary fallback={<CustomErrorComponent />}>
      <UserList users={users} />
    </ErrorBoundary>
  );
}
```

### Performance Optimization

```tsx
import { debounce, measurePerformance } from './utils/performance';

// Debounced search
const debouncedSearch = debounce((query) => {
  searchUsers(query);
}, 300);

// Performance measurement
const result = measurePerformance(() => {
  return expensiveOperation();
}, 'Expensive Operation');
```

## 🔧 Configuration

### API Configuration

The application uses JSONPlaceholder API by default. Configuration can be modified in `src/constants/api.ts`:

```typescript
export const API_BASE_URL = 'https://jsonplaceholder.typicode.com';
export const API_ENDPOINTS = {
  USERS: `${API_BASE_URL}/users`,
} as const;
```

### Cache Configuration

Cache duration can be modified in the API service (`src/services/api.ts`):

```typescript
private readonly CACHE_DURATION = 5 * 60 * 1000; // 5 minutes
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [JSONPlaceholder](https://jsonplaceholder.typicode.com/) for providing the free fake API
- [React](https://reactjs.org/) team for the amazing framework
- [TypeScript](https://www.typescriptlang.org/) team for type safety
