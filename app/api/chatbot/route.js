import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]/route';
import { generateChatResponse, generateJobSuggestions, generateResumeAdvice, generateInterviewQuestions, quickResponses } from '@/lib/chatbot';

export async function POST(request) {
  try {
    const session = await getServerSession(authOptions);
    const { type, message, data } = await request.json();

    // Check if Gemini API key is configured
    if (!process.env.GEMINI_API_KEY || process.env.GEMINI_API_KEY === 'your-gemini-api-key-here') {
      return NextResponse.json({
        success: false,
        error: 'Chatbot is not configured. Please add your Gemini API key to the environment variables.',
        fallbackResponse: 'I apologize, but the AI assistant is currently unavailable. Please contact support for assistance with your job search questions.'
      }, { status: 503 });
    }

    let result;

    switch (type) {
      case 'chat':
        // Handle regular chat messages
        const conversationHistory = data?.history || [];
        result = await generateChatResponse(message, conversationHistory);
        break;

      case 'job-suggestions':
        // Generate personalized job suggestions
        const userProfile = data?.profile || {};
        result = await generateJobSuggestions(userProfile);
        break;

      case 'resume-advice':
        // Analyze resume and provide feedback
        const resumeContent = data?.resumeContent || '';
        result = await generateResumeAdvice(resumeContent);
        break;

      case 'interview-prep':
        // Generate interview questions and tips
        const jobTitle = data?.jobTitle || '';
        const company = data?.company || '';
        result = await generateInterviewQuestions(jobTitle, company);
        break;

      case 'quick-response':
        // Handle quick responses for common queries
        const category = data?.category || 'greeting';
        const responses = quickResponses[category] || quickResponses.greeting;
        const randomResponse = responses[Math.floor(Math.random() * responses.length)];
        result = {
          success: true,
          message: randomResponse,
          timestamp: new Date().toISOString()
        };
        break;

      default:
        return NextResponse.json({
          success: false,
          error: 'Invalid request type'
        }, { status: 400 });
    }

    // Add user info to the response if session exists
    if (session) {
      result.user = {
        name: session.user.name,
        role: session.user.role
      };
    }

    return NextResponse.json(result);

  } catch (error) {
    console.error('Chatbot API error:', error);
    return NextResponse.json({
      success: false,
      error: 'Sorry, I encountered an error. Please try again.',
      fallbackResponse: 'I apologize for the technical difficulty. In the meantime, you can browse our job listings or contact our support team for assistance.'
    }, { status: 500 });
  }
}

// GET endpoint for health check and quick info
export async function GET() {
  const isConfigured = process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== 'your-gemini-api-key-here';
  
  return NextResponse.json({
    status: 'JobForge AI Assistant',
    configured: isConfigured,
    features: [
      'Job search guidance',
      'Resume review and tips',
      'Interview preparation',
      'Career development advice',
      'Personalized job suggestions'
    ],
    timestamp: new Date().toISOString()
  });
}
