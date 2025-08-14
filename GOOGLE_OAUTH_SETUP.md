# Google OAuth 2.0 Setup Guide

## Environment Variables Required

Add these variables to your `server/.env` file:

```env
# Google OAuth 2.0
GOOGLE_CLIENT_ID=your-google-client-id-here
GOOGLE_CLIENT_SECRET=your-google-client-secret-here

# Client URL (for OAuth redirects)
CLIENT_URL=http://localhost:3000
```

**Note:** No `SESSION_SECRET` is needed since we're using JWT authentication.

## Google Cloud Console Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the Google+ API
4. Go to "Credentials" → "Create Credentials" → "OAuth 2.0 Client IDs"
5. Choose "Web application"
6. Add authorized redirect URIs:
   - `http://localhost:8000/api/auth/google/callback` (for development)
   - `https://yourdomain.com/api/auth/google/callback` (for production)
7. Copy the Client ID and Client Secret to your `.env` file

## Features Added

- ✅ Google Sign-In button on Login page
- ✅ Google Sign-In button on Register page
- ✅ OAuth callback handling
- ✅ Automatic user creation/linking for Google users
- ✅ JWT-based authentication (no sessions)
- ✅ Responsive Google button design

## How It Works

1. User clicks "Continue with Google" button
2. Redirects to Google OAuth consent screen
3. User authorizes the application
4. Google redirects back to `/api/auth/google/callback`
5. Server creates/updates user and generates JWT token
6. User is redirected to `/auth-callback` with token data
7. Client stores token and redirects to dashboard

## Security Features

- **JWT-based authentication** - Stateless, no server-side sessions
- Password is optional for Google OAuth users
- Existing accounts are linked if email matches
- Secure token generation and validation
- CORS configuration for secure cross-origin requests

## Architecture Benefits

- **Stateless**: No server-side session storage needed
- **Scalable**: JWT tokens work across multiple server instances
- **Efficient**: No database queries for session validation
- **Secure**: Tokens are signed and can include expiration times
