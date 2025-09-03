import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { PlusCircle, Calendar, Clock, Users, Sparkles, CheckCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { AppointmentList } from '@/components/AppointmentList'
import { LoadingSpinner } from '@/components/LoadingSpinner'
import { appointmentService } from '@/services/appointmentService'
import { Appointment } from '@/models/appointment'

const HomePage = () => {
  const [appointments, setAppointments] = useState<Appointment[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    const loadAppointments = () => {
      try {
        const data = appointmentService.getAppointments()
        setAppointments(data)
      } catch (error) {
        console.error('Failed to load appointments:', error)
      } finally {
        setIsLoading(false)
      }
    }
    setTimeout(loadAppointments, 500)
  }, [])

  if (isLoading) {
    return (
      <div className='min-h-screen bg-background'>
        <div className='container mx-auto px-4 py-8'>
          <LoadingSpinner />
        </div>
      </div>
    )
  }

  return (
    <div className='min-h-screen '>
      <div className='relative overflow-hidden '>
        <div className='relative container mx-auto px-4 py-16'>
          <div className='max-w-4xl mx-auto text-center'>
            <div className='flex justify-center mb-6'>
              <div className='p-3 bg-white/20 rounded-full backdrop-blur-sm'>
                <Calendar className='h-8 w-8' />
              </div>
            </div>
            <div className='flex flex-col sm:flex-row gap-4 justify-center items-center'>
              <Button onClick={() => navigate('/book')} size='lg' className='rounded-xl'>
                <PlusCircle className='h-5 w-5 mr-2 ' />
                Book New Appointment
              </Button>
            </div>
          </div>
        </div>
      </div>

      <div className='container mx-auto px-4 -mt-8 relative z-10'>
        <div className='grid grid-cols-1 md:grid-cols-4 gap-6 mb-12'>
          <Card className='shadow-lg hover:shadow-xl transition-shadow duration-300 border-0 bg-white/80 backdrop-blur-sm'>
            <CardHeader className='pb-3'>
              <CardTitle className='flex items-center gap-2 text-lg'>
                <div className='p-2 bg-blue-100 rounded-lg'>
                  <Calendar className='h-5 w-5 text-blue-600' />
                </div>
                Total Appointments
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className='text-3xl font-bold text-blue-600'>{appointments.length}</div>
              <p className='text-sm text-muted-foreground'>Appointments booked</p>
            </CardContent>
          </Card>

          <Card className='shadow-lg hover:shadow-xl transition-shadow duration-300 border-0 bg-white/80 backdrop-blur-sm'>
            <CardHeader className='pb-3'>
              <CardTitle className='flex items-center gap-2 text-lg'>
                <div className='p-2 bg-green-100 rounded-lg'>
                  <Clock className='h-5 w-5 text-green-600' />
                </div>
                Individual
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className='text-3xl font-bold text-green-600'>
                {appointments.filter(apt => apt.reservationType === 'individual').length}
              </div>
              <p className='text-sm text-muted-foreground'>Individual bookings</p>
            </CardContent>
          </Card>

          <Card className='shadow-lg hover:shadow-xl transition-shadow duration-300 border-0 bg-white/80 backdrop-blur-sm'>
            <CardHeader className='pb-3'>
              <CardTitle className='flex items-center gap-2 text-lg'>
                <div className='p-2 bg-purple-100 rounded-lg'>
                  <Users className='h-5 w-5 text-purple-600' />
                </div>
                Organization
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className='text-3xl font-bold text-purple-600'>
                {appointments.filter(apt => apt.reservationType === 'organization').length}
              </div>
              <p className='text-sm text-muted-foreground'>Organization bookings</p>
            </CardContent>
          </Card>

          <Card className='shadow-lg hover:shadow-xl transition-shadow duration-300 border-0 bg-white/80 backdrop-blur-sm'>
            <CardHeader className='pb-3'>
              <CardTitle className='flex items-center gap-2 text-lg'>
                <div className='p-2 bg-emerald-100 rounded-lg'>
                  <CheckCircle className='h-5 w-5 text-emerald-600' />
                </div>
                Confirmed
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className='text-3xl font-bold text-emerald-600'>{appointments.length}</div>
              <p className='text-sm text-muted-foreground'>All appointments confirmed</p>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className='container mx-auto px-4 pb-12'>
        <div className='mb-8'>
          <div className='flex items-center justify-between mb-4 px-2'>
            <div>
              <h2 className='text-2xl font-bold text-gray-900 dark:text-white mb-2'>
                Your Appointments
              </h2>
              <p className='text-muted-foreground'>Manage and view all your appointment bookings</p>
            </div>
            <Badge variant='secondary' className='hidden sm:flex'>
              {appointments.length} Total
            </Badge>
          </div>
        </div>

        <div className='bg-white/60 backdrop-blur-sm rounded-2xl shadow-xl border-0 p-6'>
          <AppointmentList appointments={appointments} />
        </div>
      </div>
    </div>
  )
}

export default HomePage
