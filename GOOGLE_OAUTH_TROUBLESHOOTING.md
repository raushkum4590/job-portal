# Google OAuth Setup Guide for JobForge

## Google Cloud Console Configuration

### 1. Create a New Project (if needed)
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Name it something like "JobForge" or "Job Portal"

### 2. Enable Google+ API
1. In the Google Cloud Console, go to "APIs & Services" > "Library"
2. Search for "Google+ API" and enable it
3. Also enable "Google OAuth2 API" if available

### 3. Configure OAuth Consent Screen
1. Go to "APIs & Services" > "OAuth consent screen"
2. Choose "External" user type
3. Fill in the required information:
   - App name: JobForge
   - User support email: your email
   - Developer contact information: your email
4. Add scopes:
   - `../auth/userinfo.email`
   - `../auth/userinfo.profile`
   - `openid`
5. Add test users (your email addresses for testing)

### 4. Create OAuth 2.0 Credentials
1. Go to "APIs & Services" > "Credentials"
2. Click "Create Credentials" > "OAuth 2.0 Client ID"
3. Choose "Web application"
4. Add these Authorized redirect URIs:
   ```
   http://localhost:3000/api/auth/callback/google
   https://yourdomain.com/api/auth/callback/google (for production)
   ```
5. Copy the Client ID and Client Secret

### 5. Update Environment Variables
Add these to your `.env.local` file:
```
GOOGLE_CLIENT_ID=your_client_id_here
GOOGLE_CLIENT_SECRET=your_client_secret_here
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_secret_here
```

## Common Issues and Solutions

### Error: "redirect_uri_mismatch"
- Make sure the redirect URI in Google Cloud Console exactly matches: `http://localhost:3000/api/auth/callback/google`
- No trailing slashes
- Make sure the protocol is `http` for localhost

### Error: "access_blocked"
- Your app is in testing mode and the user is not added as a test user
- Add the user's email to test users in OAuth consent screen

### Error: "unauthorized_client"
- The OAuth client ID is incorrect
- The OAuth client secret is incorrect
- The client ID doesn't match the one in your environment variables

### Error: "invalid_request"
- Check that all required environment variables are set
- Restart your development server after changing environment variables

## Testing OAuth Flow

1. Start your development server: `npm run dev`
2. Go to `http://localhost:3000/auth/signin`
3. Click "Sign in with Google"
4. Complete the OAuth flow
5. You should be redirected to the dashboard

## Production Deployment

When deploying to production:
1. Add your production domain to authorized redirect URIs
2. Update `NEXTAUTH_URL` to your production URL
3. Make sure to verify your domain in Google Cloud Console if required

## Troubleshooting

If you're still having issues:
1. Check the browser developer console for errors
2. Check your server logs for NextAuth debug information
3. Verify all environment variables are correctly set
4. Make sure your Google Cloud project has the necessary APIs enabled
5. Ensure your OAuth consent screen is properly configured

## Security Notes

- Never commit your `.env.local` file to version control
- Use strong, unique secrets for `NEXTAUTH_SECRET`
- In production, use HTTPS and update redirect URIs accordingly
- Regularly rotate your OAuth secrets
