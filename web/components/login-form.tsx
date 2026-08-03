'use client';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Field, FieldDescription, FieldGroup, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import z from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter, useSearchParams } from 'next/navigation';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { ApiError, loginUser } from '@/lib/api';
import { toast } from 'sonner';

const loginSchema = z.object({
    email: z.string().trim().min(1, 'Email is required'),
    password: z.string().trim().min(1, 'Password is required').min(5, 'Password must be at least 5 characters'),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export function LoginForm({ className, ...props }: React.ComponentProps<'div'>) {
	const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<LoginFormValues>({
        resolver: zodResolver(loginSchema),
        defaultValues: { email: '', password: '' },
    });
    const searchParams = useSearchParams();
    const router = useRouter();
    const queryClient = useQueryClient();

    const { mutate, isPending, isSuccess } = useMutation({
        mutationFn: loginUser,
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ['profile'],
            });

            const redirectUrl = searchParams.get('callbackUrl') ?? '/dashboard';
            router.replace(redirectUrl);
        },
        onError: (error: ApiError) => {
            toast.error(error.message);
        },
    });
    const onSubmit = async (values: LoginFormValues) => {
        mutate(values);
    };
    return (
        <div className={cn('flex flex-col gap-6', className)} {...props}>
            <Card>
                <CardHeader>
                    <CardTitle>Login to your account</CardTitle>
                    <CardDescription>Enter your email below to login to your account</CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit(onSubmit)} noValidate>
                        <FieldGroup>
                            <Field>
                                <FieldLabel htmlFor="email">Email</FieldLabel>
                                <Input id="email" type="email" placeholder="m@example.com" required {...register('email')} />
                            </Field>
                            <Field>
                                <div className="flex items-center">
                                    <FieldLabel htmlFor="password">Password</FieldLabel>
                                </div>
                                <Input id="password" type="password" required {...register('password')} />
                            </Field>
                            <Field>
                                <Button type="submit">Login</Button>
                                <FieldDescription className="text-center">
                                    Don&apos;t have an account? <a href="#">Sign up</a>
                                </FieldDescription>
                            </Field>
                        </FieldGroup>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
