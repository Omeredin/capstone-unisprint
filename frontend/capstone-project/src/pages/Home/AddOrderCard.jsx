import React, { useState } from 'react';
import axiosInstance from '@/utils/axiosInstance';
import Navbar from '@/components/mycomponents/Navbar/Navbar';
import { useNavigate } from 'react-router-dom';


const AddOrderCard = () => {
    const [title, setTitle] = useState("");
    const [content, setContent] = useState("");
    const [category, setCategory] = useState("");
    const [location, setLocation] = useState("");
    const [payment, setPayment] = useState(0);
    const [urgency, setUrgency] = useState(false);
    const [duration, setDuration] = useState(0);
    const [isSubmitting, setIsSubmitting] = useState(false); // Prevents double submissions

    const navigate = useNavigate();

    const handleCreateOrder = async (e) => {
        e.preventDefault(); // Prevent form reload


        if (!title || !content || !category || !location || payment <= 0 || duration <= 0) {
            alert("Please fill in all required fields with valid data.");
            return;
        }

        const newPost = {
            title,
            content,
            category,
            location,
            payment: Number(payment), // Convert to a number
            urgency,
            duration: Number(duration), // Convert to a number
            createdBy: localStorage.getItem('userId')
        };

        try {
            setIsSubmitting(true); // Disable the button to prevent multiple submissions
            const token = localStorage.getItem("token");

            if (!token) {
                alert("You must be logged in to post a job.");
                return;
            }

            const response = await axiosInstance.post("/add-order", newPost, {
                headers: { Authorization: `Bearer ${token}` },
            });
            if (response.data.error) {
                throw new Error(response.data.message || "Failed to create post");
            }

            console.log("Post created successfully:", response.data);
            alert("Job posted successfully!");

            // Navigate to profile page after post is successful
            navigate('/profile', { state: { newPost: response.data.order } });
        } catch (error) {
            console.error("Error creating order:", error);
            alert(error.message || "Failed to create post. Please try again.");
        } finally {
            setIsSubmitting(false); // Re-enable the submit button
        }
    };

    return (
        <>
            <Navbar />

            <div className="flex items-center justify-center">
                <div className="bg-white rounded-lg shadow-lg w-full max-w-lg p-6 relative">
                    <h2 className="text-2xl font-semibold text-gray-800 mb-4">Post a Job</h2>

                    <form onSubmit={handleCreateOrder}>
                        {/* Job Title */}
                        <label className="block mb-2 text-gray-600">Job Title</label>
                        <input
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            required
                            placeholder="e.g., Math Tutoring for Calculus II"
                            className="text-black w-full border border-gray-300 rounded-md p-2 mb-4"
                        />

                        {/* Job Description */}
                        <label className="block mb-2 text-gray-600">Job Description</label>
                        <textarea
                            placeholder="Describe the task you need help with"
                            className="text-black w-full border border-gray-300 rounded-md p-2 mb-4"
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            required
                        ></textarea>

                        {/* Category */}
                        <label className="block mb-2 text-gray-600">Category</label>
                        <select
                            className="text-black w-full border border-gray-300 rounded-md p-2 mb-4"
                            value={category}
                            onChange={(e) => setCategory(e.target.value)}
                            required
                        >
                            <option value="">Select a category</option>
                            <option value="Tutoring">Tutoring</option>
                            <option value="Food Delivery">Food Delivery</option>
                            <option value="Tech Help">Tech Help</option>
                            <option value="Moving Services">Moving Services</option>
                            <option value="Other">Other</option>
                        </select>

                        {/* Location */}
                        <label className="block mb-2 text-gray-600">Location</label>
                        <input
                            type="text"
                            placeholder="e.g., Library, Study Room B"
                            className="text-black w-full border border-gray-300 rounded-md p-2 mb-4"
                            value={location}
                            onChange={(e) => setLocation(e.target.value)}
                            required
                        />

                        {/* Duration */}
                        <label className="block mb-2 text-gray-600">Duration (in hours)</label>
                        <input
                            type="number"
                            placeholder="e.g., 1"
                            className="text-black w-full border border-gray-300 rounded-md p-2 mb-4"
                            value={duration}
                            onChange={(e) => setDuration(e.target.value)}
                            required
                        />

                        {/* Payment */}
                        <label className="block mb-2 text-gray-600">Payment</label>
                        <input
                            type="number"
                            placeholder="e.g., 15"
                            className="text-black w-full border border-gray-300 rounded-md p-2 mb-4"
                            value={payment}
                            onChange={(e) => setPayment(e.target.value)}
                            required
                        />

                        {/* Urgency Checkbox */}
                        <label className="inline-flex items-center mt-4">
                            <input
                                type="checkbox"
                                className="form-checkbox text-red-500"
                                checked={urgency}
                                onChange={(e) => setUrgency(e.target.checked)}
                            />
                            <span className="ml-2 text-gray-700">Mark as Urgent</span>
                        </label>

                        {/* Submit Button */}
                        <button
                            type="submit"
                            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-md mt-6"
                            disabled={isSubmitting}
                        >
                            {isSubmitting ? 'Posting...' : 'Post Job'}
                        </button>
                    </form>
                </div>
            </div>
        </>
    );
};

export default AddOrderCard;



