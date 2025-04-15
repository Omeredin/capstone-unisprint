  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Request Card */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <img 
                src={request.user?.profilePicture || "https://via.placeholder.com/40"} 
                alt="Profile" 
                className="w-10 h-10 rounded-full"
              />
              <div>
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                  {request.user?.fullName}
                </h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {request.user?.major} • {request.user?.year}
                </p>
              </div>
            </div>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              {new Date(request.createdAt).toLocaleDateString()}
            </span>
          </div>

          <div className="mb-4">
            <h1 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
              {request.title}
            </h1>
            <p className="text-gray-700 dark:text-gray-300">
              {request.description}
            </p>
          </div>

          <div className="flex items-center justify-between border-t border-gray-200 dark:border-gray-700 pt-4">
            <div className="flex items-center space-x-4">
              <button 
                onClick={handleReply}
                className="flex items-center space-x-1 text-gray-600 dark:text-gray-400 hover:text-blue-500 dark:hover:text-blue-400"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
                <span>{request.replies?.length || 0} Replies</span>
              </button>
            </div>
            <button
              onClick={handleAccept}
              className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-md transition-colors"
            >
              Accept Request
            </button>
          </div>
        </div>

        {/* Replies Section */}
        <div className="space-y-4">
          {request.replies?.map((reply) => (
            <div key={reply._id} className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <img 
                    src={reply.user?.profilePicture || "https://via.placeholder.com/40"} 
                    alt="Profile" 
                    className="w-10 h-10 rounded-full"
                  />
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                      {reply.user?.fullName}
                    </h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {reply.user?.major} • {reply.user?.year}
                    </p>
                  </div>
                </div>
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  {new Date(reply.createdAt).toLocaleDateString()}
                </span>
              </div>
              <p className="text-gray-700 dark:text-gray-300">
                {reply.content}
              </p>
            </div>
          ))}
        </div>

        {/* Reply Modal */}
        {showReplyModal && (
          <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center p-4">
            <div className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md">
              <h2 className="text-xl font-bold mb-4 text-gray-900 dark:text-white">Reply to Request</h2>
              <textarea
                value={replyContent}
                onChange={(e) => setReplyContent(e.target.value)}
                className="w-full h-32 p-2 border rounded-md mb-4 text-gray-900 dark:text-white dark:bg-gray-700"
                placeholder="Type your reply here..."
              />
              <div className="flex justify-end space-x-2">
                <button
                  onClick={() => setShowReplyModal(false)}
                  className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200"
                >
                  Cancel
                </button>
                <button
                  onClick={submitReply}
                  className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
                >
                  Submit Reply
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  ); 