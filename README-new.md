# Job Portal with MongoDB Authentication

A modern job portal application built with Next.js, MongoDB, and NextAuth.js featuring secure authentication and user management.

## Features

- 🔐 **Secure Authentication** - JWT-based authentication with NextAuth.js
- 👥 **Multi-Role Support** - User, Employer, and Admin roles
- 📱 **Responsive Design** - Mobile-first design with Tailwind CSS
- 🛡️ **Protected Routes** - Middleware-based route protection
- 📊 **User Profiles** - Complete profile management system
- 🔒 **Password Security** - bcrypt password hashing
- 🗄️ **MongoDB Integration** - Mongoose ODM for database operations

## Tech Stack

- **Frontend**: Next.js 15, React 19, Tailwind CSS
- **Backend**: Next.js API Routes
- **Database**: MongoDB with Mongoose
- **Authentication**: NextAuth.js
- **Security**: bcryptjs, JWT tokens

## Quick Start

### Prerequisites

- Node.js 18+ 
- MongoDB (local or Atlas)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd job-portal
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   
   Copy `.env.local` and update the values:
   ```bash
   # MongoDB Connection
   MONGODB_URI=mongodb://localhost:27017/job-portal
   # For MongoDB Atlas: mongodb+srv://<username>:<password>@<cluster>.mongodb.net/<database>
   
   # NextAuth Configuration  
   NEXTAUTH_SECRET=your-nextauth-secret-key-here
   NEXTAUTH_URL=http://localhost:3000
   
   # JWT Secret
   JWT_SECRET=your-jwt-secret-key-here
   ```

4. **Start MongoDB** (if using local installation)
   ```bash
   mongod
   ```

5. **Run the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## Authentication System

### User Registration
- Navigate to `/auth/signup`
- Choose role: Job Seeker or Employer
- Complete registration form
- Passwords are automatically hashed with bcrypt

### User Login
- Navigate to `/auth/signin`
- Use email and password
- Automatic role-based redirection after login

### Protected Routes
- `/dashboard` - User dashboard (all authenticated users)
- `/profile` - User profile management
- `/admin/*` - Admin-only routes
- `/employer/*` - Employer-only routes

## User Roles

### Job Seeker (user)
- Create and manage profile
- Browse job listings
- Apply for positions
- Track applications

### Employer
- Post job openings
- Manage job listings
- Review applications
- Manage company profile

### Admin
- User management
- System administration
- Analytics and reporting

## Database Schema

### User Model
```javascript
{
  name: String,
  email: String (unique),
  password: String (hashed),
  role: ['user', 'employer', 'admin'],
  profile: {
    bio: String,
    skills: [String],
    experience: String,
    education: String,
    resume: String,
    phone: String,
    location: String
  },
  isVerified: Boolean,
  avatar: String,
  timestamps: true
}
```

## API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/[...nextauth]` - NextAuth.js endpoints

### User Management
- `GET /api/user/profile` - Get user profile
- `PUT /api/user/profile` - Update user profile

## Security Features

- **Password Hashing**: bcrypt with salt rounds
- **JWT Tokens**: Secure session management
- **CSRF Protection**: Built-in with NextAuth.js
- **Route Protection**: Middleware-based authentication
- **Input Validation**: Server-side validation
- **Error Handling**: Secure error responses

## Development

### Project Structure
```
job-portal/
├── app/
│   ├── api/           # API routes
│   ├── auth/          # Authentication pages
│   ├── dashboard/     # Dashboard pages
│   └── profile/       # Profile management
├── components/        # Reusable components  
├── lib/              # Utility functions
├── models/           # Database models
└── middleware.js     # Route protection
```

### Adding New Features

1. **Create API Routes**: Add to `app/api/`
2. **Add Database Models**: Create in `models/`
3. **Build Components**: Add to `components/`
4. **Update Middleware**: Modify `middleware.js` for new protected routes

## Deployment

### Environment Setup
1. Set up MongoDB Atlas or production MongoDB
2. Update `MONGODB_URI` in production environment
3. Set secure `NEXTAUTH_SECRET` and `JWT_SECRET`
4. Configure `NEXTAUTH_URL` for production domain

### Deploy to Vercel
```bash
npm run build
# Deploy using Vercel CLI or GitHub integration
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.

## Support

For support and questions:
- Create an issue on GitHub
- Check the documentation
- Review the API endpoints

---

Built with ❤️ using Next.js, MongoDB, and modern web technologies.
