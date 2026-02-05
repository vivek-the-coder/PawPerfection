# Deploying PawPerfection to Vercel

Since your project is verified locally, follow these steps to deploy it to Vercel.

## 1. Push to GitHub
Ensure your latest code, including the `vercel.json` and `package.json` changes, is committed and pushed to your GitHub repository.

## 2. Import Project in Vercel
1.  Go to your [Vercel Dashboard](https://vercel.com/dashboard).
2.  Click **"Add New..."** -> **"Project"**.
3.  Import your **PawPerfection** repository.

## 3. Configure Project Settings
Vercel should detect the configuration from `vercel.json`, but verify:
- **Framework Preset**: Other (or Vite)
- **Root Directory**: `.` (Leave as root)

*Note: The `vercel.json` file in your root directory handles the build configuration for both Backend and Frontend.*

## 4. Environment Variables (Critical)
You must add the following environment variables in the Vercel Project Settings > **Environment Variables** section.

### Backend Variables
| Variable Name | Value (Example/Source) |
| :--- | :--- |
| `DATABASE_URL` | Your Supabase URL (from `.env`) |
| `JWT_SECRET` | Your secure secret (e.g., `paw_secure_token...`) |
| `SESSION_SECRET` | Your session secret |
| `STRIPE_SECRET_KEY` | `sk_test_...` (from `.env`) |
| `SMTP_EMAIL` | Your email (optional if using placeholder) |
| `SMTP_PASSWORD` | Your app password (optional) |
| `NODE_ENV` | `production` |

### Frontend Variables
| Variable Name | Value | Description |
| :--- | :--- | :--- |
| `VITE_STRIPE_PUBLISHABLE_KEY` | `pk_test_...` (from `.env`) | Visible to browser |
| `VITE_API_URL` | `/api` | **IMPORTANT**: Set this to `/api` so requests go to your Vercel backend. |

## 5. Deploy
1.  Click **"Deploy"**.
2.  Vercel will build the frontend (`vite build`) and prepare the backend serverless functions.
3.  Once finished, your app will be live at `https://your-project.vercel.app`.

## 6. Post-Deployment Verification
- **Visit the URL**: `https://your-project.vercel.app`
- **Check Paths**:
    - Frontend: `/courses`
    - Backend API: `/api/health` or `/api/training/courses`
- **Test Signup**: Register a new user to verify DB connection.
- **Test Payment**: Try enrolling in a course to verify Stripe keys.

## Troubleshooting
- **500 Error on Signup**: Check Vercel **Logs** tab. It usually means `DATABASE_URL` is missing or `prisma generate` didn't run (we added the `postinstall` script to fix this).
- **Network Error**: Ensure `VITE_API_URL` is set to `/api`.
