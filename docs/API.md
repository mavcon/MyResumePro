# API Documentation

## User Service (Port 3000)

### Authentication
```http
POST /api/auth/register
Content-Type: application/json

{
  "email": "string",
  "password": "string",
  "name": "string",
  "professionalProfile": {
    // Profile schema
  }
}
```

```http
POST /api/auth/login
Content-Type: application/json

{
  "email": "string",
  "password": "string"
}
```

### Profile Management
```http
GET /api/profile
Authorization: Bearer {token}
```

```http
PUT /api/profile
Authorization: Bearer {token}
Content-Type: application/json

{
  // Profile update schema
}
```

## Parser Service (Port 3001)

### Resume Parsing
```http
POST /api/parser/parse-resume
Authorization: Bearer {token}
Content-Type: multipart/form-data

Form Data:
- resume: File (PDF/DOCX, max 5MB)
```

```http
POST /api/parser/parse-text
Authorization: Bearer {token}
Content-Type: application/json

{
  "text": "string"
}
```

## AI Service (Port 3002)

### Profile Enhancement
```http
POST /api/ai/rewrite-profile
Authorization: Bearer {token}
Content-Type: application/json

{
  "profile": {
    // Profile data schema
  }
}
```

```http
POST /api/ai/generate-cover-letter
Authorization: Bearer {token}
Content-Type: application/json

{
  "jobDescription": "string",
  "profile": {
    // Profile data schema
  }
}
```

## Payment Service (Port 3003)

### Subscription Management
```http
POST /api/payment/create-subscription
Authorization: Bearer {token}
Content-Type: application/json

{
  "planId": "string"
}
```

```http
GET /api/payment/subscription
Authorization: Bearer {token}
``` 