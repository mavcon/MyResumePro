# MyResumePro

A modern, microservices-based resume parsing and enhancement platform that helps users optimize their professional profiles using AI.

## Project Overview

MyResumePro is built with a microservices architecture, consisting of:

- **Frontend Service**: React-based web application with modern UI/UX
- **AI Service**: Handles AI-powered resume enhancement
- **Parser Service**: Processes and extracts data from resume documents
- **Payment Service**: Manages subscriptions and payments via Stripe
- **User Service**: Handles authentication and user management

## Features

### Recently Implemented
- Resume parsing with support for PDF and DOCX formats (max 5MB)
- AI-powered resume rewriting capabilities
- Subscription-based access with free and pro tiers
- Secure document handling with copy prevention
- Authentication and protected routes
- Responsive design with Tailwind CSS
- Page transitions using Framer Motion
- Error boundary implementation for robust error handling

### Coming Soon
- QR code generation for secure resume sharing
- LinkedIn profile integration
- Enhanced AI analysis features

## Tech Stack

### Frontend
- React 18
- React Router v6
- Tailwind CSS
- Framer Motion
- Formik & Yup for form handling
- Axios for API communication

### Backend Services
- Node.js microservices
- Docker containerization
- Kubernetes orchestration
- Stripe integration for payments

## Project Structure

```
MyResumePro/
├── docker-compose.yml
├── k8s/                    # Kubernetes configurations
├── services/
│   ├── frontend/          # React frontend application
│   ├── ai-service/        # AI processing service
│   ├── parser-service/    # Resume parsing service
│   ├── payment-service/   # Subscription & payment handling
│   └── user-service/      # Authentication & user management
```

## Environment Variables

The following environment variables are required:

### Frontend
```
REACT_APP_PARSER_SERVICE_URL
REACT_APP_AI_SERVICE_URL
REACT_APP_PAYMENT_SERVICE_URL
```

## Getting Started

1. Clone the repository
2. Install dependencies:
   ```bash
   cd services/frontend && npm install
   # Repeat for other services
   ```
3. Start the development servers:
   ```bash
   docker-compose up
   ```

## API Services

### Parser Service
- `POST /api/parser/parse-resume`: Parse uploaded resume documents
- Supports PDF and DOCX formats
- File size limit: 5MB

### AI Service
- `POST /api/ai/rewrite-profile`: AI-powered resume enhancement

### Payment Service
- `GET /api/payment/subscription`: Get subscription status
- `POST /api/payment/create-subscription`: Create new subscription

## Security Features

- JWT-based authentication
- Protected routes
- Copy prevention for parsed data
- Secure file handling
- Environment variable validation

## Contributing

1. Fork the repository
2. Create your feature branch
3. Commit your changes
4. Push to the branch
5. Create a new Pull Request

## License

This project is proprietary and confidential.
