import { CheckCircle } from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'

export const SuccessMessage = () => {
  return (
    <Card className='w-full max-w-md mx-auto'>
      <CardContent className='pt-6 text-center'>
        <CheckCircle className='h-16 w-16 text-green-500 mx-auto mb-4' />
        <h2 className='text-2xl font-bold mb-2'>Appointment Booked!</h2>
        <p className='text-muted-foreground mb-4'>
          Your appointment has been successfully confirmed.
        </p>
        <p className='text-sm text-muted-foreground'>Redirecting to homepage in a few seconds...</p>
      </CardContent>
    </Card>
  )
}
