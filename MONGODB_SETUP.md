# Quick MongoDB Atlas Setup Guide

## Issue: Authentication Failed Error

Your current error suggests the MongoDB Atlas credentials are incorrect. Here's how to fix it:

### Step 1: Verify MongoDB Atlas Credentials

1. **Login to MongoDB Atlas**: https://cloud.mongodb.com/
2. **Go to your Cluster** (Cluster0)
3. **Click "Connect"** → **"Connect your application"**
4. **Copy the exact connection string** provided by Atlas

### Step 2: Check Database User

1. **Go to "Database Access"** in your Atlas dashboard
2. **Find user "3570kumarraushan"** 
3. **Click "Edit"** 
4. **Reset the password** or verify it's correct
5. **Make sure user has "readWriteAnyDatabase" permission**

### Step 3: Check Network Access

1. **Go to "Network Access"** in Atlas
2. **Make sure your IP is whitelisted** or add `0.0.0.0/0` for testing
3. **Save changes**

### Step 4: Update Connection String

The connection string should look like this:
```
mongodb+srv://USERNAME:PASSWORD@cluster0.yjoknqo.mongodb.net/DATABASE_NAME?retryWrites=true&w=majority
```

### Step 5: Test the Connection

1. Visit: http://localhost:3000/test-db
2. Click "Test Database Connection"
3. If it fails, try the local MongoDB option below

### Alternative: Use Local MongoDB

If you want to test locally:

1. Install MongoDB locally: https://www.mongodb.com/try/download/community
2. Start MongoDB service
3. Update .env.local to use local connection:
   ```
   MONGODB_URI=mongodb://localhost:27017/job-portal
   ```

### Common Password Issues

If your password contains special characters, they need to be URL encoded:
- `@` becomes `%40`
- `!` becomes `%21` 
- `#` becomes `%23`
- etc.

Your current password "jCsfp7wEGnW87KoM" appears to be alphanumeric, so no encoding needed.
