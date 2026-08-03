export interface Broker {
    id: string;
    name: string;
    isActive: boolean;
    dailyCap: number;
    timezone: string;
    openingTime: string;
    closingTime: string;
    workingDays: string;
    createdAt: string;
    updatedAt: string;
}
