//require("dotenv").config({path: "./.env"});
require('dotenv').config();

const mongoose = require("mongoose");

const User = require("./models/user.model");
const Order = require("./models/order.model");
const Conversation = require("./models/conversation.model")
const Message = require("./models/messages.model")

// Connect to MongoDB using environment variable
mongoose.connect(process.env.MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
.then(() => console.log("MongoDB connected"))
.catch(err => console.error("MongoDB connection error:", err));

//mongoose.connect(config.connectionString);

const express = require("express");
const cors = require("cors");
const app = express();
const port = process.env.RENDER_PORT || process.env.PORT || 8000; 



const jwt = require("jsonwebtoken");
const { authenticateToken } = require("./utilities");

app.use(express.json())

app.use(
    cors({
        origin: ["https://capstone-unisprint-two.vercel.app", "http://localhost:5173", "http://localhost:3000"],
        credentials: true
    })
);

app.get("/", (req, res) => {
    res.json({data: "hello00"});
});

const bcrypt = require("bcrypt");
app.post("/create-account", async (req, res) => {
    const {fullName, email, password, major, hometown, year} = req.body;
    console.log(fullName, email, password, major, hometown, year)
    console.log("Bcrypt is:", bcrypt);


    if (!fullName || !email || !password || !major || !year) {
        return res.status(400).json({ message: "All fields are required." });
    }

    try {
        // Check if the user already exists
        const existingUser = await User.findOne({ email: email })
        if (existingUser) {
            return res.status(400).json({ message: "User already exists with this email." });
        }

        // Hash the password
        const salt = await bcrypt.genSalt(10);

        // Create a new user
        const newUser = new User({
            fullName,
            email,
            password, // Store the hashed password
            major,
            hometown,
            year,
        });

        await newUser.save();

        res.status(201).json({ message: "Account created successfully." });
    } catch (error) {
        console.error("Error in /create-account:", error.message);
        res.status(500).json({ message: "An error occurred while creating the account." });
    }
});

app.post("/login", async (req, res) => {
    const { email, password} = req.body;
    
    if (!email) {
        return res.status(400).json({message: "Email is required."});
    }

    if (!password) {
        return res.status(400).json({message: "Password is required."});
    }

    try {
        const userInfo = await User.findOne({ email: email });
        if (!userInfo) {
            return res.status(400).json({ message: "User not found." });
        }

        // Compare the entered password with the hashed password
        const isMatch = await userInfo.comparePassword(password);
if (!isMatch) {
    return res.status(400).json({ message: "Invalid credentials." });
}


        // Create AI agent and conversation if it doesn't exist
        const aiAgent = await getOrCreateAIAgent();
        let existingConversation = await Conversation.findOne({
          participants: { $all: [userInfo._id, aiAgent._id] }
        });

        if (!existingConversation) {
          const conversation = new Conversation({
            participants: [userInfo._id, aiAgent._id],
            lastMessage: {
              content: "Hello! I'm your UniSprint AI assistant. How can I help you today?",
              createdAt: new Date()
            }
          });
          await conversation.save();

          const message = new Message({
            conversationId: conversation._id,
            senderId: aiAgent._id,
            content: "Hello! I'm your UniSprint AI assistant. How can I help you today?",
            createdAt: new Date(),
            isAI: true
          });
          await message.save();
        }

        const accessToken = jwt.sign(
            { userId: userInfo._id, email: userInfo.email },
            process.env.ACCESS_TOKEN_SECRET,
            { expiresIn: "36000m" }
        );

        return res.json({
            error: false,
            message: "Login successful.",
            email,
            accessToken,
        });
    } catch (error) {
        console.error("Error in /login:", error.message);
        return res.status(500).json({ error: true, message: "Internal server error." })
    }
});

app.get("/get-user", authenticateToken, async (req, res) => {
    const {user}  = req.user;
    const isUser = await User.findOne({ _id: user._id});

    if (!isUser) {
        return res.sendStatus(401);
    }

    return res.json({
        user: isUser,
        message: "user found",
    });
});

app.post("/add-order", authenticateToken, async(req, res) => {
    console.log("Authenticated user:", req.user);
    console.log("JWT Secret:", process.env.ACCESS_TOKEN_SECRET);
    const jwt = require("jsonwebtoken");
    const userId = req.user.userId;

    // Replace with your actual token   

    // const decoded = jwt.decode(token, { complete: true });
    // console.log("Decoded token:", decoded);
    // console.log("Decoded token payload:", decoded.payload);



    const {title, content, category, location, payment, urgency, duration} = req.body;
    // const {user}  = req.user;

    if (!title) {
        return res.status(400).json({message: "Title is required."});
    }

    if (!content) {
        return res.status(400).json({message: "Content is required."});
    }

    if (!category) {
        return res.status(400).json({message: "Category is required."});
    }
    if (!payment) {
        return res.status(400).json({message: "Payment is required."});
    }
    if (!userId) {
        return res.status(401).json({ error: true, message: "Unauthorized" })
    }
    
    

    try {
        const order = new Order({
            title,
            content,
            category,
            userId: userId,
            payment: payment|| 0,
            urgency: urgency || false,
            duration: duration || 0, 
            location,
        })
        await order.save()
        return res.json({
            error: false,
            order,
            message: "Order added successfully"
        });
    } catch (error ) {
        console.error("Error in /add-order route:", error.message);
        return res.status(500).json({
            error:true,
            message: "Internal Server error"
        })
    }


});

app.get("/order-history", authenticateToken, async (req, res) => {
    try {
        // Retrieve orders based on the user ID (from the token)
        const orders = await Order.find({ userId: req.user.userId });

        // If no orders exist
        if (orders.length === 0) {
            return res.status(404).json({ message: "No orders found for this user." });
        }

        return res.json({
            error: false,
            orders,
            message: "Orders retrieved successfully"
        });
    } catch (error) {
        return res.status(500).json({
            error: true,
            message: "Internal Server Error"
        });
    }
});


app.put("/edit-order/:orderId", authenticateToken, async (req, res) => {
    const orderId  = req.params.orderId;
    const { title, content, category, location, payment, urgency, duration } = req.body;
    const user  = req.user.userId;

    // Check for required fields
    if (!title && !content && !category && !location && !payment && !urgency && !duration) {
        return res.status(400).json({
            message: "No changes provided."
        });
    }
    
    try {
        // Find the order by ID and ensure it belongs to the logged-in user
        const order = await Order.findOne({ _id: orderId, userId: user });
        if (!order) {
            return res.status(404).json({ error: true, message: "Order not found or unauthorized." });
        }

        // Update the order fields
        if (order) order.title = title;
        if (content) order.content = content;
        if (category) order.category = category;
        if (location) order.location = location;
        if (payment) order.payment = payment;
        if (urgency) order.urgency = urgency || false;
        if (duration) order.duration = duration || 1;

        // Save the updated order
        await order.save();

        return res.json({
            error: false,
            order,
            message: "Order updated successfully",
        });
    } catch (error) {
        console.error("Error in /edit-order route:", error); // Log error for debugging
        return res.status(500).json({
            error: true,
            message: "Internal Server Error",
        });
    }
});

app.get("/get-user-all-orders", authenticateToken, async (req, res) => {
    const userId = req.user.userId;
    try {
        const orders = await Order.find({userId: userId}); // Retrieve all orders
        return res.json({
            error: false,
            orders,
            message: "All orders retrieved successfully",
        });
    } catch (error) {
        console.error("Error in /get-user-all-orders route:", error);
        return res.status(500).json({
            error: true,
            message: "Internal Server error",
        });
    }
});

app.delete("/delete-order/:orderId", authenticateToken, async (req, res) => {
    const  orderId  = req.params.orderId;
    const user = req.user.userId;

    try {
        // Find the order by ID and ensure it belongs to the logged-in user
        const order = await Order.findOne({ _id: orderId, userId: user });
        
        if (!order) {
            return res.status(404).json({
                error: true,
                message: "Order not found or unauthorized",
            });
        }

        // Delete the order
        await Order.deleteOne({ _id: orderId });

        return res.json({
            error: false,
            message: "Order deleted successfully",
        });
    } catch (error) {
        console.error("Error in /delete-order route:", error);
        return res.status(500).json({
            error: true,
            message: "Internal Server error",
        });
    }
});

app.get("/profile", authenticateToken, async (req, res) => {
    try {
        const user = await User.findOne({_id: req.user.userId});
        console.log(req.user)
        if (!user) {
            return res.status(404).json({ error: true, message: "User not found" });
        }
        res.json({ error: false, user, message: "User profile retrieved successfully" });
    } catch (error) {
        console.error("Error in /profile:", error);
        res.status(500).json({ error: true, message: "Internal server error" });
    }
});


app.get("/get-all-orders", async (req, res) => {
    try {
        const orders = await Order.find()
            .populate({ path: 'userId', select: 'fullName' }) // Populate fullName from User
            .sort({ createdAt: -1 });
        
        // Transform data to include userName
        const ordersWithUserName = orders.map(order => ({
            ...order.toObject(),
            userName: order.userId.fullName // Add userName from populated data
        }));

        return res.json({
            error: false,
            orders: ordersWithUserName,
            message: "All orders retrieved successfully",
        });
    } catch (error) {
        console.error("Error in /get-all-orders route:", error);
        return res.status(500).json({
            error: true,
            message: "Internal Server error",
        });
    }
});
app.post("/accept-job", authenticateToken, async (req, res) => {
    const { orderId } = req.body;
    const { user } = req.user;
  
    try {
      
      const order = await Order.findByIdAndUpdate(
        orderId,
        {acceptedBy: user._id},
        {new: true}
      );
  
      if (!order) {
        return res.status(404).json({
          error: true,
          message: "Order not found",
        });
      }
  
      // Check if the order is already accepted
      if (order.acceptedBy) {
        return res.status(400).json({
          error: true,
          message: "This job has already been accepted",
        });
      }
  
      // Update the order with the user who accepted it
      order.acceptedBy = user._id;
      order.acceptedAt = new Date();
      await order.save();
  
      return res.json({
        error: false,
        success: true,
        message: "Job accepted successfully",
      });
    } catch (error) {
      console.error("Error in /accept-job route:", error);
      return res.status(500).json({
        error: true,
        message: "Internal Server error",
      });
    }
  });

const Notification = require("./models/notification.model");

app.post("/apply-job/:orderId", authenticateToken, async (req, res) => {
    const { orderId } = req.params;
    const applicantId = req.user.userId;
    const user = await User.findOne({_id: applicantId});
    try {
        const order = await Order.findById(orderId);

        if (!order) {
            return res.status(404).json({ error: true, message: "Job not found" });
        }

        if (order.applicants.includes(applicantId)) {
            return res.status(400).json({ error: true, message: "You have already applied to this job" });
        }

        if (order.userId == req.user.userId) {
            return res.status(400).json({ error: true, message: "You can't apply to your own jobs" });
        }

        order.applicants.push(applicantId);
        await order.save();

        // Create a notification for the job creator
        const notification = new Notification({
            userId: order.userId,// Job creator's ID
            orderId: order._id, 
            message: `User ${user.fullName} has applied for your job: ${order.title}`,
            acceptedby: applicantId,
            type: "application"
        });
        await notification.save();

        res.json({ error: false, message: "Applied to job successfully" });
    } catch (error) {
        console.error("Error applying for job:", error);
        res.status(500).json({ error: true, message: "Internal server error" });
    }
});
  


app.get("/notifications", authenticateToken, async (req, res) => {
    try {
        const notifications = await Notification.find({ userId: req.user.userId }).sort({ createdAt: -1 });
        res.json({ error: false, notifications });
    } catch (error) {
        console.error("Error fetching notifications:", error);
        res.status(500).json({ error: true, message: "Internal server error" });
    }
});

app.post("/notifications/:notificationId/respond", authenticateToken, async (req, res) => {
    const { notificationId } = req.params;
    const { action } = req.body; // Action can be "accept" or "reject"
    const user = await User.findOne({_id: req.user.userId});

    try {
        // Find the notification
        const notification = await Notification.findById(notificationId);
        if (!notification) {
            return res.status(404).json({ error: true, message: "Notification not found" });
        }

        // Find the related job post
        const order = await Order.findOne({ _id: notification.orderId, userId: req.user.userId });
        if (!order) {
            return res.status(404).json({ error: true, message: "Job not found or unauthorized" });
        }

        if (action === "accept") {
            // Accept the job application
            await Order.deleteOne({ _id: notification.orderId})

            // Notify the applicant
            const applicantNotification = new Notification({
                userId: notification.acceptedby,
                orderId: order._id,
                message: `Your application for the job "${order.title}" has been accepted. Reach out to "${user.email}"`,
                type: "response"
            });
            await applicantNotification.save();

            // Remove the notification for the creator
            await Notification.findByIdAndDelete(notificationId);

            return res.json({ error: false, message: "Application accepted and job closed." });
        } else if (action === "reject") {
            // Reject the job application
            order.applicants = order.applicants.filter((id) => id.toString() !== notification.userId.toString());
            await order.save();

            // Notify the applicant
            const applicantNotification = new Notification({
                userId: notification.acceptedby,
                orderId: order._id,
                message: `Your application for the job "${order.title}" has been rejected.`,
                type: "response"
            });
            await applicantNotification.save();

            // Mark the creator's notification as read
            notification.read = true;
            await notification.save();

            return res.json({ error: false, message: "Application rejected. Job remains open." });
        } else {
            return res.status(400).json({ error: true, message: "Invalid action" });
        }
    } catch (error) {
        console.error("Error responding to notification:", error);
        res.status(500).json({ error: true, message: "Internal server error" });
    }
});

app.get("/conversations", authenticateToken, async (req, res) => {
    try {
      // Find all conversations where the user is a participant
      const conversations = await Conversation.find({
        participants: req.user.userId,
      }).populate("participants", "fullName email")
  
      // Process conversations to get the right format for the frontend
      const processedConversations = await Promise.all(
        conversations.map(async (conv) => {
          // Get the other user in the conversation
          const otherUser = conv.participants.find((participant) => participant._id.toString() !== req.user.userId)
  
          // Count unread messages
          const unreadCount = await Message.countDocuments({
            conversationId: conv._id,
            senderId: { $ne: req.user.userId },
            read: false,
          })
  
          // Check if other user is AI
          const isAI = await User.findById(otherUser._id).select('isAI');
  
          return {
            _id: conv._id,
            otherUser: {
              _id: otherUser._id,
              fullName: otherUser.fullName,
              email: otherUser.email,
              isAI: isAI?.isAI || false
            },
            lastMessage: conv.lastMessage || null,
            unreadCount,
          }
        }),
      )
  
      res.json({ conversations: processedConversations })
    } catch (error) {
      console.error("Error fetching conversations:", error)
      res.status(500).json({ error: true, message: "Internal server error" })
    }
  })
  
  // Get messages for a specific conversation
  app.get("/messages/:conversationId", authenticateToken, async (req, res) => {
    try {
      const { conversationId } = req.params
  
      // Check if the user is a participant in this conversation
      const conversation = await Conversation.findOne({
        _id: conversationId,
        participants: req.user.userId,
      })
  
      if (!conversation) {
        return res.status(403).json({ error: true, message: "You don't have access to this conversation" })
      }
  
      // Get all messages for this conversation
      const messages = await Message.find({ conversationId }).sort({ createdAt: 1 }).lean()
  
      // Add isSender flag to each message
      const processedMessages = messages.map((msg) => ({
        ...msg,
        isSender: msg.sender.toString() === req.user.userId,
      }))
  
      res.json({ messages: processedMessages })
    } catch (error) {
      console.error("Error fetching messages:", {
        error: error,
        message: error.message,
        stack: error.stack,
        conversationId: req.params.conversationId,
        userId: req.user.userId
      })
      res.status(500).json({ error: true, message: `Error fetching messages: ${error.message}` })
    }
  })
  
  // Send a new message
  app.post("/send-message", authenticateToken, async (req, res) => {
  const { conversationId, content } = req.body;
  const userId = req.user.userId;

  try {
    const conversation = await Conversation.findById(conversationId);
    if (!conversation) {
      return res.status(404).json({ message: "Conversation not found" });
    }

    // Create user's message
    const message = new Message({
      conversationId,
      sender: userId,
      content,
      createdAt: new Date()
    });
    await message.save();

    // Update conversation's last message
    conversation.lastMessage = {
      content: content,
      createdAt: new Date()
    };
    await conversation.save();

    // Check if this is an AI conversation
    const otherUser = await User.findById(
      conversation.participants.find(p => p.toString() !== userId.toString())
    );

    if (otherUser && otherUser.isAI) {
      // Get conversation history for context
      const history = await Message.find({ conversationId })
        .sort({ createdAt: -1 })
        .limit(10)
        .sort({ createdAt: 1 });

      // Generate AI response
      const aiResponse = await handleAIResponse(content, conversationId);
      
      // Save AI's response
      const aiMessage = new Message({
        conversationId,
        sender: otherUser._id,
        content: aiResponse,
        createdAt: new Date(),
        isAI: true
      });
      await aiMessage.save();

      // Update conversation's last message with AI response
      conversation.lastMessage = {
        content: aiResponse,
        createdAt: new Date()
      };
      await conversation.save();
    }

    res.status(201).json({ message: "Message sent successfully" });
  } catch (error) {
    console.error("Error sending message:", error);
    res.status(500).json({ message: "Error sending message" });
  }
});

// Original send-message endpoint (renamed to avoid conflicts)
app.post("/send-message-old", authenticateToken, async (req, res) => {
    try {
      const { conversationId, content, recipientId } = req.body
  
      let conversation
  
      // If conversationId is provided, use existing conversation
      if (conversationId) {
        conversation = await Conversation.findOne({
          _id: conversationId,
          participants: req.user.userId,
        })
  
        if (!conversation) {
          return res.status(403).json({ error: true, message: "You don't have access to this conversation" })
        }
      }
      // If recipientId is provided, find or create a conversation
      else if (recipientId) {
        // Check if conversation already exists
        conversation = await Conversation.findOne({
          participants: { $all: [req.user.userId, recipientId] },
        })
  
        // If not, create a new conversation
        if (!conversation) {
          conversation = new Conversation({
            participants: [req.user.userId, recipientId],
          })
          await conversation.save()
        }
      } else {
        return res.status(400).json({ error: true, message: "Either conversationId or recipientId is required" })
      }
  
      // Create the new message
      const message = new Message({
        conversationId: conversation._id,
        sender: req.user.userId,
        content,
        read: false,
      })
  
      await message.save()
  
      // Update the conversation's lastMessage and updatedAt
      conversation.lastMessage = message._id
      conversation.updatedAt = Date.now()
      await conversation.save()
  
      res.json({
        error: false,
        message: "Message sent successfully",
        data: {
          messageId: message._id,
          conversationId: conversation._id,
        },
      })
    } catch (error) {
      console.error("Error sending message:", error)
      res.status(500).json({ error: true, message: "Internal server error" })
    }
  })
  
  // Mark messages as read
  app.post("/mark-messages-read/:conversationId", authenticateToken, async (req, res) => {
    try {
      const { conversationId } = req.params
  
      // Check if the user is a participant in this conversation
      const conversation = await Conversation.findOne({
        _id: conversationId,
        participants: req.user.userId,
      })
  
      if (!conversation) {
        return res.status(403).json({ error: true, message: "You don't have access to this conversation" })
      }
  
      // Mark all messages from other users as read
      await Message.updateMany(
        {
          conversationId,
          sender: { $ne: req.user.userId },
          read: false,
        },
        { read: true },
      )
  
      res.json({ error: false, message: "Messages marked as read" })
    } catch (error) {
      console.error("Error marking messages as read:", error)
      res.status(500).json({ error: true, message: "Internal server error" })
    }
  })
  
  // Get count of unread messages
  app.get("/unread-message-count", authenticateToken, async (req, res) => {
    try {
      // Find all conversations where the user is a participant
      const conversations = await Conversation.find({
        participants: req.user.userId,
      })
  
      // Count all unread messages across all conversations
      const conversationIds = conversations.map((conv) => conv._id)
      const count = await Message.countDocuments({
        conversationId: { $in: conversationIds },
        sender: { $ne: req.user.userId },
        read: false,
      })
  
      res.json({ count })
    } catch (error) {
      console.error("Error getting unread message count:", error)
      res.status(500).json({ error: true, message: "Internal server error" })
    }
  })
  
  // Start a new conversation with a user
  // Create AI agent if it doesn't exist
async function getOrCreateAIAgent() {
  try {
    let aiAgent = await User.findOne({ isAI: true });
    if (!aiAgent) {
      const randomPassword = Math.random().toString(36);
      aiAgent = new User({
        fullName: 'UniSprint AI Assistant',
        email: 'ai@unisprint.com',
        major: 'Computer Science',
        year: 'N/A',
        hometown: 'Cloud',
        password: randomPassword,
        isAI: true
      });
      await aiAgent.save();
      
      // Create welcome message for all existing users
      const users = await User.find({ isAI: false });
      for (const user of users) {
        const conversation = new Conversation({
          participants: [user._id, aiAgent._id],
          lastMessage: {
            content: "Hello! I'm your UniSprint AI assistant. How can I help you today?",
            createdAt: new Date()
          }
        });
        await conversation.save();

        const message = new Message({
          conversationId: conversation._id,
          senderId: aiAgent._id,
          content: "Hello! I'm your UniSprint AI assistant. How can I help you today?",
          createdAt: new Date(),
          isAI: true
        });
        await message.save();
      }
    }
    return aiAgent;
  } catch (error) {
    console.error('Error creating AI agent:', error);
    throw error;
  }
}

const { generateAIResponse } = require('./services/gemini.service');

// AI message handler
async function handleAIResponse(message, conversationId) {
  try {
    // Get conversation history
    const history = await Message.find({ conversationId })
      .sort({ createdAt: -1 })
      .limit(10)
      .sort({ createdAt: 1 });

    // Generate response using Gemini
    const response = await generateAIResponse(message, history);
    return response;
  } catch (error) {
    console.error('Error in AI response:', error);
    return "I apologize, but I'm having trouble processing your request right now. Please try again later.";
  }
}

app.post("/start-conversation", authenticateToken, async (req, res) => {
    try {
      const { recipientId, initialMessage } = req.body
  
      if (!recipientId) {
        return res.status(400).json({ error: true, message: "Recipient ID is required" })
      }
  
      // Check if the recipient exists
      const recipient = await User.findById(recipientId)
      if (!recipient) {
        return res.status(404).json({ error: true, message: "Recipient not found" })
      }
  
      // Check if a conversation already exists
      let conversation = await Conversation.findOne({
        participants: { $all: [req.user.userId, recipientId] },
      })
  
      // If not, create a new conversation
      if (!conversation) {
        conversation = new Conversation({
          participants: [req.user.userId, recipientId],
        })
        await conversation.save()
      }
  
      // If an initial message was provided, create it
      if (initialMessage) {
        const message = new Message({
          conversationId: conversation._id,
          sender: req.user.userId,
          content: initialMessage,
          read: false,
        })
  
        await message.save()
  
        // Update the conversation
        conversation.lastMessage = message._id
        conversation.updatedAt = Date.now()
        await conversation.save()
      }
  
      res.json({
        error: false,
        message: "Conversation started successfully",
        conversationId: conversation._id,
      })
    } catch (error) {
      console.error("Error starting conversation:", error)
      res.status(500).json({ error: true, message: "Internal server error" })
    }
  })
  
  // Search users by name or email
  app.get("/search-users", authenticateToken, async (req, res) => {
    try {
      const { query } = req.query;
      
      if (!query) {
        return res.status(400).json({ error: true, message: "Search query is required" });
      }
      
      // Search for users by name or email, excluding the current user
      const users = await User.find({
        $and: [
          { _id: { $ne: req.user.userId } }, // Exclude current user
          {
            $or: [
              { fullName: { $regex: query, $options: "i" } },
              { email: { $regex: query, $options: "i" } }
            ]
          }
        ]
      }).select("fullName email major year hometown");
      
      res.json({ 
        error: false, 
        users,
        message: "Users found successfully" 
      });
    } catch (error) {
      console.error("Error searching users:", error);
      res.status(500).json({ error: true, message: "Internal server error" });
    }
  });
  
  
  


app.listen(port);

module.exports = app;

// Add reply to an order
app.post('/add-reply', authenticateToken, async (req, res) => {
  try {
    const { orderId, content } = req.body;
    const userId = req.user.userId;

    // Find the order
    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }

    // Create a new reply
    const reply = {
      content,
      userId,
      createdAt: new Date()
    };

    // Add the reply to the order
    order.replies.push(reply);
    await order.save();

    res.status(201).json({ reply });
  } catch (error) {
    console.error('Error adding reply:', error);
    res.status(500).json({ message: 'Error adding reply' });
  }
});

// Get order details with replies
app.get("/get-order/:orderId", authenticateToken, async (req, res) => {
  try {
    const order = await Order.findById(req.params.orderId)
      .populate('userId', 'fullName')
      .populate('replies.userId', 'fullName');

    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // Transform the order data to include user names
    const transformedOrder = {
      ...order.toObject(),
      userName: order.userId?.fullName || 'Unknown User',
      replies: order.replies.map(reply => ({
        content: reply.content,
        userName: reply.userId?.fullName || 'Unknown User',
        createdAt: reply.createdAt.toISOString(),
        _id: reply._id
      }))
    };

    res.json({ order: transformedOrder });
  } catch (error) {
    console.error("Error getting order:", error);
    res.status(500).json({ message: "Error getting order" });
  }
});

// Add reply to an order
app.post("/add-reply", authenticateToken, async (req, res) => {
  try {
    const { orderId, content } = req.body;
    const userId = req.user.userId;

    // Find the order
    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ message: "Order not found" });
    }

    // Create a new reply
    const reply = {
      content,
      userId,
      createdAt: new Date()
    };

    // Add the reply to the order
    order.replies.push(reply);
    await order.save();

    res.status(201).json({ message: "Reply added successfully" });
  } catch (error) {
    console.error("Error adding reply:", error);
    res.status(500).json({ message: "Error adding reply" });
  }
});

