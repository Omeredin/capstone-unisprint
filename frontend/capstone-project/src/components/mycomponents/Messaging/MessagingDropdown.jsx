"use client"

import { useState, useEffect } from "react"
import { Link, useNavigate } from "react-router-dom"
import axiosInstance from "@/utils/axiosInstance"

const MessagingDropdown = () => {
  const [unreadCount, setUnreadCount] = useState(0)
  const [error, setError] = useState(null)
  const navigate = useNavigate()

  useEffect(() => {
    // Check for unread messages every 30 seconds
    const interval = setInterval(() => {
      checkUnreadMessages()
    }, 30000)

    // Initial check
    checkUnreadMessages()

    return () => clearInterval(interval)
  }, [])

  const checkUnreadMessages = async () => {
    try {
      const token = localStorage.getItem("token")
      if (!token) {
        setError("No authentication token found")
        navigate("/login")
        return
      }

      const response = await axiosInstance.get("/unread-message-count")
      setUnreadCount(response.data.count)
    } catch (error) {
      console.error("Error checking unread messages:", error)
    }
  }

  return (
    <Link
      to="/messages"
      className="relative flex items-center text-white rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 dark:text-black md:dark:hover:text-blue-500 dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent"
    >
      Messages
      {unreadCount > 0 && (
        <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
          {unreadCount}
        </span>
      )}
    </Link>
  )
}

export default MessagingDropdown





