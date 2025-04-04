'use client'
import React, { useState, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import Navbar from '../Navbar/Navbar'
import axiosInstance from '../../../utils/axiosInstance';
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { MapPin, GraduationCap, Mail } from 'lucide-react'
import OrderCard from '../Cards/OrderCard'
import axios from 'axios';
import { BASE_URL } from '@/utils/constants';

const ProfileInfo = () => {
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  // const [acceptedJobs, setAcceptedJobs] = useState([]);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();
  const [isEditing, setIsEditing] = useState(false); // For showing the edit pop-up
  const [editData, setEditData] = useState({});

  
  useEffect(() => {
    if (location.state && location.state.newPost) {
      setPosts(prevPosts => [location.state.newPost, ...prevPosts]);
    }
  }, [location.state]);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) {
          setError("No authentication token found");
          navigate("/login");
          return;
        }
        axiosInstance.get(`${BASE_URL}/profile`, {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        })
        .then(response => {
          setUser(response.data.user); // Set the fetched user data
        })
        
        const [profileResponse, postsResponse] = await Promise.all([
          axiosInstance.get("/profile", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axiosInstance.get("/get-user-all-orders", {
            headers: { Authorization: `Bearer ${token}` },
          })
        ]);

        // setUser(profileResponse.data.user);
        setPosts(postsResponse.data.orders); // Updated to match the backend response
        setIsLoading(false);
        
        console.log("Posts Response:", postsResponse.data);

      } catch (err) {
        console.error("Profile fetch error:", err);
        setError(err.response?.data?.message || err.message || "Error fetching profile");
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, [navigate]);

  if (isLoading) {
    return (
      <>
        <Navbar />
        <div className="flex justify-center items-center h-screen">
          <p>Loading profile...</p>
        </div>
      </>
    );
  }

  if (error) {
    return (
      <>
        <Navbar />
        <div className="flex justify-center items-center h-screen text-red-500">
          <p>{error}</p>
        </div>
      </>
    );
  }

  // const handleResponse = async (orderId, applicantId, action) => {
  //   try {
  //     await axiosInstance.post(
  //       `/job-response/${orderId}`,
  //       { applicantId, action },
  //       { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
  //     );
  //     toast.success(`Application ${action}ed successfully`);
  //   } catch (error) {
  //     toast.error(error.response?.data?.message || "Error responding to application");
  //   }
  // };

  const handleDeletePost = async (orderId) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("No authentication token found");
        navigate("/login");
        return;
      }
      
      await axiosInstance.delete(`${BASE_URL}/delete-order/${orderId}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      
      // Remove the deleted post from the state
      setPosts(posts.filter(post => post._id !== orderId));
    } catch (err) {
      console.error("Error deleting post:", err);
      setError(err.response?.data?.message || err.message || "Error deleting post");
    }
  };

  const handleEditPost = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("No authentication token found");
        navigate("/login");
        return;
      }
      
      await axiosInstance.put(
        `${BASE_URL}/edit-order/${editData._id}`,
        editData,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        }
      );
      
      // Update the post in the state
      setPosts(posts.map(post => 
        post._id === editData._id ? { ...post, ...editData } : post
      ));
      
      // Close the edit popup
      setIsEditing(false);
    } catch (err) {
      console.error("Error editing post:", err);
      setError(err.response?.data?.message || err.message || "Error editing post");
    }
  };

  const handleEdit = (post) => {
    setEditData(post); // Load the post data into the state
    setIsEditing(true); // Show the edit form
  };

  // Handle form changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditData((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <>
      <Navbar />
      <div className='flex flex-col items-center mt-10 space-y-6'>
        <Card className="w-full max-w-md overflow-hidden transition-all hover:shadow-lg">
          <CardHeader className="border-b bg-muted/50 p-6">
            <div className="flex items-center space-x-4">
              <Avatar className="h-20 w-20">
                <AvatarImage src={user.profilePicture || "#"} alt={user.name} />
                <AvatarFallback>{user.fullName?.charAt(0) || 'K'}</AvatarFallback>
              </Avatar>
              </div>
              <div>
                <h2 className="text-black text-2xl font-bold">{user.fullName}</h2>
                <Badge>{user.year}</Badge>
              </div>
            </CardHeader>
            <CardContent className="grid gap-4 p-6">
              <div className="flex items-center space-x-2 text-sm">
                <GraduationCap className="h-4 w-4 text-muted-foreground" />
                <span>{user.major}</span>
              </div>
              <div className="flex items-center space-x-2 text-sm">
                <MapPin className="h-4 w-4 text-muted-foreground" />
                <span>{user.hometown}</span>
              </div>
              <div className="flex items-center space-x-2 text-sm">
                <Mail className="h-4 w-4 text-muted-foreground" />
                <a href={`mailto:${user.email}`} className="text-primary hover:underline">
                  {user.email}
                </a>
              </div>
            </CardContent>
          </Card>
        

          <h3 className="text-2xl font-bold mb-4">My Posts</h3>
        <div className="flex justify-center space-x-5">
          {posts.length === 0 ? (
            <p>No posts yet.</p>
          ) : (
            posts.map((post) => (
              <div>
              <OrderCard
                key={post._id}
                title={post.title}
                date={post.datePosted}
                content={post.content}
                category={post.category}
                location={post.location}
                price={post.payment}
                urgency={post.urgency}
              />

              <button
                    onClick={() => handleDeletePost(post._id)}
                    className="mt-2 bg-red-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded-md"
                  >
                    Delete
                  </button>
                  <button
                    onClick={() => handleEdit(post)}
                    className="mt-2 bg-blue-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded-md"
                  >
                    Edit
                  </button>
                  </div>
              
            ))
          )}
        </div>

      </div>
      {isEditing && (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center z-50">
        <div className="bg-white rounded-lg shadow-lg w-11/12 md:w-1/2 p-6 relative text-black">
            <h2 className="text-2xl font-semibold text-gray-800 mb-4">Edit Post</h2>
            <form onSubmit={handleEditPost}>
                <div className="mb-4">
                    <label className="block text-gray-700 font-medium mb-2">
                        Title:
                    </label>
                    <input
                        type="text"
                        name="title"
                        value={editData.title || ""}
                        onChange={handleChange}
                        className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700 font-medium mb-2">
                        Content:
                    </label>
                    <textarea
                        name="content"
                        value={editData.content || ""}
                        onChange={handleChange}
                        className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700 font-medium mb-2">
                        Category:
                    </label>
                    <input
                        type="text"
                        name="category"
                        value={editData.category || ""}
                        onChange={handleChange}
                        className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700 font-medium mb-2">
                        Payment:
                    </label>
                    <input
                        type="number"
                        name="payment"
                        value={editData.payment || ""}
                        onChange={handleChange}
                        className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700 font-medium mb-2">
                        Location:
                    </label>
                    <input
                        type="text"
                        name="location"
                        value={editData.location || ""}
                        onChange={handleChange}
                        className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                    />
                </div>
                <div className="mb-4 flex items-center">
                    <label className="text-gray-700 font-medium mr-2">
                        Urgency:
                    </label>
                    <input
                        type="checkbox"
                        name="urgency"
                        checked={editData.urgency || false}
                        onChange={(e) =>
                            setEditData((prev) => ({
                                ...prev,
                                urgency: e.target.checked,
                            }))
                        }
                        className="w-4 h-4"
                    />
                </div>
                <div className="mb-4">
                    <label className="block text-gray-700 font-medium mb-2">
                        Duration:
                    </label>
                    <input
                        type="number"
                        name="duration"
                        value={editData.duration || ""}
                        onChange={handleChange}
                        className="w-full border border-gray-300 rounded-md p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                    />
                </div>
                <div className="flex justify-end space-x-4">
                    <button
                        type="button"
                        onClick={() => setIsEditing(false)}
                        className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600"
                    >
                        Cancel
                    </button>
                    <button
                        type="submit"
                        className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
                    >
                        Save
                    </button>
                </div>
            </form>
        </div>
    </div>
)}

      {/* <div>
      <h3>Applicants</h3>
      <ul>
        {posts.applicants.map((applicant) => (
          <li key={applicant._id}>
            {applicant.fullName}
            <button onClick={() => handleResponse(applicant._id, "accept")}>Accept</button>
            <button onClick={() => handleResponse(applicant._id, "reject")}>Reject</button>
          </li>
        ))}
      </ul>
    </div> */}
    </>
  )
}

export default ProfileInfo

