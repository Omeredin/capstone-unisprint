import React, { useState } from 'react'
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { CalendarDays, MapPin, AlertTriangle, DollarSign, MessageCircle } from 'lucide-react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import axiosInstance from '@/utils/axiosInstance'
import { useNavigate } from 'react-router-dom'

const OrderCard = ({ title, date, content, category, price, urgency, location, name, orderId, replies: initialReplies = [] }) => {
  const [isReplyModalOpen, setIsReplyModalOpen] = useState(false)
  const [replyText, setReplyText] = useState('')
  const [replies, setReplies] = useState(initialReplies)
  const navigate = useNavigate()

  const handleCardClick = () => {
    navigate(`/request/${orderId}`)
  }

  const handleReply = async (e) => {
    e.stopPropagation() // Prevent card click when clicking reply button
    try {
      await axiosInstance.post('/add-reply', {
        orderId,
        content: replyText
      })
      // Fetch updated replies
      const response = await axiosInstance.get(`/get-order/${orderId}`)
      setReplies(response.data.order.replies)
      setReplyText('')
      setIsReplyModalOpen(false)
    } catch (error) {
      console.error('Error adding reply:', error)
    }
  }

  return (
    <>
      <Card 
        className="w-full max-w-md overflow-hidden transition-all hover:shadow-lg cursor-pointer" 
        onClick={handleCardClick}
      >
        <CardHeader className="border-b bg-muted/50 p-4">
          <div className="flex justify-between items-center">
            <h3 className="text-xl font-bold">{title}</h3>
            <Badge variant="outline" className="text-sm">
              {category}
            </Badge>
          </div>
          <div className="flex items-center text-sm text-muted-foreground mt-2">
            <CalendarDays className="h-4 w-4 mr-1" />
            {new Date(date).toLocaleDateString()}
          </div>
          <p>{name}</p>
        </CardHeader>
        <CardContent className="p-4">
          <p className="text-sm text-muted-foreground mb-4">{content}</p>
          <div className="flex flex-wrap gap-3 text-sm mb-4">
            <div className="flex items-center">
              <DollarSign className="h-4 w-4 text-green-600 mr-1" />
              <span className="font-semibold">${price}</span>
            </div>
            <div className="flex items-center">
              <MapPin className="h-4 w-4 text-blue-600 mr-1" />
              <span>{location}</span>
            </div>
            <div className="flex items-center">
              <AlertTriangle className="h-4 w-4 text-yellow-600 mr-1" />
              <Badge className={urgency}>
                {urgency ? "Urgent" : "Not Urgent"}
              </Badge>
            </div>
          </div>
          {/* Display Replies */}
          {replies && replies.length > 0 && (
            <div className="mt-4 border-t pt-4">
              <h4 className="text-sm font-semibold mb-2">Replies:</h4>
              <div className="space-y-2">
                {replies.map((reply, index) => {
                  // Format the date - MongoDB stores dates in ISO format
                  const date = new Date(reply._doc?.createdAt || reply.createdAt);
                  const dateString = !isNaN(date.getTime())
                    ? date.toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit'
                      })
                    : 'Date not available';

                  // Get the content from the correct location in the data structure
                  const content = reply._doc?.content || reply.content;
                  const userName = reply._doc?.userName || reply.userName || 'Anonymous';

                  return (
                    <div key={index} className="bg-muted/30 rounded-md p-2">
                      <div className="flex justify-between items-center text-xs text-muted-foreground">
                        <span className="font-medium">{userName}</span>
                        <span>{dateString}</span>
                      </div>
                      <p className="text-sm mt-1">{content}</p>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </CardContent>
        <CardFooter className="p-4 border-t">
          <Button 
            variant="outline" 
            className="flex items-center gap-2"
            onClick={(e) => {
              e.stopPropagation()
              setIsReplyModalOpen(true)
            }}
          >
            <MessageCircle className="h-4 w-4" />
            Reply
          </Button>
        </CardFooter>
      </Card>

      <Dialog open={isReplyModalOpen} onOpenChange={setIsReplyModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reply to {title}</DialogTitle>
          </DialogHeader>
          <div className="py-4">
            <Textarea
              placeholder="Type your question or comment here..."
              value={replyText}
              onChange={(e) => setReplyText(e.target.value)}
              className="min-h-[100px]"
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsReplyModalOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleReply}>
              Send Reply
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}

export default OrderCard