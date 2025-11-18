export interface AvailableDay{
    id: number;
    personnelId: number;
    date: string;
    startTime: string;
    endTime: string;
    appointment?: any | null;
}