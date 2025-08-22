# DocTime Backend API

A robust, scalable backend API for the DocTime healthcare appointment system.

## 🏗️ Architecture Overview

### **Layered Architecture Pattern**
```
┌─────────────────┐
│   Controllers   │ ← Handle HTTP requests/responses
├─────────────────┤
│     Services    │ ← Business logic layer
├─────────────────┤
│     Models      │ ← Data models & database operations
├─────────────────┤
│   Middleware    │ ← Authentication, validation, etc.
└─────────────────┘
```

### **Key Design Principles**
- **Separation of Concerns**: Each layer has a specific responsibility
- **Single Responsibility**: Each function/module does one thing well
- **Dependency Injection**: Loose coupling between components
- **Error Handling**: Comprehensive error handling at all levels
- **Security First**: Built-in security middleware and validation

## 🚀 Getting Started

### **Prerequisites**
- Node.js 18+ 
- MongoDB 6+
- npm or yarn

### **Installation**
```bash
# Install dependencies
npm install

# Copy environment file
cp env.example .env

# Edit .env with your configuration
nano .env

# Start development server
npm run dev
```

### **Available Scripts**
- `npm run dev` - Start development server with hot reload
- `npm run build` - Build TypeScript to JavaScript
- `npm start` - Start production server

## 📁 Project Structure

```
src/
├── config/          # Configuration files (database, etc.)
├── controllers/     # Request handlers
├── middleware/      # Custom middleware
├── models/          # Database models
├── routes/          # API route definitions
├── services/        # Business logic
├── types/           # TypeScript type definitions
├── utils/           # Utility functions
└── index.ts         # Main server file
```

## 🔐 Security Features

- **Helmet**: Security headers
- **CORS**: Cross-origin request handling
- **Rate Limiting**: DDoS protection
- **Input Validation**: Request data sanitization
- **JWT Authentication**: Secure token-based auth
- **Password Hashing**: bcrypt for secure storage

## 🗄️ Database Design

### **Collections (MongoDB)**
- **Users**: Patients and doctors
- **Appointments**: Booking and scheduling
- **Medical Records**: Patient health data
- **Notifications**: System alerts and reminders

### **Connection Management**
- Connection pooling for performance
- Automatic reconnection
- Graceful shutdown handling

## 📊 API Endpoints

### **Health Check**
- `GET /health` - Server status

### **Authentication** (Coming Soon)
- `POST /api/v1/auth/register` - User registration
- `POST /api/v1/auth/login` - User login
- `POST /api/v1/auth/logout` - User logout

### **Users** (Coming Soon)
- `GET /api/v1/users/profile` - Get user profile
- `PUT /api/v1/users/profile` - Update profile
- `DELETE /api/v1/users/profile` - Delete account

### **Appointments** (Coming Soon)
- `POST /api/v1/appointments` - Create appointment
- `GET /api/v1/appointments` - List appointments
- `PUT /api/v1/appointments/:id` - Update appointment
- `DELETE /api/v1/appointments/:id` - Cancel appointment

## 🧪 Testing

```bash
# Run tests (when implemented)
npm test

# Run tests in watch mode
npm run test:watch
```

## 🚀 Deployment

### **Environment Variables**
- Set `NODE_ENV=production`
- Configure production MongoDB URI
- Set strong JWT secret
- Configure CORS origins

### **Process Management**
- Use PM2 or similar for production
- Set up monitoring and logging
- Configure health checks

## 📚 Best Practices

1. **Error Handling**: Always use try-catch blocks
2. **Validation**: Validate all input data
3. **Logging**: Log important events and errors
4. **Security**: Never expose sensitive information
5. **Performance**: Use database indexes and caching
6. **Documentation**: Keep API docs updated

## 🔧 Development

### **Code Style**
- Use TypeScript strict mode
- Follow ESLint rules
- Write meaningful commit messages
- Use conventional commits

### **Git Workflow**
1. Create feature branch
2. Make changes
3. Write tests
4. Submit pull request
5. Code review
6. Merge to main

## 📞 Support

For questions or issues, please contact the development team.
