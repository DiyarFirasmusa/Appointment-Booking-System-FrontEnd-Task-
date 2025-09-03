import { useNavigate } from 'react-router-dom'
import { ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { BookingForm } from '@/components/BookingForm'
import { SuccessMessage } from '@/components/SuccessMessage'
import { useBookingController } from '@/hooks/useBookingController'

const BookingPage = () => {
  const navigate = useNavigate()
  const { form, onSubmit, isSubmitted } = useBookingController()

  if (isSubmitted) {
    return (
      <div className='min-h-screen bg-background flex items-center justify-center'>
        <SuccessMessage />
      </div>
    )
  }

  return (
    <div className='min-h-screen bg-background'>
      <div className='container mx-auto px-4 py-8'>
        <Button variant='ghost' onClick={() => navigate('/')} className='mb-6 gap-2'>
          <ArrowLeft className='h-4 w-4' />
          Back to Appointments
        </Button>

        <BookingForm form={form} onSubmit={onSubmit} />
      </div>
    </div>
  )
}

export default BookingPage
