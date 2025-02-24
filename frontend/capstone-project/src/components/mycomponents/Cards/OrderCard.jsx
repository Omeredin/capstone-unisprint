import React from 'react'
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { CalendarDays, MapPin, AlertTriangle, DollarSign } from 'lucide-react'


const OrderCard = ({ title, date, content, category, price, urgency, location, name}) => {


  return (
    <>
      <Card className="w-full max-w-md overflow-hidden transition-all hover:shadow-lg">
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
      </Card>

    </>
  )
}

export default OrderCard