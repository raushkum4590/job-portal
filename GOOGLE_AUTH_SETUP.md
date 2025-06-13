# Google OAuth Setup Guide

## 🔧 Setting up Google Authentication

Follow these steps to enable Google sign-in for your job portal:

### Step 1: Create Google Cloud Project

1. **Go to Google Cloud Console**: https://console.cloud.google.com/
2. **Create a new project** or select an existing one
3. **Enable the Google+ API**:
   - Go to "APIs & Services" → "Library"
   - Search for "Google+ API" 
   - Click "Enable"

### Step 2: Create OAuth 2.0 Credentials

1. **Go to "APIs & Services" → "Credentials"**
2. **Click "Create Credentials" → "OAuth 2.0 Client IDs"**
3. **Configure OAuth consent screen** (if not done):
   - Choose "External" for testing
   - Fill in App name: "Job Portal"
   - Add your email as developer contact
   - Save and continue through all steps
4. **Create OAuth Client ID**:
   - Application type: "Web application"
   - Name: "Job Portal Web Client"
   - Authorized redirect URIs:
     - `http://localhost:3000/api/auth/callback/google` (for development)
     - `https://yourdomain.com/api/auth/callback/google` (for production)

### Step 3: Update Environment Variables

Copy the Client ID and Client Secret from Google Cloud Console and update your `.env.local`:

```bash
# Google OAuth Configuration
GOOGLE_CLIENT_ID=your-actual-google-client-id-here
GOOGLE_CLIENT_SECRET=your-actual-google-client-secret-here
```

### Step 4: Test the Integration

1. **Restart your development server**:
   ```bash
   npm run dev
   ```

2. **Visit the sign-in page**: http://localhost:3000/auth/signin

3. **Click "Sign in with Google"** and test the flow

### Step 5: Production Setup

For production deployment:

1. **Add production domain** to authorized redirect URIs in Google Cloud Console
2. **Update NEXTAUTH_URL** in production environment:
   ```bash
   NEXTAUTH_URL=https://yourdomain.com
   ```

## 🗄️ Data Storage

Google authentication data is automatically stored in MongoDB using the NextAuth MongoDB adapter:

- **User profiles** are stored in the `users` collection
- **Sessions** are stored in the `sessions` collection  
- **Accounts** (OAuth provider info) are stored in the `accounts` collection
- **Custom user data** (role, profile info) is stored in your custom `User` model

## 🔒 Security Features

- **Automatic user creation**: New Google users get a default "user" role
- **Email verification**: Google users are automatically verified
- **Role-based access**: Existing role system works with Google auth
- **Profile synchronization**: User info is synced between NextAuth and your custom User model

## 🚀 Features Added

✅ **Google Sign-In/Sign-Up buttons** on auth pages
✅ **MongoDB data persistence** for all auth data
✅ **Role-based redirection** after Google login
✅ **Profile integration** with existing user system
✅ **Security**: Proper session management and CSRF protection

## 🔧 Troubleshooting

### Common Issues:

1. **"redirect_uri_mismatch" error**:
   - Check that redirect URI in Google Console matches exactly
   - Make sure to include the `/api/auth/callback/google` path

2. **"invalid_client" error**:
   - Verify GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET are correct
   - Make sure there are no extra spaces in .env.local

3. **MongoDB connection issues**:
   - Ensure your MongoDB connection is working first
   - Test with: http://localhost:3000/test-db

4. **Users not getting proper roles**:
   - Check the signIn callback in NextAuth configuration
   - Verify User model is being updated correctly

## 📝 Next Steps

After setting up Google OAuth:

1. Test the complete authentication flow
2. Verify user data is being stored in MongoDB
3. Test role-based access and redirections
4. Configure production domain settings
5. Add additional OAuth providers if needed (GitHub, LinkedIn, etc.)

---

🎉 **Your job portal now supports Google authentication with MongoDB storage!**
