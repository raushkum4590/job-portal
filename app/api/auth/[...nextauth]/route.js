import NextAuth from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import GoogleProvider from 'next-auth/providers/google';
import connectDB from '@/lib/mongodb';
import User from '@/models/User';

const authOptions = {
  providers: [    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      authorization: {
        params: {
          prompt: "consent",
          access_type: "offline",
          response_type: "code",
          scope: "openid email profile"
        }
      },
      httpOptions: {
        timeout: 40000,
      }
    }),
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null;
        }

        try {
          await connectDB();
          
          const user = await User.findOne({ email: credentials.email }).select('+password');
          
          if (!user) {
            return null;
          }          const isPasswordValid = await user.comparePassword(credentials.password);
          
          if (!isPasswordValid) {
            return null;
          }          // Check if this is first login and send welcome email if needed
          if (!user.welcomeEmailSent) {
            console.log('🎉 First-time credentials login, sending welcome email to:', user.email);
            sendWelcomeEmail(user.email, {
              name: user.name,
              updateUser: true
            }).then(result => {
              console.log('✅ First-time login welcome email result:', result);
            }).catch(error => {
              console.error('❌ Error sending welcome email for first login:', error);
            });
          }

          return {
            id: user._id.toString(),
            email: user.email,
            name: user.name,
            role: user.role,
          };
        } catch (error) {
          console.error('Auth error:', error);
          return null;
        }
      }
    })
  ],  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  cookies: {
    sessionToken: {
      name: process.env.NODE_ENV === 'production' ? '__Secure-next-auth.session-token' : 'next-auth.session-token',
      options: {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        secure: process.env.NODE_ENV === 'production'
      }
    },
    callbackUrl: {
      name: process.env.NODE_ENV === 'production' ? '__Secure-next-auth.callback-url' : 'next-auth.callback-url',
      options: {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        secure: process.env.NODE_ENV === 'production'
      }
    },
    csrfToken: {
      name: process.env.NODE_ENV === 'production' ? '__Host-next-auth.csrf-token' : 'next-auth.csrf-token',
      options: {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        secure: process.env.NODE_ENV === 'production'
      }
    },
    pkceCodeVerifier: {
      name: process.env.NODE_ENV === 'production' ? '__Secure-next-auth.pkce.code_verifier' : 'next-auth.pkce.code_verifier',
      options: {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        secure: process.env.NODE_ENV === 'production',
        maxAge: 15 * 60 // 15 minutes
      }
    },
    state: {
      name: process.env.NODE_ENV === 'production' ? '__Secure-next-auth.state' : 'next-auth.state',
      options: {
        httpOnly: true,
        sameSite: 'lax',
        path: '/',
        secure: process.env.NODE_ENV === 'production',
        maxAge: 15 * 60 // 15 minutes
      }
    }
  },
  useSecureCookies: process.env.NODE_ENV === 'production',
  events: {
    async linkAccount({ user, account, profile }) {
      // Handle account linking events
      console.log('Account linked:', { user: user.email, provider: account.provider });
    },
  },
  callbacks: {
    async signIn({ user, account, profile }) {
      if (account?.provider === 'google') {
        try {
          await connectDB();
          
          // Check if user already exists with this email
          let existingUser = await User.findOne({ email: user.email });
          
          if (existingUser) {
            // User exists with email/password, link Google account
            if (existingUser.password !== 'google-oauth') {
              // Update existing user to support both auth methods
              existingUser.oauth = {
                google: {
                  id: profile.sub,
                  email: profile.email,
                }
              };
              existingUser.avatar = existingUser.avatar || user.image || '';
              existingUser.isVerified = true;
              await existingUser.save();
            }
              // Use existing user data
            user.role = existingUser.role;
            user.id = existingUser._id.toString();
            user.isNewUser = false;            // Check if this is first Google login for existing user
            if (!existingUser.oauth?.google && existingUser.password !== 'google-oauth' && !existingUser.welcomeEmailSent) {
              console.log('🎉 First-time Google login, sending welcome email to:', user.email);
              // Send welcome email for first-time Google login
              sendWelcomeEmail(user.email, {
                name: user.name,
                updateUser: true
              }).then(result => {
                console.log('✅ First-time Google login welcome email result:', result);
              }).catch(error => {
                console.error('❌ Error sending first-time Google login email:', error);
              });
            }
          } else {
            // Create new user for Google sign-in with default 'user' role
            // They will be redirected to role selection page
            const newUser = new User({
              name: user.name,
              email: user.email,
              role: 'user', // Default role, will be updated after role selection
              isVerified: true,
              avatar: user.image || '',
              password: 'google-oauth',
              oauth: {
                google: {
                  id: profile.sub,
                  email: profile.email,
                }
              }
            });
              await newUser.save();
            user.role = 'user'; // Ensure role is 'user' for new users
            user.id = newUser._id.toString();
            user.isNewUser = true; // Flag to identify new users who need role selection            // Send welcome email for new OAuth users (don't block sign-in)
            console.log('🎉 New Google user registered, sending welcome email to:', user.email);
            sendWelcomeEmail(user.email, {
              name: user.name,
              updateUser: true
            }).then(result => {
              console.log('✅ New Google user welcome email result:', result);
            }).catch(error => {
              console.error('❌ Error sending welcome email for OAuth user:', error);
            });
          }
          
        } catch (error) {
          console.error('Google sign-in error:', error);
          return false;
        }
      }
      return true;
    },    async jwt({ token, user, account }) {
      if (user) {
        token.role = user.role || 'user';
        token.isNewUser = user.isNewUser || false;
      }
      
      // For Google users, check if they need role selection
      if (account?.provider === 'google' && token.email) {
        try {
          await connectDB();
          const dbUser = await User.findOne({ email: token.email });
          if (dbUser) {
            token.role = dbUser.role;
            // Check if user has default 'user' role (needs role selection)
            token.isNewUser = dbUser.role === 'user' && !dbUser.jobSeekerProfile?.profileCompleted && !dbUser.employerProfile?.profileCompleted;
          }
        } catch (error) {
          console.error('JWT callback error:', error);
        }
      }
      
      return token;
    },    async session({ session, token }) {
      if (token) {
        session.user.id = token.sub;
        session.user.role = token.role || 'user';
        session.user.isNewUser = token.isNewUser || false;
      }
      return session;
    },    async redirect({ url, baseUrl, token }) {
      // Handle redirects after sign-in
      if (url.startsWith('/') || url.startsWith(baseUrl)) {
        return url;
      }
      
      // For OAuth sign-ins, redirect to dashboard which will handle role-based routing
      return `${baseUrl}/dashboard`;
    },
  },  pages: {
    signIn: '/auth/signin',
    signUp: '/auth/signup',
    error: '/auth/error', // Custom error page
  },
  debug: process.env.NODE_ENV === 'development', // Enable debug in development
  logger: {
    error(code, metadata) {
      console.error('NextAuth Error:', code, metadata);
    },
    warn(code) {
      console.warn('NextAuth Warning:', code);
    },
    debug(code, metadata) {
      if (process.env.NODE_ENV === 'development') {
        console.log('NextAuth Debug:', code, metadata);
      }
    }
  },
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);

export { handler as GET, handler as POST, authOptions };
