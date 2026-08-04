'use client';

import { Clock } from 'lucide-react';
import { Input } from '@/components/ui/input';

interface TimePickerProps {
    value: string; // "HH:MM"
    onChange: (value: string) => void;
    id?: string;
}

export function TimePicker({ value, onChange, id }: TimePickerProps) {
    return (
        <div className="relative">
            <Clock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
            <Input
                id={id}
                type="time"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                className="pl-10 appearance-none bg-primary-foreground [&::-webkit-calendar-picker-indicator]:hidden [&::-webkit-calendar-picker-indicator]:appearance-none"
            />
        </div>
    );
}
