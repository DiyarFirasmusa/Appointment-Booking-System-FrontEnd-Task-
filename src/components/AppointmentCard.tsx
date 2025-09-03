import { useState } from 'react'
import { Building2, User, Calendar, Car, Eye } from 'lucide-react'
import { Appointment } from '@/models/appointment'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { AppointmentDetailsDialog } from './AppointmentDetailsDialog'

interface AppointmentCardProps {
  appointment: Appointment
}

export const AppointmentCard = ({ appointment }: AppointmentCardProps) => {
  const [showDetails, setShowDetails] = useState(false)

  const formatDateTime = (date: string, time: string) => {
    return new Date(`${date}T${time}`).toLocaleDateString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  return (
    <>
      <Card className='hover:shadow-lg transition-shadow'>
        <CardHeader className='pb-3'>
          <CardTitle className='flex items-center gap-2 text-lg'>
            {appointment.reservationType === 'organization' ? (
              <Building2 className='h-5 w-5 text-primary' />
            ) : (
              <User className='h-5 w-5 text-primary' />
            )}
            {appointment.reservationType === 'organization'
              ? 'Organization Booking'
              : 'Individual Booking'}
          </CardTitle>
        </CardHeader>
        <CardContent className='space-y-4'>
          <div className='flex items-center gap-2 text-sm text-muted-foreground'>
            <Calendar className='h-4 w-4' />
            {formatDateTime(appointment.date, appointment.time)}
          </div>

          <div className='flex items-center gap-2 text-sm'>
            <Car className='h-4 w-4 text-muted-foreground' />
            <Badge variant='outline'>{appointment.vehiclePlate}</Badge>
          </div>

          <div className='space-y-2'>
            <div className='flex items-center justify-between'>
              <Badge
                className={`${
                  appointment.reservationType === 'individual'
                    ? 'bg-blue-100 text-blue-800 hover:bg-blue-100'
                    : 'bg-purple-100 text-purple-800 hover:bg-purple-100'
                }`}
              >
                {appointment.reservationType === 'individual' ? 'Individual' : 'Organization'}
              </Badge>
              <Badge className='bg-green-100 text-green-800 hover:bg-green-100'>Confirmed</Badge>
            </div>
            <Button
              variant='outline'
              size='sm'
              onClick={() => setShowDetails(true)}
              className='gap-2 w-full'
            >
              <Eye className='h-4 w-4' />
              View Details
            </Button>
          </div>
        </CardContent>
      </Card>

      <AppointmentDetailsDialog
        appointment={appointment}
        open={showDetails}
        onOpenChange={setShowDetails}
      />
    </>
  )
}
