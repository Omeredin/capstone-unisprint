"use client"

import { useState, useEffect, useRef } from "react"
import Navbar from "../../components/mycomponents/Navbar/Navbar"
import axiosInstance from "@/utils/axiosInstance"
import { Send, Search, UserPlus, ArrowLeft, MessageSquare } from "lucide-react"
import { useNavigate } from "react-router-dom"

const Messages = () => {
  const [conversations, setConversations] = useState([])
  const [activeConversation, setActiveConversation] = useState(null)
  const [messages, setMessages] = useState([])
  const [newMessage, setNewMessage] = useState("")
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState([])
  const [isSearching, setIsSearching] = useState(false)
  const [showSearchResults, setShowSearchResults] = useState(false)
  const [showUserSearch, setShowUserSearch] = useState(false)
  const [unreadCount, setUnreadCount] = useState(0)
  const messagesEndRef = useRef(null)
  const navigate = useNavigate()

  useEffect(() => {
    fetchConversations()
    checkUnreadMessages()
  }, [])

  useEffect(() => {
    if (activeConversation) {
      fetchMessages(activeConversation)
      markAsRead(activeConversation)

      // Set up polling for new messages
      const interval = setInterval(() => {
        fetchMessages(activeConversation)
      }, 5000)

      return () => clearInterval(interval)
    }
  }, [activeConversation])

  // Scroll to bottom of messages when they change
  useEffect(() => {
    scrollToBottom()
  }, [messages])

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

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

  const fetchConversations = async () => {
    try {
      setLoading(true)
      const token = localStorage.getItem("token")
      if (!token) {
        setError("No authentication token found")
        setLoading(false)
        navigate("/login")
        return
      }

      const response = await axiosInstance.get("/conversations")
      setConversations(response.data.conversations || [])

      // Set the first conversation as active if there is one and none is selected
      if (response.data.conversations && response.data.conversations.length > 0 && !activeConversation) {
        setActiveConversation(response.data.conversations[0]._id)
      }

      setLoading(false)
    } catch (error) {
      console.error("Error fetching conversations:", error)
      setError(error.response?.data?.message || "Error fetching conversations")
      setLoading(false)
    }
  }

  const fetchMessages = async (conversationId) => {
    try {
      const token = localStorage.getItem("token")
      if (!token) {
        setError("No authentication token found")
        navigate("/login")
        return
      }

      const response = await axiosInstance.get(`/messages/${conversationId}`)
      setMessages(response.data.messages || [])
    } catch (error) {
      console.error("Error fetching messages:", error)
      setError(error.response?.data?.message || "Error fetching messages")
    }
  }

  const markAsRead = async (conversationId) => {
    try {
      const token = localStorage.getItem("token")
      if (!token) {
        setError("No authentication token found")
        navigate("/login")
        return
      }

      await axiosInstance.post(`/mark-messages-read/${conversationId}`)
      checkUnreadMessages() // Update unread count
    } catch (error) {
      console.error("Error marking messages as read:", error)
    }
  }

  const sendMessage = async (e) => {
    e.preventDefault()
    if (!newMessage.trim() || !activeConversation) return

    try {
      const token = localStorage.getItem("token")
      if (!token) {
        setError("No authentication token found")
        navigate("/login")
        return
      }

      await axiosInstance.post("/send-message", {
        conversationId: activeConversation,
        content: newMessage,
      })
      setNewMessage("")
      fetchMessages(activeConversation)
    } catch (error) {
      console.error("Error sending message:", error)
      setError(error.response?.data?.message || "Error sending message")
    }
  }

  const searchUsers = async () => {
    if (!searchQuery.trim()) return
    
    try {
      setIsSearching(true)
      setError(null) // Clear any previous errors
      const token = localStorage.getItem("token")
      if (!token) {
        setError("No authentication token found")
        navigate("/login")
        return
      }

      const response = await axiosInstance.get(`/search-users?query=${encodeURIComponent(searchQuery)}`)
      setSearchResults(response.data.users || [])
      setShowSearchResults(true)
      setIsSearching(false)
    } catch (error) {
      console.error("Error searching users:", error)
      setError(error.response?.data?.message || "Error searching users")
      setIsSearching(false)
    }
  }

  // Handle Enter key press in search input
  const handleSearchKeyPress = (e) => {
    if (e.key === 'Enter') {
      searchUsers();
    }
  };

  const startConversation = async (userId) => {
    try {
      const token = localStorage.getItem("token")
      if (!token) {
        setError("No authentication token found")
        navigate("/login")
        return
      }

      const response = await axiosInstance.post("/start-conversation", {
        recipientId: userId,
        initialMessage: "Hello! I'd like to connect with you."
      })

      // Refresh conversations to include the new one
      fetchConversations()
      
      // Set the new conversation as active
      if (response.data.conversationId) {
        setActiveConversation(response.data.conversationId)
      }
      
      // Hide search results
      setShowSearchResults(false)
      setShowUserSearch(false)
      setSearchQuery("")
    } catch (error) {
      console.error("Error starting conversation:", error)
      setError(error.response?.data?.message || "Error starting conversation")
    }
  }

  const formatTime = (timestamp) => {
    const date = new Date(timestamp)
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })
  }

  const formatDate = (timestamp) => {
    const date = new Date(timestamp)
    return date.toLocaleDateString()
  }

  const getActiveConversationName = () => {
    if (!activeConversation) return ""
    const conversation = conversations.find((c) => c._id === activeConversation)
    return conversation ? conversation.otherUser.fullName : ""
  }

  const toggleUserSearch = () => {
    setShowUserSearch(!showUserSearch)
    setShowSearchResults(false)
    setSearchQuery("")
  }

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="flex justify-center items-center h-screen">
          <p>Loading messages...</p>
        </div>
      </>
    )
  }

  return (
    <>
      <Navbar />
      <div className="container mx-auto mt-8 px-4">
        <h1 className="text-2xl font-bold mb-6">Messages</h1>

        {error ? (
          <div className="p-4 text-red-500 text-center border rounded-lg">{error}</div>
        ) : (
          <div className="flex h-[calc(100vh-200px)] border rounded-lg overflow-hidden">
            {/* Conversations sidebar */}
            <div className={`${showUserSearch ? 'w-1/4' : 'w-1/4'} border-r bg-gray-50 overflow-y-auto transition-all duration-300`}>
              <div className="p-4 border-b bg-gray-100 flex justify-between items-center">
                <h2 className="font-semibold">Conversations</h2>
                <button 
                  onClick={toggleUserSearch}
                  className="bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600 flex items-center"
                >
                  {showUserSearch ? <ArrowLeft className="w-4 h-4 mr-1" /> : <UserPlus className="w-4 h-4 mr-1" />}
                  {showUserSearch ? "Back" : "New Message"}
                </button>
              </div>
              
              {showUserSearch ? (
                <div className="p-4">
                  <h3 className="font-medium mb-2">Search Users</h3>
                  <div className="flex items-center mb-4">
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      onKeyPress={handleSearchKeyPress}
                      placeholder="Search by name or email..."
                      className="flex-1 p-2 border rounded-l-md focus:outline-none focus:ring-1 focus:ring-blue-500 text-black"
                    />
                    <button
                      onClick={searchUsers}
                      className="bg-blue-500 text-white p-2 rounded-r-md hover:bg-blue-600"
                      disabled={isSearching}
                    >
                      {isSearching ? (
                        <span className="animate-pulse">Searching...</span>
                      ) : (
                        <Search className="w-5 h-5" />
                      )}
                    </button>
                  </div>
                  
                  {/* Search results */}
                  {showSearchResults && (
                    <div className="border rounded-md overflow-y-auto max-h-[calc(100vh-350px)]">
                      {isSearching ? (
                        <div className="p-4 text-black text-center">Searching...</div>
                      ) : searchResults.length === 0 ? (
                        <div className="p-4 text-black text-center">No users found</div>
                      ) : (
                        searchResults.map((user) => (
                          <div 
                            key={user._id} 
                            className="p-4 border-b hover:bg-gray-100 flex justify-between items-center"
                          >
                            <div>
                              <div className="font-medium text-black">{user.fullName}</div>
                              <div className="text-sm text-black">{user.email}</div>
                              {user.major && (
                                <div className="text-xs text-black">
                                  {user.major} • {user.year ? `Year ${user.year}` : ''}
                                </div>
                              )}
                            </div>
                            <button
                              onClick={() => startConversation(user._id)}
                              className="bg-green-500 text-white p-2 rounded-md hover:bg-green-600 flex items-center"
                              title="Start conversation"
                            >
                              <MessageSquare className="w-4 h-4 mr-1" />
                              Message
                            </button>
                          </div>
                        ))
                      )}
                    </div>
                  )}
                </div>
              ) : (
                <>
                  {conversations.length === 0 ? (
                    <div className="p-4 text-gray-500 text-center">
                      <p className="mb-2">No conversations yet</p>
                      <button 
                        onClick={toggleUserSearch}
                        className="bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600 flex items-center mx-auto"
                      >
                        <UserPlus className="w-4 h-4 mr-1" />
                        Start a Conversation
                      </button>
                    </div>
                  ) : (
                    conversations.map((conv) => (
                      <div
                        key={conv._id}
                        className={`p-4 border-b cursor-pointer hover:bg-gray-100 ${
                          activeConversation === conv._id ? "bg-blue-50 border-l-4 border-blue-500" : ""
                        }`}
                        onClick={() => setActiveConversation(conv._id)}
                      >
                        <div className="font-medium">{conv.otherUser.fullName}</div>
                        <div className="text-sm text-gray-500 truncate">
                          {conv.lastMessage ? conv.lastMessage.content : "Start a conversation"}
                        </div>
                        <div className="text-xs text-gray-400 mt-1">
                          {conv.lastMessage ? formatDate(conv.lastMessage.createdAt) : ""}
                        </div>
                        {conv.unreadCount > 0 && (
                          <span className="inline-block bg-blue-500 text-white text-xs rounded-full px-2 py-0.5 mt-1">
                            {conv.unreadCount} new
                          </span>
                        )}
                      </div>
                    ))
                  )}
                </>
              )}
            </div>

            {/* Messages area */}
            <div className="w-3/4 flex flex-col">
              {activeConversation ? (
                <>
                  <div className="p-4 border-b bg-white flex justify-between items-center">
                    <h2 className="font-semibold">{getActiveConversationName()}</h2>
                    <button 
                      onClick={toggleUserSearch}
                      className="bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600 flex items-center"
                    >
                      <UserPlus className="w-4 h-4 mr-1" />
                      New Message
                    </button>
                  </div>

                  <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50">
                    {messages.length === 0 ? (
                      <div className="text-center text-gray-500 mt-8">No messages yet. Start a conversation!</div>
                    ) : (
                      messages.map((msg) => (
                        <div
                          key={msg._id}
                          className={`max-w-[70%] p-3 rounded-lg ${
                            msg.isSender ? "bg-blue-500 text-black ml-auto" : "bg-white text-gray-800 border"
                          }`}
                        >
                          <div>{msg.content}</div>
                          <div
                            className={`text-xs ${msg.isSender ? "text-gray-700" : "text-gray-500"} text-right mt-1`}
                          >
                            {formatTime(msg.createdAt)}
                          </div>
                        </div>
                      ))
                    )}
                    <div ref={messagesEndRef} />
                  </div>

                  <form onSubmit={sendMessage} className="p-3 border-t bg-white flex">
                    <input
                      type="text"
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      placeholder="Type a message..."
                      className="flex-1 p-2 border rounded-l-md focus:outline-none focus:ring-1 focus:ring-blue-500"
                    />
                    <button
                      type="submit"
                      className="bg-blue-500 text-white p-2 rounded-r-md hover:bg-blue-600 flex items-center justify-center"
                    >
                      <Send className="w-5 h-5 mr-1" />
                      Send
                    </button>
                  </form>
                </>
              ) : (
                <div className="flex flex-col items-center justify-center h-full text-gray-500">
                  {conversations.length > 0 ? (
                    "Select a conversation to start messaging"
                  ) : (
                    <>
                      <p className="mb-4">You have no conversations yet</p>
                      <button 
                        onClick={toggleUserSearch}
                        className="bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600 flex items-center"
                      >
                        <UserPlus className="w-4 h-4 mr-1" />
                        Start a Conversation
                      </button>
                    </>
                  )}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </>
  )
}

export default Messages