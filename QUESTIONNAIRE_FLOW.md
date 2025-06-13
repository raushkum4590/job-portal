# Job Seeker Questionnaire Flow Implementation

## Overview
After authentication, job seekers are prompted to complete a questionnaire about their experience level and field of interest before accessing their dashboard.

## Flow Sequence

### For New Users:
1. **Sign Up/Sign In** → **Questionnaire** → **Job Seeker Dashboard**

### For Existing Users:
1. **Sign In** → Check `jobSeekerProfile.profileCompleted` 
   - If `true`: **Job Seeker Dashboard**
   - If `false` or `null`: **Questionnaire**

### For New Google OAuth Users:
1. **Google Sign In** → **Role Selection** → **Questionnaire** (if job seeker) → **Job Seeker Dashboard**

## Implementation Details

### 1. Database Schema (User Model)
```javascript
jobSeekerProfile: {
  experienceLevel: {
    type: String,
    enum: ['student', 'fresher', 'experienced'],
    default: null,
  },
  fieldOfInterest: {
    type: String,
    enum: ['software-development', 'data-science', 'digital-marketing', ...],
    default: null,
  },
  profileCompleted: {
    type: Boolean,
    default: false,
  },
}
```

### 2. API Endpoints
- **POST `/api/user/complete-profile`**: Saves questionnaire responses
- **GET `/api/user/me`**: Returns user data including jobSeekerProfile

### 3. Pages Created
- **`/auth/questionnaire`**: Questionnaire form with experience level and field selection
- **Updated `/jobseeker`**: Dashboard showing profile preferences

### 4. Middleware Protection
- Added `/auth/questionnaire` to protected routes

### 5. Redirect Logic Updates
- **Sign-in page**: Checks profile completion for job seekers
- **Sign-up page**: Checks profile completion for job seekers  
- **Role selection**: Redirects job seekers to questionnaire

## Questionnaire Questions

### Experience Level:
- **Student**: Currently pursuing education
- **Fresher**: Recently graduated, looking for first job
- **Experienced**: Have work experience in my field

### Field of Interest:
- Software Development
- Data Science & Analytics
- Digital Marketing
- Design (UI/UX/Graphic)
- Finance & Accounting
- Sales & Business Development
- Human Resources
- Operations & Management
- Consulting
- Healthcare
- Education & Training
- Other

## User Experience
1. Clean, modern UI matching the app's design system
2. Progress tracking and validation
3. Skip option available (still redirects to dashboard)
4. Profile update option in dashboard
5. Warning message if profile incomplete

## Security & Validation
- Server-side validation of enum values
- Role-based access control (job seekers only)
- Required field validation
- Protected routes via middleware

## Testing Scenarios
1. New job seeker registration → questionnaire → dashboard
2. Existing job seeker (incomplete profile) → questionnaire → dashboard
3. Existing job seeker (complete profile) → dashboard directly
4. Google OAuth new user → role selection → questionnaire → dashboard
5. Skip questionnaire → dashboard with incomplete profile warning

## Future Enhancements
- Skill assessment questions
- Career goals and preferences
- Location preferences
- Salary expectations
- Job type preferences (remote, on-site, hybrid)
