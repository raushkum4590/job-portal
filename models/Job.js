import mongoose from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

const JobSchema = new mongoose.Schema({
  uuid: {
    type: String,
    default: () => uuidv4(),
    unique: true,
  },
  // Basic Job Information
  title: {
    type: String,
    required: [true, 'Job title is required'],
    maxlength: [100, 'Job title cannot be more than 100 characters'],
  },
  description: {
    type: String,
    required: [true, 'Job description is required'],
    maxlength: [5000, 'Job description cannot be more than 5000 characters'],
  },
  requirements: {
    type: String,
    required: [true, 'Job requirements are required'],
    maxlength: [3000, 'Job requirements cannot be more than 3000 characters'],
  },
  responsibilities: {
    type: String,
    maxlength: [3000, 'Job responsibilities cannot be more than 3000 characters'],
  },
  
  // Job Details
  department: {
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
      'customer-service',
      'business-development',
      'product-management',
      'quality-assurance',
      'other'
    ],
    required: [true, 'Department is required'],
  },
  jobType: {
    type: String,
    enum: ['full-time', 'part-time', 'contract', 'freelance', 'internship', 'temporary'],
    required: [true, 'Job type is required'],
  },
  workModel: {
    type: String,
    enum: ['remote', 'hybrid', 'on-site', 'flexible'],
    required: [true, 'Work model is required'],
  },
  experienceLevel: {
    type: String,
    enum: ['entry-level', 'mid-level', 'senior-level', 'executive', 'internship'],
    required: [true, 'Experience level is required'],
  },
  
  // Location & Salary
  location: {
    type: String,
    required: [true, 'Job location is required'],
  },
  salaryRange: {
    min: {
      type: Number,
      min: [0, 'Minimum salary cannot be negative'],
    },
    max: {
      type: Number,
      min: [0, 'Maximum salary cannot be negative'],
    },
    currency: {
      type: String,
      default: 'USD',
    },
    period: {
      type: String,
      enum: ['hourly', 'monthly', 'yearly'],
      default: 'yearly',
    },
    negotiable: {
      type: Boolean,
      default: false,
    }
  },
  
  // Skills & Qualifications
  skills: [{
    type: String,
    maxlength: [50, 'Skill name cannot be more than 50 characters'],
  }],  education: {
    type: String,
    enum: [
      '',
      'high-school',
      'some-college',
      'certificate-program',
      'trade-school',
      'associate-degree',
      'associate-degree-related',
      'bachelor-degree',
      'bachelor-degree-related',
      'bachelor-computer-science',
      'bachelor-engineering',
      'bachelor-business',
      'bachelor-marketing',
      'bachelor-finance',
      'bachelor-design',
      'bachelor-sciences',
      'bachelor-liberal-arts',
      'master-degree',
      'master-degree-related',
      'master-computer-science',
      'master-engineering',
      'master-business',
      'master-marketing',
      'master-finance',
      'master-design',
      'master-sciences',
      'phd',
      'phd-related',
      'phd-computer-science',
      'phd-sciences',
      'professional-certification',
      'coding-bootcamp',
      'online-courses',
      'equivalent-experience',
      'self-taught'
    ],
  },
  
  // Additional qualifications for more detailed requirements
  additionalQualifications: [{
    type: String,
  }],
  
  // Benefits & Perks
  benefits: [{
    type: String,
  }],
  
  // Application Details
  applicationDeadline: {
    type: Date,
  },
  applicationInstructions: {
    type: String,
    maxlength: [1000, 'Application instructions cannot be more than 1000 characters'],
  },
  applicationUrl: {
    type: String,
  },
  applicationEmail: {
    type: String,
    match: [
      /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
      'Please provide a valid email',
    ],
  },
  
  // Company Information (Reference to employer)
  employer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Employer is required'],
  },
  companyName: {
    type: String,
    required: [true, 'Company name is required'],
  },
  companyLogo: {
    type: String,
  },
  
  // Job Status & Management
  status: {
    type: String,
    enum: ['draft', 'active', 'paused', 'closed', 'expired'],
    default: 'draft',
  },
  featured: {
    type: Boolean,
    default: false,
  },
  urgent: {
    type: Boolean,
    default: false,
  },
  
  // Analytics & Tracking
  views: {
    type: Number,
    default: 0,
  },  applications: [{
    applicant: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    appliedAt: {
      type: Date,
      default: Date.now,
    },
    status: {
      type: String,
      enum: ['pending', 'reviewed', 'shortlisted', 'interviewed', 'rejected', 'hired'],
      default: 'pending',
    },
    
    // Application Form Data
    coverLetter: {
      type: String,
      maxlength: [2000, 'Cover letter cannot be more than 2000 characters'],
    },
    resumeUrl: String,
    
    // Additional Application Questions
    availabilityDate: Date,
    salaryExpectation: {
      min: Number,
      max: Number,
      currency: {
        type: String,
        default: 'USD'
      }
    },
    portfolio: String,
    linkedinProfile: String,
    githubProfile: String,
    experience: {
      type: String,
      maxlength: [1000, 'Experience description cannot be more than 1000 characters'],
    },
    whyInterested: {
      type: String,
      maxlength: [1000, 'Why interested answer cannot be more than 1000 characters'],
    },
    skills: [String],
    references: [{
      name: String,
      company: String,
      position: String,
      email: String,
      phone: String,
    }],
    
    // Employer Notes
    notes: String,
    interviewDate: Date,
    interviewNotes: String,
  }],
  
  // SEO & Search
  tags: [{
    type: String,
    maxlength: [30, 'Tag cannot be more than 30 characters'],
  }],
  
  // Timestamps
  postedAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
  expiresAt: {
    type: Date,
  },
}, {
  timestamps: true,
});

// Indexes for better query performance
JobSchema.index({ employer: 1, status: 1 });
JobSchema.index({ department: 1, jobType: 1, workModel: 1 });
JobSchema.index({ location: 1 });
JobSchema.index({ skills: 1 });
JobSchema.index({ postedAt: -1 });
JobSchema.index({ status: 1, postedAt: -1 });
JobSchema.index({ featured: 1, postedAt: -1 });

// Virtual for application count
JobSchema.virtual('applicationCount').get(function() {
  return this.applications ? this.applications.length : 0;
});

// Update the updatedAt field before saving
JobSchema.pre('save', function(next) {
  this.updatedAt = new Date();
  next();
});

// Method to check if job is expired
JobSchema.methods.isExpired = function() {
  if (!this.expiresAt) return false;
  return new Date() > this.expiresAt;
};

// Method to check if application deadline has passed
JobSchema.methods.isApplicationDeadlinePassed = function() {
  if (!this.applicationDeadline) return false;
  return new Date() > this.applicationDeadline;
};

// Static method to find active jobs
JobSchema.statics.findActive = function() {
  return this.find({ 
    status: 'active',
    $or: [
      { expiresAt: { $gt: new Date() } },
      { expiresAt: { $exists: false } }
    ]
  }).sort({ featured: -1, postedAt: -1 });
};

export default mongoose.models.Job || mongoose.model('Job', JobSchema);