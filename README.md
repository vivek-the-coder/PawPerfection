# 🐾 PawPerfection

<p align="center">
  <strong>A modern, intelligent pet training system to help your furry friends reach their full potential</strong>
</p>

<p align="center">
  <img src="https://images.pexels.com/photos/406014/pexels-photo-406014.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=2" alt="PawPerfection" width="600" />
</p>

## 📋 Overview

PawPerfection is a comprehensive pet training solution designed to help pet owners train their furry companions effectively and efficiently. Using a combination of positive reinforcement techniques, behavioral science, and smart technology, PawPerfection makes pet training accessible, enjoyable, and successful for pets of all ages and breeds.

Whether you're a first-time pet parent or an experienced trainer, PawPerfection provides customized training programs, progress tracking, and expert guidance to address various behavioral challenges and teach new skills.

## ✨ Features

### 🔐 Authentication & User Management

- **JWT Authentication**: Secure authentication with access and refresh tokens
- **Google OAuth 2.0**: Sign in with Google for seamless authentication
- **Email Notifications**: Automated login notifications with device and location tracking
- **Session Management**: Secure session handling with Passport.js
- **Password Security**: Bcrypt-based password hashing for enhanced security

### 🐕 Pet Management

- **Pet Profiles**: Create, update, and manage detailed pet profiles
- **Multi-Pet Support**: Manage multiple pets from a single account
- **Pet Information**: Track breed, age, behavior, and training progress

### 📚 Training Programs

- **Training Courses**: Access structured training programs for various skills
- **Course Content**: Detailed lessons and exercises for pet training
- **Progress Tracking**: Monitor your pet's development and achievements

### 💳 Payment Integration

- **Stripe Integration**: Secure payment processing for premium courses
- **Webhook Support**: Real-time payment status updates
- **Payment Success/Cancel Handling**: User-friendly payment flow with status pages

### 💬 Feedback System

- **User Feedback**: Submit feedback and suggestions
- **Feedback Management**: Track and manage user feedback

### 🛡️ Security & Performance

- **Rate Limiting**: Redis-based rate limiting for authentication and payment endpoints
- **Security Headers**: Helmet.js for enhanced security
- **Input Validation**: Zod schema validation for all user inputs
- **CORS Protection**: Configured CORS for secure cross-origin requests

## 🛠️ Technologies Used

### Backend

- **Runtime**: Node.js with Express.js 5.1.0
- **Database**: MongoDB with Mongoose ODM
- **Caching**: Redis 7 for caching and rate limiting
- **Authentication**: 
  - JWT (jsonwebtoken) for access and refresh tokens
  - Passport.js with Google OAuth 2.0 strategy
- **Payment**: Stripe for payment processing
- **Email**: Nodemailer for email notifications
- **Security**: 
  - Helmet for security headers
  - Bcrypt for password hashing
  - express-rate-limit with Redis store
- **Validation**: Zod for schema validation
- **Session**: express-session with cookie-parser

### Frontend

- **Framework**: React 19.0.0
- **Build Tool**: Vite 6.3.1
- **State Management**: Redux Toolkit with Redux Persist
- **Routing**: React Router DOM 7.5.3
- **Styling**: Tailwind CSS 4.1.4
- **HTTP Client**: Axios 1.9.0
- **UI Components**: 
  - Lucide React for icons
  - React Hot Toast for notifications
  - Lottie animations (@lottiefiles/dotlottie-react)

### DevOps & Deployment

- **Containerization**: Docker with Docker Compose
- **Orchestration**: Kubernetes
- **Caching Layer**: Redis 7 Alpine

## 🚀 Installation

### Prerequisites

- Node.js (v18 or higher)
- MongoDB (local or MongoDB Atlas)
- Redis (for caching and rate limiting)
- Docker & Docker Compose (optional, for containerized deployment)

### Backend Setup

```bash
# Navigate to the Backend directory
cd Backend

# Install dependencies
npm install

# Create .env file with required variables (see Environment Variables section)
cp .env.example .env

# Start the development server
npm run dev
```

### Frontend Setup

```bash
# Navigate to the Frontend/client directory
cd Frontend/client

# Install dependencies
npm install

# Create .env file with required variables
cp .env.example .env

# Start the development server
npm run dev
```

### Docker Compose Deployment

```bash
# From the project root directory
docker-compose up -d

# This will start:
# - Redis on port 6379
# - Backend on port 3000
# - Frontend on port 5173
```

# Apply Kubernetes deployment
Working on it.....

# Check deployment status
kubectl get deployments
kubectl get pods

## 🔧 Environment Variables

### Backend (.env)

```env
# Server
PORT=3000
NODE_ENV=development

# Database
MONGODB_URI=mongodb://localhost:27017/pawperfection

# JWT
JWT_SECRET=your_jwt_secret_key
JWT_REFRESH_SECRET=your_refresh_secret_key
SESSION_SECRET=your_session_secret

# Google OAuth
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_CALLBACK_URL=http://localhost:3000/api/auth/google/callback

# Stripe
STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret

# Email (SMTP)
SMTP_EMAIL=your_email@gmail.com
SMTP_PASSWORD=your_app_password

# Frontend URL
FRONTEND_URL=http://localhost:5173

# Redis
REDIS_URL=redis://localhost:6379
```

### Frontend (.env)

```env
VITE_API_URL=http://localhost:3000
VITE_STRIPE_PUBLIC_KEY=your_stripe_public_key
```

## 📁 Project Structure

```
PawPerfection/
├── Backend/                 # Express.js API server
│   ├── controllers/        # Route controllers
│   ├── models/            # Mongoose models
│   ├── routes/            # API routes
│   ├── middleware/        # Custom middleware
│   ├── utils/             # Utility functions
│   ├── validations/       # Zod validation schemas
│   ├── caches/            # Redis configuration
│   ├── webhook/           # Stripe webhook handlers
│   └── index.js           # Server entry point
├── Frontend/client/        # React application
│   ├── src/
│   │   ├── components/    # React components
│   │   ├── pages/         # Page components
│   │   ├── features/      # Redux slices
│   │   └── utils/         # Utility functions
│   └── public/            # Static assets
├── k8s/                   # Kubernetes deployment files
├── docker-compose.yaml    # Docker Compose configuration
└── README.md             # This file
```

## 🌐 API Endpoints

### Authentication

- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login with email and password
- `POST /api/auth/logout` - Logout user
- `POST /api/auth/refresh` - Refresh access token
- `GET /api/auth/profile` - Get user profile
- `GET /api/auth/google` - Initiate Google OAuth
- `GET /api/auth/google/callback` - Google OAuth callback

### Pet Management

- `GET /api/pet` - Get all pets for the authenticated user
- `POST /api/pet` - Create a new pet profile
- `PUT /api/pet/:id` - Update pet profile
- `DELETE /api/pet/:id` - Delete pet profile

### Training Programs

- `GET /api/training` - Get all training programs
- `GET /api/training/:id` - Get specific training program
- `POST /api/training` - Create training program (admin)

### Payment

- `POST /api/payment/create-checkout-session` - Create Stripe checkout session
- `POST /api/webhook/stripe` - Stripe webhook handler

### Feedback

- `POST /api/feedback` - Submit feedback
- `GET /api/feedback` - Get all feedback (admin)

## 🤝 Contributing

We welcome contributions to PawPerfection! Please follow these steps to contribute:

1. Fork the repository
2. Create a new branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Commit your changes (`git commit -m 'Add some amazing feature'`)
5. Push to the branch (`git push origin feature/amazing-feature`)
6. Open a Pull Request

## 👥 Team

- **Sachin Singh** - _Project Lead_ - [GitHub](https://github.com/sachinggsingh)

## 📞 Contact

- **GitHub**: [sachinggsingh/PawPerfection](https://github.com/sachinggsingh/PawPerfection)
- **Email**: support@pawperfection.com

## 🙏 Acknowledgements

- [Stripe](https://stripe.com) for payment processing
- [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) for database hosting
- [Redis](https://redis.io) for caching and rate limiting
- All the furry friends who inspire this project!

---

<p align="center">Made with ❤️ for pets and their humans</p>

