import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import { Building2, User, Calendar, Clock, Mail, Phone, Users, Car } from 'lucide-react'
import { Appointment } from '@/models/appointment'

interface AppointmentDetailsDialogProps {
  appointment: Appointment
  open: boolean
  onOpenChange: (open: boolean) => void
}

export const AppointmentDetailsDialog = ({
  appointment,
  open,
  onOpenChange,
}: AppointmentDetailsDialogProps) => {
  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  const formatTime = (time: string) => {
    return new Date(`2000-01-01T${time}`).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className='max-w-[360px] md:max-w-md '>
        <DialogHeader>
          <DialogTitle className='flex items-center gap-2'>
            {appointment.reservationType === 'organization' ? (
              <Building2 className='h-5 w-5 text-primary' />
            ) : (
              <User className='h-5 w-5 text-primary' />
            )}
            Appointment Details
          </DialogTitle>
        </DialogHeader>

        <div className='space-y-4'>
          <div className='grid grid-cols-2 gap-4'>
            <div className='flex flex-col items-center'>
              <span className='font-medium text-sm text-muted-foreground mb-1'>Type</span>
              <Badge
                className={
                  appointment.reservationType === 'individual'
                    ? 'bg-blue-100 text-blue-800'
                    : 'bg-purple-100 text-purple-800'
                }
              >
                {appointment.reservationType === 'individual' ? 'Individual' : 'Organization'}
              </Badge>
            </div>
            <div className='flex flex-col items-center'>
              <span className='font-medium text-sm text-muted-foreground mb-1'>Status</span>
              <Badge className='bg-green-100 text-green-800'>Confirmed</Badge>
            </div>
          </div>

          <Separator />

          <div className='space-y-3'>
            <div className='flex items-center gap-3'>
              <Calendar className='h-4 w-4 text-muted-foreground' />
              <span className='text-sm font-medium'>Date:</span>
              <span className='text-sm'>{formatDate(appointment.date)}</span>
            </div>

            <div className='flex items-center gap-3'>
              <Clock className='h-4 w-4 text-muted-foreground' />
              <span className='text-sm font-medium'>Time:</span>
              <span className='text-sm'>{formatTime(appointment.time)}</span>
            </div>
          </div>

          <Separator />

          <div className='space-y-3'>
            <h4 className='font-semibold text-sm'>Contact Information</h4>
            <div className='space-y-2'>
              <div className='flex items-center gap-3'>
                <User className='h-4 w-4 text-muted-foreground' />
                <span className='text-sm'>{appointment.contactName}</span>
              </div>
              <div className='flex items-center gap-3'>
                <Mail className='h-4 w-4 text-muted-foreground' />
                <span className='text-sm'>{appointment.email}</span>
              </div>
              <div className='flex items-center gap-3'>
                <Phone className='h-4 w-4 text-muted-foreground' />
                <span className='text-sm'>{appointment.phone}</span>
              </div>
              {appointment.numberOfPeople && (
                <div className='flex items-center gap-3'>
                  <Users className='h-4 w-4 text-muted-foreground' />
                  <span className='text-sm'>{appointment.numberOfPeople} people</span>
                </div>
              )}
            </div>
          </div>

          <Separator />

          <div className='space-y-3'>
            <h4 className='font-semibold text-sm'>Vehicle Information</h4>
            <div className='space-y-2'>
              <div className='flex items-center gap-3'>
                <Car className='h-4 w-4 text-muted-foreground' />
                <span className='text-sm font-medium'>Plate:</span>
                <Badge variant='outline'>{appointment.vehiclePlate}</Badge>
              </div>
              <div className='flex items-center gap-3'>
                <Car className='h-4 w-4 text-muted-foreground' />
                <span className='text-sm font-medium'>Model:</span>
                <span className='text-sm'>{appointment.vehicleModel}</span>
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
