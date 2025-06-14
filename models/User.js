import mongoose from 'mongoose';
import bcryptjs from 'bcryptjs';
import { v4 as uuidv4 } from 'uuid';

const UserSchema = new mongoose.Schema({
  uuid: {
    type: String,
    default: () => uuidv4(),
    unique: true,
  },
  name: {
    type: String,
    required: [true, 'Please provide a name'],
    maxlength: [60, 'Name cannot be more than 60 characters'],
  },
  email: {
    type: String,
    required: [true, 'Please provide an email'],
    unique: true,
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      'Please provide a valid email',
    ],
  },  password: {
    type: String,
    required: function() {
      // Password is required only for non-OAuth users
      return !this.oauth;
    },
    minlength: [6, 'Password must be at least 6 characters'],
    select: false, // Don't return password by default
  },
  oauth: {
    google: {
      id: String,
      email: String,
    }
  },
  role: {
    type: String,
    enum: ['user', 'employer', 'admin'],
    default: 'user',
  },  profile: {
    bio: String,
    skills: [String],
    experience: String,
    education: String,
    resume: String,
    phone: String,
    location: String,
  },
  // Job seeker specific fields
  jobSeekerProfile: {
    experienceLevel: {
      type: String,
      enum: ['student', 'fresher', 'experienced'],
      default: null,
    },
    fieldOfInterest: {
      type: String,
      enum: [
        'software-development',
        'data-science',
        'digital-marketing',
        'design',
        'finance',
        'sales',
        'hr',
        'operations',
        'consulting',
        'healthcare',
        'education',
        'other'
      ],
      default: null,
    },
    profileCompleted: {
      type: Boolean,
      default: false,
    },
  },  // Employer specific fields
  employerProfile: {
    // Basic Company Information
    companyName: {
      type: String,
      default: null,
    },
    companyType: {
      type: String,
      enum: [
        'software-company',
        'startup',
        'consulting',
        'finance',
        'healthcare',
        'education',
        'retail',
        'manufacturing',
        'non-profit',
        'government',
        'other'
      ],
      default: null,
    },
    companySize: {
      type: String,
      enum: ['1-10', '11-50', '51-200', '201-500', '501-1000', '1000+'],
      default: null,
    },
    companyWebsite: {
      type: String,
      default: null,
    },
    companyLocation: {
      type: String,
      default: null,
    },
    companyDescription: {
      type: String,
      default: null,
    },
    
    // Enhanced Company Details (Internshala-like)
    foundedYear: {
      type: String,
      default: null,
    },
    headquarters: {
      type: String,
      default: null,
    },
    linkedinUrl: {
      type: String,
      default: null,
    },
    twitterUrl: {
      type: String,
      default: null,
    },
    facebookUrl: {
      type: String,
      default: null,
    },
    instagramUrl: {
      type: String,
      default: null,
    },
    companyPhone: {
      type: String,
      default: null,
    },
    companyEmail: {
      type: String,
      default: null,
    },
    
    // About Company
    aboutCompany: {
      type: String,
      default: null,
    },
    mission: {
      type: String,
      default: null,
    },
    vision: {
      type: String,
      default: null,
    },
    values: {
      type: String,
      default: null,
    },
    
    // Work Culture
    workModel: {
      type: String,
      enum: ['remote', 'hybrid', 'on-site', 'flexible'],
      default: null,
    },
    workingHours: {
      type: String,
      default: null,
    },
    dressCode: {
      type: String,
      default: null,
    },
    teamSize: {
      type: String,
      default: null,
    },
    
    // Hiring Details
    hiringFor: {
      type: String,
      enum: [
        'software-development',
        'data-science',
        'digital-marketing',
        'design',
        'finance',
        'sales',
        'hr',
        'operations',
        'consulting',
        'healthcare',
        'education',
        'other'
      ],
      default: null,
    },
    experienceLevel: {
      type: String,
      enum: ['entry-level', 'mid-level', 'senior-level', 'executive', 'all-levels'],
      default: null,
    },
    salaryRange: {
      type: String,
      enum: [
        'under-30k',
        '30k-50k',
        '50k-75k',
        '75k-100k',
        '100k-150k',
        '150k-200k',
        'above-200k',
        'negotiable'
      ],
      default: null,
    },
    hiringUrgency: {
      type: String,
      enum: ['immediate', 'within-month', 'within-quarter', 'ongoing', 'planning'],
      default: null,
    },
    
    // Benefits & Perks (flexible to accommodate many benefit types)
    benefitsOffered: [{
      type: String
    }],
    
    // Company Achievements
    awards: {
      type: String,
      default: null,
    },
    certifications: {
      type: String,
      default: null,
    },
    clients: {
      type: String,
      default: null,
    },
    
    // Additional Info
    companyLogo: {
      type: String,
      default: null,
    },
    coverImage: {
      type: String,
      default: null,
    },
    industry: {
      type: String,
      default: null,
    },
    revenue: {
      type: String,
      default: null,
    },
    employeeGrowth: {
      type: String,
      default: null,
    },
    
    // Contact Person
    hrName: {
      type: String,
      default: null,
    },
    hrEmail: {
      type: String,
      default: null,
    },
    hrPhone: {
      type: String,
      default: null,
    },
    hrDesignation: {
      type: String,
      default: null,
    },
    
    profileCompleted: {
      type: Boolean,
      default: false,    },
  },  isVerified: {
    type: Boolean,
    default: false,
  },
  avatar: {
    type: String,
    default: '',
  },
}, {
  timestamps: true,
});

// Hash password before saving
UserSchema.pre('save', async function (next) {
  // Skip hashing for OAuth users or if password hasn't been modified
  if (!this.isModified('password') || this.password === 'google-oauth') {
    return next();
  }

  const salt = await bcryptjs.genSalt(10);
  this.password = await bcryptjs.hash(this.password, salt);
  next();
});

// Compare password method
UserSchema.methods.comparePassword = async function (enteredPassword) {
  return await bcryptjs.compare(enteredPassword, this.password);
};

export default mongoose.models.User || mongoose.model('User', UserSchema);
