const { GoogleGenerativeAI } = require('@google/generative-ai');
const Order = require('../models/order.model');

// Initialize Gemini with API key from environment variable
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Function to use MongoDB full-text search for better relevance search for relevant job posts
async function searchJobPosts(query) {
    try {
        
        const posts = await Order.find(
            { $text: { $search: query }, status: 'Open' },
            { score: { $meta: 'textScore' } }
        )
        .populate({ path: 'userId', select: 'fullName' })
        .sort({ score: { $meta: 'textScore' }, datePosted: -1 })
        .limit(5);

        return posts.map(post => ({
            title: post.title,
            content: post.content,
            category: post.category,
            payment: post.payment,
            location: post.location,
            postedBy: post.userId.fullName,
            urgency: post.urgency ? 'Urgent' : 'Regular'
        }));
    } catch (error) {
        console.error('Error searching job posts:', error);
        return [];
    }
}

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

        // Check if the message is asking about job posts
        const jobSearchKeywords = ['show me', 'find', 'search', 'looking for', 'need', 'want', 'tutoring', 'tutor', 'job', 'jobs', 'posts', 'help with'];
        const isJobSearch = jobSearchKeywords.some(keyword => userMessage.toLowerCase().includes(keyword.toLowerCase()));

        let relevantPosts = [];
        if (isJobSearch) {
            // Search for relevant job posts
            relevantPosts = await searchJobPosts(userMessage);
        }

        // Format conversation history for context
        const formattedHistory = conversationHistory.map(msg => 
            `${msg.isSender ? 'User' : 'Assistant'}: ${msg.content}`
        ).join('\n');

        // Create the prompt with context and job posts if available
        let prompt = `${systemContext}\n\n`;

        if (relevantPosts.length > 0) {
            prompt += `Current Available Jobs:\n${JSON.stringify(relevantPosts, null, 2)}\n\n`;
        }

        prompt += `Conversation History:\n${formattedHistory}\n\nUser: ${userMessage}\n\nA: `;

        if (relevantPosts.length > 0) {
            prompt += 'Based on the available jobs shown above, ';
        }

        // Generate response
        const result = await model.generateContent(prompt);
        console.log('Gemini API result:', result);
        
        if (!result || !result.response) {
            console.error('Invalid response from Gemini API:', result);
            throw new Error('Invalid response structure from Gemini API');
        }

        const response = result.response;
        console.log('Gemini API response:', response);

        if (!response.text) {
            console.error('Response missing text method:', response);
            throw new Error('Response missing text method');
        }

        const text = response.text();
        console.log('Final text:', text);
        return text.trim();
    } catch (error) {
        console.error('Error generating AI response:', {
            error: error,
            message: error.message,
            stack: error.stack,
            userMessage: userMessage,
            modelName: "gemini-2.0-flash",
            apiKey: process.env.GEMINI_API_KEY ? 'Present' : 'Missing'
        });
        
        if (!process.env.GEMINI_API_KEY) {
            return "Error: Gemini API key is missing. Please check your environment variables.";
        }
        
        return `Error: ${error.message}. Please try again later.`;
    }
}

module.exports = { generateAIResponse, searchJobPosts };
