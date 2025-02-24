import React, { useEffect, useState } from "react";
import axios from "axios";
import axiosInstance from '@/utils/axiosInstance';
import Navbar from "@/components/mycomponents/Navbar/Navbar";
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { CheckCircle, XCircle, Clock } from 'lucide-react'

function Notifications() {
    const [notifications, setNotifications] = useState([]);

    useEffect(() => {
        const fetchNotifications = async () => {
            try {
                const response = await axiosInstance.get("http://localhost:8000/notifications", {
                    headers: {
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                });
                setNotifications(response.data.notifications);
            } catch (error) {
                console.error("Error fetching notifications:", error);
            }
        };

        fetchNotifications();
    }, []);

    const handleResponse = async (notificationId, action) => {
        try {
            const response = await axios.post(
                `http://localhost:8000/notifications/${notificationId}/respond`,
                { action },
                { headers: { Authorization: `Bearer ${localStorage.getItem("token")}` } }
            );
            console.log(response.data.message);
            // Update the notifications list after responding
            setNotifications((prev) =>
                prev.filter((notification) => notification._id !== notificationId)
            );
        } catch (error) {
            console.error("Error responding to notification:", error.response?.data || error.message);
        }
    };

    return (
       <>
       <Navbar />
       <div className="flex justify-center mt-5 mb-10 text-3xl">
            <h1 className="">Notifications</h1></div>
       <div> 
            {notifications.length === 0 ? (
                <p>No notifications yet.</p>
            ) : (
                <ul className="flex flex-row justify-center space-x-5">
                    {notifications.map((notification) => (
                        <li key={notification._id} className="mb-5 w-max h-max">
                            
                            <Card className="w-full max-w-md overflow-hidden transition-all hover:shadow-lg">
      <CardContent className="p-4">
        <div className="flex items-center space-x-4">
          <Avatar className="h-12 w-12">
            <AvatarImage/>
            <AvatarFallback></AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-900 truncate">
              {notification.message}
            </p>
            <p className="text-sm text-gray-500 ">
            {notification.message}
            </p>
          </div>
        </div>
      </CardContent>
      <CardFooter className="bg-gray-50 px-4 py-3 sm:px-6">
        {notification.type === "application" && (<div className="flex justify-center space-x-2 w-full">
            <Button
              variant="outline"
              className="w-full sm:w-auto"
              onClick={() => handleResponse(notification._id, "reject")}
            >
              <XCircle className="h-4 w-4 mr-2" />
              Reject
            </Button>
            <Button
              className="w-full sm:w-auto"
              onClick={() => handleResponse(notification._id, "accept")}
            >
              <CheckCircle className="h-4 w-4 mr-2" />
              Accept
            </Button>
          </div>)} {notification.type === "response" && (<div>Application update</div>)}
          
      </CardFooter>
    </Card>
                        </li>
                    ))}
                </ul>
            )}
            
    
        </div></>
    );
}

export default Notifications;
