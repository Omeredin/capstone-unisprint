import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axiosInstance from '@/utils/axiosInstance';
import { toast } from 'react-hot-toast';

const RequestDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [request, setRequest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showReplyModal, setShowReplyModal] = useState(false);
  const [replyContent, setReplyContent] = useState('');

  useEffect(() => {
    fetchRequestDetails();
  }, [id]);

  const fetchRequestDetails = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get(`/get-order/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
      });
      setRequest(response.data.order);
    } catch (error) {
      console.error('Error fetching request details:', error);
      toast.error('Failed to load request details');
    } finally {
      setLoading(false);
    }
  };

  const handleReply = () => {
    if (!localStorage.getItem('token')) {
      toast.error('Please login to reply');
      navigate('/login');
      return;
    }
    setShowReplyModal(true);
  };

  const submitReply = async () => {
    try {
      await axiosInstance.post(
        '/add-reply',
        {
          orderId: id,
          content: replyContent,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
      toast.success('Reply added successfully');
      setReplyContent('');
      setShowReplyModal(false);
      fetchRequestDetails(); // Refresh the request details to show the new reply
    } catch (error) {
      console.error('Error submitting reply:', error);
      toast.error('Failed to submit reply');
    }
  };

  const handleAccept = async () => {
    try {
      await axiosInstance.post(
        `/apply-job/${id}`,
        {},
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token')}`,
          },
        }
      );
      toast.success('Request accepted successfully');
      navigate('/home');
    } catch (error) {
      console.error('Error accepting request:', error);
      toast.error('Failed to accept request');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900 py-8">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center">Loading...</div>
        </div>
      </div>
    );
  }

  if (!request) {
    return (
      <div className="min-h-screen bg-gray-100 dark:bg-gray-900 py-8">
        <div className="max-w-4xl mx-auto px-4">
          <div className="text-center">Request not found</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Request Card */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6 mb-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                <span className="text-gray-600">{request.userName?.[0]?.toUpperCase() || 'U'}</span>
              </div>
              <div>
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                  {request.userName || 'Unknown User'}
                </h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {request.category} • {request.location}
                </p>
              </div>
            </div>
            <span className="text-sm text-gray-500 dark:text-gray-400">
              {new Date(request.datePosted).toLocaleDateString()}
            </span>
          </div>

          <div className="mb-4">
            <h1 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
              {request.title}
            </h1>
            <p className="text-gray-700 dark:text-gray-300">
              {request.content}
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
                  <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center">
                    <span className="text-gray-600">{reply.userName?.[0]?.toUpperCase() || 'U'}</span>
                  </div>
                  <div>
                    <h2 className="text-lg font-semibold text-gray-900 dark:text-white">
                      {reply.userName || 'Unknown User'}
                    </h2>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {new Date(reply.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                </div>
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
};

export default RequestDetails; 