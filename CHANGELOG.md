# Changelog

All notable changes to MyResumePro will be documented in this file.

## [Unreleased]

### Added

- Manual profile entry form with multi-step validation
- Resume upload and parsing functionality
- LinkedIn profile import option
- Profile preview and editing capabilities
- Auto-save functionality for form drafts
- Token-based authentication with expiry
- Form completion progress tracking
- Responsive UI with Tailwind CSS
- Form validation using Formik and Yup
- Error boundary implementation
- Service health monitoring

### Changed

- Updated authentication flow with token expiry
- Improved form validation feedback
- Enhanced mobile responsiveness

### Fixed

- Fixed date validation in experience and education sections
- Enhanced form validation with clearer error messages
- Added character count indicators for text fields
- Improved validation UX with loading states
- Made form navigation sticky for better usability
- Fixed conditional validation for current job end dates
- Token expiration handling
- Form data persistence issues
- Cross-origin resource sharing (CORS) configuration
- Removed unused 'user' variable in Dashboard component
- Fixed duplicate handleSubmit declaration in ManualSignup component
- Enhanced AuthContext with proper token expiration and error handling
- Added environment variables configuration for service URLs
- Implemented Sentry error logging service in ErrorBoundary component
- Removed unused useEffect import from LinkedInSignup component
- Added Sentry initialization and configuration
- Modified Sentry initialization to be conditional based on valid DSN configuration

### Browser Check Results (2024-02-06)

- Frontend successfully runs on port 3006
- UI renders correctly with proper styling and layout
- React Router warnings present regarding future v7 changes (non-critical)
- Service connectivity requires running backend services:
  * User Service (port 3000)
  * Parser Service (port 3001)
  * AI Service (port 3002)
  * Payment Service (port 3003)

### Technical Debt & Known Issues

- Environment variables need to be properly configured in production (including Sentry DSN)
- QR code generation feature in Dashboard is pending implementation

## [0.1.0] - 2024-02-XX

### Initial Release

- Basic user authentication
- Profile creation functionality
- Resume parsing service
- AI-powered profile optimization
- Payment integration for premium features
