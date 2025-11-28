import type { Personnel } from "./Personnel";
import type { Appointment } from "./Appointment";

export interface AvailableDay{
    id: number;
    personnelId: number;
    date: string;
    startTime: string;
    endTime: string;
    isBooked?: boolean;

    personnel?: Personnel;
    appointments?: Appointment[];
}
export interface AvailableDayInput {
  personnelId: number;
  date: string;
  startTime: string;
  endTime: string;
}
