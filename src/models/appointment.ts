import { z } from 'zod'

export type ReservationType = 'individual' | 'organization'

export interface Appointment {
  id: string
  reservationType: ReservationType
  date: string
  time: string
  contactName: string
  email: string
  phone: string
  numberOfPeople?: number
  vehiclePlate: string
  vehicleModel: string
  createdAt: string
}

export const appointmentSchema = z.object({
  reservationType: z.enum(['individual', 'organization'], {
    required_error: 'Please select a reservation type',
  }),
  date: z.string().min(1, 'Date is required'),
  time: z.string().min(1, 'Time is required'),
  contactName: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  phone: z.string().min(10, 'Phone number must be at least 10 digits'),
  numberOfPeople: z.number().min(1).optional(),
  vehiclePlate: z.string().optional(),
  vehicleModel: z.string().optional(),
})

export type AppointmentFormData = z.infer<typeof appointmentSchema>
