import { GoogleGenerativeAI } from '@google/generative-ai';

// Initialize the Gemini API
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Get the Gemini model (using gemma-3n-e4b-it which is stable and widely available)
const model = genAI.getGenerativeModel({ model: "gemma-3n-e4b-it" });

// Job-specific system prompt
const SYSTEM_PROMPT = `
You are JobForge AI Assistant, a helpful chatbot specialized in job search and career guidance. You are part of JobForge, a modern job portal platform.

Your expertise includes:
- Job search strategies and tips
- Resume and cover letter advice
- Interview preparation
- Career development guidance
- Industry insights and trends
- Salary negotiation tips
- Networking advice
- Skill development recommendations

Guidelines:
- Be professional, helpful, and encouraging
- Provide actionable advice
- Keep responses concise but comprehensive
- If asked about specific jobs, suggest they browse the JobForge platform
- For technical issues with the platform, direct users to contact support
- Always maintain a positive, career-focused tone
- Use relevant emojis sparingly to make conversations engaging

Remember: You're here to help users advance their careers and find their dream jobs through JobForge!
`;

// Generate chat response
export async function generateChatResponse(userMessage, conversationHistory = []) {
  try {
    // Prepare the conversation context
    let prompt = SYSTEM_PROMPT + "\n\n";
    
    // Add conversation history if available
    if (conversationHistory.length > 0) {
      prompt += "Previous conversation:\n";
      conversationHistory.forEach(msg => {
        prompt += `${msg.role}: ${msg.content}\n`;
      });
      prompt += "\n";
    }
    
    // Add current user message
    prompt += `User: ${userMessage}\n\nJobForge AI Assistant:`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    return {
      success: true,
      message: text,
      timestamp: new Date().toISOString()
    };
  } catch (error) {
    console.error('Error generating chat response:', error);
    return {
      success: false,
      error: 'Sorry, I encountered an error while processing your request. Please try again.',
      timestamp: new Date().toISOString()
    };
  }
}

// Generate job search suggestions based on user profile
export async function generateJobSuggestions(userProfile) {
  try {
    const prompt = `
    ${SYSTEM_PROMPT}
    
    Based on this user profile, provide personalized job search suggestions and career advice:
    
    Name: ${userProfile.name || 'User'}
    Experience Level: ${userProfile.experienceLevel || 'Not specified'}
    Field of Interest: ${userProfile.fieldOfInterest || 'Not specified'}
    Skills: ${userProfile.skills?.join(', ') || 'Not specified'}
    Location: ${userProfile.location || 'Not specified'}
    
    Provide specific, actionable advice for this user's career development and job search strategy.
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    return {
      success: true,
      suggestions: text,
      timestamp: new Date().toISOString()
    };
  } catch (error) {
    console.error('Error generating job suggestions:', error);
    return {
      success: false,
      error: 'Unable to generate personalized suggestions at the moment.',
      timestamp: new Date().toISOString()
    };
  }
}

// Generate resume improvement suggestions
export async function generateResumeAdvice(resumeContent) {
  try {
    const prompt = `
    ${SYSTEM_PROMPT}
    
    Please analyze this resume content and provide specific improvement suggestions:
    
    Resume Content:
    ${resumeContent}
    
    Provide actionable feedback on:
    1. Content and structure
    2. Keywords and industry terms
    3. Achievements and quantifiable results
    4. Areas for improvement
    5. Overall presentation
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    return {
      success: true,
      advice: text,
      timestamp: new Date().toISOString()
    };
  } catch (error) {
    console.error('Error generating resume advice:', error);
    return {
      success: false,
      error: 'Unable to analyze resume at the moment.',
      timestamp: new Date().toISOString()
    };
  }
}

// Generate interview preparation questions
export async function generateInterviewQuestions(jobTitle, company) {
  try {
    const prompt = `
    ${SYSTEM_PROMPT}
    
    Generate interview preparation questions for:
    Position: ${jobTitle}
    Company: ${company || 'the target company'}
    
    Provide:
    1. 5 common interview questions for this role
    2. 3 behavioral questions
    3. 2 technical/role-specific questions
    4. Questions the candidate should ask the interviewer
    5. Tips for answering effectively
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    return {
      success: true,
      questions: text,
      timestamp: new Date().toISOString()
    };
  } catch (error) {
    console.error('Error generating interview questions:', error);
    return {
      success: false,
      error: 'Unable to generate interview questions at the moment.',
      timestamp: new Date().toISOString()
    };
  }
}

// Quick responses for common queries
export const quickResponses = {
  greeting: [
    "Hello! 👋 I'm your JobForge AI Assistant. How can I help you with your career today?",
    "Hi there! 🌟 Ready to supercharge your job search? What can I assist you with?",
    "Welcome to JobForge! 🚀 I'm here to help you navigate your career journey. What's on your mind?"
  ],
  jobSearch: [
    "Here are some effective job search strategies:\n\n1. 🎯 Define your target roles clearly\n2. 📝 Tailor your resume for each application\n3. 🔗 Leverage your network\n4. 💼 Use multiple job boards\n5. 📱 Optimize your LinkedIn profile\n\nWhat specific aspect would you like to explore?",
    "Great question! Let me share some proven job search tips:\n\n• Use relevant keywords in your applications\n• Follow up on applications professionally\n• Practice your elevator pitch\n• Research companies thoroughly\n• Consider working with recruiters\n\nNeed help with any of these areas?"
  ],
  resume: [
    "For a standout resume:\n\n✅ Use action verbs and quantify achievements\n✅ Keep it to 1-2 pages\n✅ Include relevant keywords\n✅ Use a clean, professional format\n✅ Proofread carefully\n\nWould you like specific advice for your industry?",
    "Resume tips for 2024:\n\n🎯 Lead with your strongest qualifications\n📊 Include metrics and results\n🔧 Highlight relevant skills\n📧 Use a professional email\n🔄 Update regularly\n\nWhat section needs the most work?"
  ],
  interview: [
    "Interview preparation essentials:\n\n1. 📚 Research the company and role\n2. 🗣️ Practice common questions\n3. 💼 Prepare your own questions\n4. 👔 Dress appropriately\n5. 🕐 Arrive 10-15 minutes early\n\nWant help with mock interview questions?",
    "Key interview success factors:\n\n• Tell compelling stories using STAR method\n• Show enthusiasm for the role\n• Ask thoughtful questions\n• Follow up with a thank-you note\n• Be authentic and confident\n\nNeed practice with specific scenarios?"
  ]
};
