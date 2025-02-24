require("dotenv").config({path: "./.env"});


const config = require("./config.json");
const mongoose = require("mongoose");

const User = require("./models/user.model");
const Order = require("./models/order.model");

mongoose.connect(config.connectionString, { useNewUrlParser: true, useUnifiedTopology: true })
.then(() => console.log("MongoDB connected"))
.catch(err => console.error("MongoDB connection erro:", err));

//mongoose.connect(config.connectionString);

const express = require("express");
const cors = require("cors");
const app = express();
const port = process.env.PORT || 4000;



const jwt = require("jsonwebtoken");
const { authenticateToken } = require("./utilities");

app.use(express.json())

app.use(
    cors({
        origin: "*",
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
  

// app.post("/job-response/:orderId", authenticateToken, async (req, res) => {
// const { orderId } = req.params;
// const { applicantId, action } = req.body;

// try {
//     const order = await Order.findById(orderId);

//     if (!order) {
//         return res.status(404).json({ error: true, message: "Job not found" });
//     }

//     if (order.userId.toString() !== req.user._id) {
//         return res.status(403).json({ error: true, message: "You are not authorized to respond to this job" });
//     }

//     if (action === "accept") {
//         order.acceptedBy = applicantId;
//         order.status = "Accepted";
//         await order.save();

//         // Notify the applicant
//         const notification = new Notification({
//             userId: applicantId,
//             orderId: order._id,
//             message: `Your application for the job "${order.title}" has been accepted.`,
//         });
//         await notification.save();
//     } else if (action === "reject") {
//         order.applicants = order.applicants.filter((id) => id.toString() !== applicantId);
//         await order.save();

//         // Notify the applicant
//         const notification = new Notification({
//             userId: applicantId,
//             orderId: order._id,
//             message: `Your application for the job "${order.title}" has been rejected.`,
//         });
//         await notification.save();
//     }

//     res.json({ error: false, message: `Job application ${action}ed successfully` });
// } catch (error) {
//     console.error("Error responding to job application:", error);
//     res.status(500).json({ error: true, message: "Internal server error" });
// }
// });

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

  
  


app.listen(8000);

module.exports = app;

