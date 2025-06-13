import { withAuth } from "next-auth/middleware";

export default withAuth(
  function middleware(req) {
    // Add any additional middleware logic here
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        // Protect admin routes
        if (req.nextUrl.pathname.startsWith('/admin')) {
          return token?.role === 'admin';
        }
          // Protect employer routes
        if (req.nextUrl.pathname.startsWith('/employer') || 
            req.nextUrl.pathname.startsWith('/hire')) {
          return token?.role === 'employer';
        }
        
        // Protect job seeker routes
        if (req.nextUrl.pathname.startsWith('/jobseeker')) {
          return token?.role === 'user';
        }
          // Protect dashboard and other authenticated routes
        if (req.nextUrl.pathname.startsWith('/dashboard') || 
            req.nextUrl.pathname.startsWith('/profile')) {
          return !!token;
        }        // Allow authenticated users to access role selection and questionnaires
        if (req.nextUrl.pathname.startsWith('/auth/select-role') ||
            req.nextUrl.pathname.startsWith('/auth/questionnaire') ||
            req.nextUrl.pathname.startsWith('/auth/employer-questionnaire')) {
          return !!token;
        }
        
        return true;
      },
    },
  }
);

export const config = {
  matcher: ['/dashboard/:path*', '/profile/:path*', '/admin/:path*', '/employer/:path*', '/hire/:path*', '/jobseeker/:path*', '/auth/select-role', '/auth/questionnaire', '/auth/employer-questionnaire']
};
