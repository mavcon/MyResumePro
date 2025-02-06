# Development Guide

## Best Practices

### Code Style
- Use TypeScript for all new code
- Follow functional programming principles
- Use ESLint and Prettier for code formatting
- Write meaningful commit messages following conventional commits

### React Components
- Use functional components with hooks
- Implement error boundaries for error handling
- Use React.Suspense for code splitting
- Follow the container/presenter pattern

### State Management
- Use React Context for global state
- Implement proper form state management with Formik
- Use local state for component-specific data
- Implement proper error handling and loading states

### Performance
- Implement proper code splitting
- Use React.memo for expensive computations
- Optimize images and assets
- Use proper caching strategies

### Security
- Implement proper CORS policies
- Use environment variables for sensitive data
- Implement proper input validation
- Use proper authentication and authorization

### Testing
- Write unit tests for utilities and hooks
- Write integration tests for components
- Implement E2E tests for critical flows
- Use proper mocking strategies

## Development Setup

### Prerequisites
- Node.js 18+
- Docker and Docker Compose
- Git
- VS Code (recommended)

### VS Code Extensions
- ESLint
- Prettier
- Docker
- GitLens
- Tailwind CSS IntelliSense

### Environment Setup
1. Clone the repository
2. Install dependencies
3. Set up environment variables (see Environment Variables section below)
4. Start development servers

### Service Architecture
The application consists of multiple microservices that need to be running for full functionality:

- Frontend Service (Port 3006)
  * React application
  * Handles UI and user interactions
  * Uses environment variables for service URLs

- Backend Services:
  * User Service (Port 3000): Handles authentication and user management
  * Parser Service (Port 3001): Processes resume uploads and parsing
  * AI Service (Port 3002): Handles AI-powered optimizations
  * Payment Service (Port 3003): Manages subscriptions and payments

### Environment Variables

#### Local Development Setup
1. Copy the template files to create your local environment files:
   ```bash
   cp docker-compose.env.template docker-compose.env
   cp services/frontend/.env.template services/frontend/.env
   ```

2. Update the environment files with your specific values:
   - `docker-compose.env`: Contains backend service configurations
   - `services/frontend/.env`: Contains frontend configurations

Frontend service (.env file):
```
REACT_APP_PARSER_SERVICE_URL=http://localhost:3001
REACT_APP_AI_SERVICE_URL=http://localhost:3002
REACT_APP_PAYMENT_SERVICE_URL=http://localhost:3003
REACT_APP_USER_SERVICE_URL=http://localhost:3000
PORT=3006
REACT_APP_API_URL=http://localhost:3000
REACT_APP_SENTRY_DSN=your-sentry-dsn  # Optional: Set up Sentry for error tracking
```

#### Production Setup
For production environments:
1. Never commit environment files (.env, docker-compose.env)
2. Use your deployment platform's secrets management:
   - Kubernetes: Use secrets and configMaps
   - Cloud platforms: Use their respective secrets management services
   - CI/CD: Configure environment variables in your pipeline settings

#### Sensitive Values
For sensitive values like API keys and secrets:
1. Generate unique values for each environment
2. Use strong, random values for secrets (e.g., JWT_SECRET)
3. Rotate secrets periodically
4. Limit access to production credentials

#### Environment Types
Maintain separate environment files for different contexts:
- Development: Local development settings
- Staging: Testing environment that mirrors production
- Production: Live environment settings

Never share production credentials in development environments or version control.

### Starting the Application
Option 1: Using Docker Compose (Recommended)
```bash
docker-compose up
```

Option 2: Starting Services Individually
1. Start backend services:
```bash
# In separate terminals
cd services/user-service && npm start
cd services/parser-service && npm start
cd services/ai-service && npm start
cd services/payment-service && npm start
```

2. Start frontend service:
```bash
cd services/frontend && npm start
```

### Development Workflow
1. Create feature branch
2. Implement changes
3. Write tests
4. Submit PR
5. Code review
6. Merge

### Debugging
- Use React Developer Tools
- Implement proper logging
- Use VS Code debugger
- Monitor performance with React Profiler
