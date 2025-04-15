import React, { useState } from 'react'
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { CalendarDays, MapPin, AlertTriangle, DollarSign, MessageCircle } from 'lucide-react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Textarea } from "@/components/ui/textarea"
import axiosInstance from '@/utils/axiosInstance'
import { useNavigate } from 'react-router-dom'

const OrderCard = ({ title, date, content, category, price, urgency, location, name, orderId }) => {
  const [isReplyModalOpen, setIsReplyModalOpen] = useState(false)
  const [replyText, setReplyText] = useState('')
  const [replies, setReplies] = useState([])
  const navigate = useNavigate()

  const handleCardClick = () => {
    navigate(`/request/${orderId}`)
  }

  const handleReply = async (e) => {
    e.stopPropagation() // Prevent card click when clicking reply button
    try {
      const response = await axiosInstance.post('/add-reply', {
        orderId,
        content: replyText
      })
      setReplies([...replies, response.data.reply])
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
            {/* <p>{fullname}</p> */}
            <CalendarDays className="h-4 w-4 mr-1" />
            {new Date(date).toLocaleDateString()}
          </div>
            <p>{name}</p>
        </CardHeader>
        <CardContent className="p-4">
          <p className="text-sm text-muted-foreground mb-4">{content}</p>
          <div className="flex flex-wrap gap-3 text-sm">
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
                {urgency} <div>
                  {urgency ? "Urgent" : "Not Urgent"}
              </div>
              </Badge>
            </div>
          </div>
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