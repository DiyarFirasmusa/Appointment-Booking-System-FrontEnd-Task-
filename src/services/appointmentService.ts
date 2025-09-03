import { Appointment, AppointmentFormData } from "@/models/appointment";

const STORAGE_KEY = "appointments";

export const appointmentService = {
  getAppointments(): Appointment[] {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error("Failed to load appointments:", error);
      return [];
    }
  },

  addAppointment(formData: AppointmentFormData): Appointment {
    const newAppointment: Appointment = {
      id: crypto.randomUUID(),
      reservationType: formData.reservationType,
      date: formData.date,
      time: formData.time,
      contactName: formData.contactName,
      email: formData.email,
      phone: formData.phone,
      numberOfPeople: formData.numberOfPeople,
      vehiclePlate: formData.vehiclePlate,
      vehicleModel: formData.vehicleModel,
      createdAt: new Date().toISOString(),
    };

    try {
      const appointments = this.getAppointments();
      appointments.push(newAppointment);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(appointments));
      return newAppointment;
    } catch (error) {
      console.error("Failed to save appointment:", error);
      throw new Error("Failed to save appointment");
    }
  },
};