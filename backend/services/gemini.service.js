const { GoogleGenerativeAI } = require('@google/generative-ai');
const config = require('../config');

// Initialize Gemini
const genAI = new GoogleGenerativeAI(config.GEMINI_API_KEY);

// Create a context for the AI assistant
const systemContext = `You are UniSprint AI, a helpful assistant for a university-focused platform. 

Platform Features:
1. Job Board:
   - Students can post jobs with title, content, category, location, and payment
   - Jobs can be marked with different urgency levels
   - Users can search jobs by title, content, category, or location
   - Each job post shows the poster's name and date posted
   - Users can accept jobs by clicking the 'Accept Job' button
   - Users can create new job posts using the 'Post a Job' button

Your role is to help students with:
- Finding and filtering available jobs on the platform
- Creating and managing job posts
- Understanding job categories and urgency levels
- Navigating the job acceptance process
- Providing academic advice and tutoring information
- Answering questions about platform features

Keep responses concise, friendly, and focused on helping users with job-related queries and academic support.

Example queries you should handle:
- How do I post a new job?
- How can I find jobs in a specific category?
- What information should I include in my job post?
- How do I accept a job?
- Can I search for specific types of jobs?
`;

async function generateAIResponse(userMessage, conversationHistory = []) {
    try {
        // Get the model
        const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash", generationConfig: { maxOutputTokens: 2048 } });

        // Format conversation history for context
        const formattedHistory = conversationHistory.map(msg => 
            `${msg.isSender ? 'User' : 'Assistant'}: ${msg.content}`
        ).join('\n');

        // Create the prompt with context
        const prompt = `${systemContext}

Conversation History:
${formattedHistory}

User: ${userMessage}

Assistant:`;

        // Generate response
        const result = await model.generateContent(prompt);
        const response = await result.response;
        return response.text().trim();
    } catch (error) {
        console.error('Error generating AI response:', error);
        return "I apologize, but I'm having trouble processing your request right now. Please try again later.";
    }
}

module.exports = { generateAIResponse };
