export interface Appointment{
    id: number;
    date: string;
    notes?: string | null;
    patientId?: number | null;
    personnelId: number;
    availableDayId: number;

    patientName?: string;
    personnelName?: string;
}