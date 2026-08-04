import React, { useState, useEffect, useRef } from 'react';
import { z } from 'zod';
import { Input } from '../ui/input';
import { cn } from '@/lib/utils';

export interface NumericInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange' | 'value'> {
    value?: number | string;
    onChange?: (e: React.ChangeEvent<HTMLInputElement>, value: number | null, rawString: string) => void;
    allowDecimals?: boolean;
    allowNegative?: boolean;
    min?: number;
    max?: number;
    label?: string;
    error?: string;
}

export const NumericInput: React.FC<NumericInputProps> = ({
    value = '',
    onChange,
    allowDecimals = false,
    allowNegative = false,
    min,
    max,
    label,
    error: externalError,
    className,
    ...props
}) => {
    const [validationError, setValidationError] = useState<string | null>(null);
    const [displayValue, setDisplayValue] = useState<string>(value === null || value === undefined ? '' : String(value));
    const isInternalChange = useRef(false);

    useEffect(() => {
        if (isInternalChange.current) {
            isInternalChange.current = false;
            return;
        }
        setDisplayValue(value === null || value === undefined ? '' : String(value));
    }, [value]);

    // Zod Schema
    const schema = z
        .string()
        .refine((val) => val === '' || !isNaN(Number(val)), {
            message: 'Invalid number',
        })
        .transform((val) => (val === '' ? null : Number(val)))
        .pipe(
            z
                .number()
                .nullable()
                .refine((val) => val === null || min === undefined || val >= min, {
                    message: `Minimum allowed value is ${min}`,
                })
                .refine((val) => val === null || max === undefined || val <= max, {
                    message: `Maximum allowed value is ${max}`,
                }),
        );

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        let rawValue = e.target.value;

        // Filter out non-numeric characters
        if (allowDecimals) {
            rawValue = rawValue.replace(allowNegative ? /[^0-9.-]/g : /[^0-9.]/g, '');
            const parts = rawValue.split('.');
            if (parts.length > 2) {
                rawValue = `${parts[0]}.${parts.slice(1).join('')}`;
            }
            if (allowNegative) {
                rawValue = rawValue.replace(/(?!^)-/g, '');
            }
        } else {
            rawValue = rawValue.replace(allowNegative ? /[^0-9-]/g : /\D/g, '');
            if (allowNegative) {
                rawValue = rawValue.replace(/(?!^)-/g, '');
            }
        }

        e.target.value = rawValue;

        // Always update what's on screen from the raw string immediately —
        // this is what keeps a trailing "." or a lone "-" visible instead
        // of being erased while the value is numerically incomplete.
        isInternalChange.current = true;
        setDisplayValue(rawValue);

        // Validate with Zod
        const result = schema.safeParse(rawValue);

        if (result.success) {
            setValidationError(null);
            // Pass `e` along with parsed value & raw string
            onChange?.(e, result.data, rawValue);
        } else {
            const firstError = result.error.issues[0]?.message || 'Invalid input';
            setValidationError(firstError);
            onChange?.(e, null, rawValue);
        }
    };

    const activeError = externalError || validationError;

    return (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', maxWidth: '300px' }}>
            {label && <label style={{ fontSize: '14px', fontWeight: 600 }}>{label}</label>}

            <Input
                {...props}
                type="text"
                inputMode={allowDecimals ? 'decimal' : 'numeric'}
                value={displayValue}
                onChange={handleChange}
                className={cn('h-8 w-28 text-xs', className)}
            />

            {activeError && <span style={{ color: '#dc2626', fontSize: '12px' }}>{activeError}</span>}
        </div>
    );
};
