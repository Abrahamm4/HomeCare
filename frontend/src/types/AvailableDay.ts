import type { Personnel } from "../types/Personnel";
import type { Appointment } from "../types/Appointment";

export interface AvailableDay{
    id?: number;
    personnelId: number;
    date: string;
    startTime: string;
    endTime: string;

    personnel?: Personnel;
    appointments?: Appointment[];
}