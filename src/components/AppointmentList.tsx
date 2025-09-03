import { Appointment } from "@/models/appointment";
import { AppointmentCard } from "./AppointmentCard";

interface AppointmentListProps {
  appointments: Appointment[];
}

export const AppointmentList = ({ appointments }: AppointmentListProps) => {
  if (appointments.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-muted-foreground text-lg mb-4">
          No appointments found. Book a new one!
        </div>
      </div>
    );
  }

  return (
    <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
      {appointments.map((appointment) => (
        <AppointmentCard key={appointment.id} appointment={appointment} />
      ))}
    </div>
  );
};