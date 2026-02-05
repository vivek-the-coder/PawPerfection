import 'dotenv/config';
import express, { json, urlencoded } from 'express';
const app = express();
import cors from 'cors';
import cookieParser from 'cookie-parser';
import session from 'express-session';
import passport from './utils/passport.js';
import prisma from './db/prisma.js';
import helmet from 'helmet';

// Redis 
import redisClient from "./caches/redis.js";
import { authRateLimiter, paymentRateLimiter } from './caches/rate-limitter.js';


import userRoutes from './routes/userRoutes.js';
import petRoutes from './routes/petRoute.js';
import trainingRoutes from './routes/trainingRoutes.js';
import feedBackRoutes from './routes/feedBack.js';
import paymentRoutes from './routes/paymentRoutes.js';
import webhookRoutes from './webhook/stripe.webhook.js';
import emailTestRoutes from './routes/emailTest.js';


// Check if DATABASE_URL is defined
if (!process.env.DATABASE_URL) {
    console.error('DATABASE_URL is not defined in environment variables');
    process.exit(1);
}

// Check if JWT_SECRET is defined
if (!process.env.JWT_SECRET) {
    console.error('JWT_SECRET is not defined in environment variables');
    process.exit(1);
}

// Check if SESSION_SECRET is defined
if (!process.env.SESSION_SECRET) {
    console.warn('SESSION_SECRET is not defined, using JWT_SECRET for session (not recommended for production)');
}

// Check if email configuration is defined
if (!process.env.SMTP_EMAIL || !process.env.SMTP_PASSWORD) {
    console.warn('SMTP_EMAIL or SMTP_PASSWORD is not defined - email functionality will not work');
}

// Mount webhook BEFORE body parsers to preserve raw body for signature verification
app.use('/api/webhook', webhookRoutes);

// Debug logging middleware
app.use((req, res, next) => {
    console.log(`[REQUEST] ${req.method} ${req.url}`);
    next();
});

app.use(json());
app.use(helmet());
app.use(urlencoded({ extended: true }));
const corsOptions = {
    origin: process.env.FRONTEND_URL || 'http://localhost:5173',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
};
app.use(cors(corsOptions));
app.use(cookieParser());

// Session configuration
app.use(session({
    secret: process.env.SESSION_SECRET || process.env.JWT_SECRET,
    resave: false,
    saveUninitialized: false,
    cookie: {
        secure: process.env.NODE_ENV === 'production',
        httpOnly: true,
        maxAge: 24 * 60 * 60 * 1000 // 24 hours
    }
}));

// Initialize passport
app.use(passport.initialize());
app.use(passport.session());

// Rate Limiting
app.set("trust proxy", 1);
app.use(authRateLimiter);
app.use(paymentRateLimiter);

app.get("/", (req, res) => {
    res.send("Hello World!!!");
})
// Apply rate limiters to specific routes
app.use('/api/auth/login', authRateLimiter);
app.use('/api/auth/register', authRateLimiter);

// Mount routes
app.use('/api/auth', userRoutes);
app.use('/api/pet', petRoutes);
app.use('/api/training', trainingRoutes);
app.use('/api/feedback', feedBackRoutes);
app.use('/api/payment', paymentRateLimiter, paymentRoutes);
app.use('/api/email-test', emailTestRoutes);

const PORT = process.env.PORT || 3000;

// Export app for Vercel
export default app;

// Only start server if running directly (not in Vercel)
if (process.env.NODE_ENV !== 'production' || process.env.VERCEL !== '1') {
    StartServer();
}

async function StartServer() {
    try {
        // Connect to Redis only if URL is provided
        if (process.env.REDIS_URL) {
            await redisClient.connect().catch(err => console.warn("Redis connection failed", err));
        }

        // Connect to Database (Prisma)
        try {
            await prisma.$connect();
            console.log("Connected to Database");
        } catch (dbError) {
            console.error("Database connection failed", dbError);
            process.exit(1);
        }

        app.listen(PORT, () => {
            console.log(`Server is running on port http://localhost:${PORT}`);
        });

    }
    catch (error) {
        console.error("Server start error", error)
        try { await prisma.$disconnect(); } catch (e) { }
    }
}
