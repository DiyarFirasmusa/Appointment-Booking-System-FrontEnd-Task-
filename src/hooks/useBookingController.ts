import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { appointmentSchema, AppointmentFormData } from '@/models/appointment'
import { appointmentService } from '@/services/appointmentService'
import { useToast } from '@/hooks/use-toast'

export const useBookingController = () => {
  const [isSubmitted, setIsSubmitted] = useState(false)
  const navigate = useNavigate()
  const { toast } = useToast()

  const form = useForm<AppointmentFormData>({
    resolver: zodResolver(appointmentSchema),
    defaultValues: {
      reservationType: 'individual',
      contactName: '',
      email: '',
      phone: '',
      vehiclePlate: '',
      vehicleModel: '',
      date: '',
      time: '',
    },
  })

  const onSubmit = async (data: AppointmentFormData) => {
    try {
      appointmentService.addAppointment(data)
      setIsSubmitted(true)

      toast({
        title: 'Appointment Booked Successfully!',
        description: 'Your appointment has been confirmed.',
      })

      setTimeout(() => {
        navigate('/')
      }, 1000)
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to book appointment. Please try again.',
        variant: 'destructive',
      })
    }
  }

  return {
    form,
    onSubmit,
    isSubmitted,
  }
}
