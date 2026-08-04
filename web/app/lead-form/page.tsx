'use client';
import { PageHeader } from '@/components/custom/page-header';
import { Fragment, useEffect, useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ClipboardCopy, ExternalLink, InfoIcon, Plus, Save, Search, SearchIcon } from 'lucide-react';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { ApiError, createLeadForm, getBrokers, getLeadForm } from '@/lib/api';
import { InputGroup, InputGroupAddon, InputGroupButton, InputGroupInput, InputGroupText } from '@/components/ui/input-group';
import { Controller, useForm, useWatch } from 'react-hook-form';
import { Field, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field';
import { zodResolver } from '@hookform/resolvers/zod';
import { leadFormSchema, LeadFormValues } from '@/lib/types/lead-form-schema';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Skeleton } from '@/components/ui/skeleton';
import { StatusBadge } from '@/components/custom/status-badge';
import Link from 'next/link';

const EMPTY_DEFAULTS: LeadFormValues = {
    name: '',
    slug: '',
};

export default function LeadFormPage() {
    const router = useRouter();
    const [baseUrl, setBaseUrl] = useState('');
    const [formExists, setFormExists] = useState<boolean>(false);

    const form = useForm<LeadFormValues>({
        resolver: zodResolver(leadFormSchema),
        defaultValues: { ...EMPTY_DEFAULTS },
    });

    const watchedSlug = useWatch({ control: form.control, name: 'slug' });

    const { data: itemData, isSuccess: isItemDataSuccess } = useQuery({
        queryFn: getLeadForm,
        queryKey: ['leadForm'],
    });

    const queryClient = useQueryClient();

    const { mutate, isPending: isCreateLeadFormPending } = useMutation({
        mutationFn: createLeadForm,
        mutationKey: ['leadForm'],
        onSuccess: () => {
            queryClient.invalidateQueries({
                queryKey: ['leadForm'],
            });

            toast.success('Lead form has been saved successfully.');
        },
        onError: (error: ApiError) => {
            toast.error(error.message);
        },
    });

    useEffect(() => {
        setBaseUrl(window.location.origin);

        if (isItemDataSuccess) {
            if (itemData.data) {
                // Populate Form Data.
                setFormExists(true);
                form.reset({
                    name: itemData.data.name ?? '',
                    slug: itemData.data.slug ?? '',
                });
            } else {
                setFormExists(false);
                return;
            }
        }
    }, [itemData, form]);

    function onSubmit(data: LeadFormValues) {
        mutate(data);
    }

    return (
        <div className="flex flex-1 flex-col">
            <PageHeader title={`Lead Form`} />
            {/* Lead Form */}
            {isItemDataSuccess ? (
                <form id="lead-form" onSubmit={form.handleSubmit(onSubmit)}>
                    <div className="flex min-h-screen flex-1 flex-col">
                        <FieldGroup className="w-full p-10">
                            <Controller
                                name="name"
                                control={form.control}
                                render={({ field, fieldState }) => (
                                    <Field data-invalid={fieldState.invalid}>
                                        <FieldLabel htmlFor="form-name">Form name</FieldLabel>
                                        <Input {...field} id="form-name" placeholder="Lead Form A" aria-invalid={fieldState.invalid} disabled={formExists} />
                                        {fieldState.invalid && <FieldError className="text-xs" errors={[fieldState.error]} />}
                                    </Field>
                                )}
                            />
                            <Controller
                                name="slug"
                                control={form.control}
                                render={({ field, fieldState }) => (
                                    <Fragment>
                                        <Field data-invalid={fieldState.invalid}>
                                            <FieldLabel htmlFor="slug">Public URL slug</FieldLabel>
                                            <InputGroup>
                                                <InputGroupInput
                                                    {...field}
                                                    id="slug"
                                                    placeholder="your-slug"
                                                    aria-invalid={fieldState.invalid}
                                                    disabled={formExists}
                                                />
                                                <InputGroupAddon>
                                                    {formExists && (
                                                        <div className="flex flex-row justify-end">
                                                            <StatusBadge status="success">Live</StatusBadge>
                                                        </div>
                                                    )}
                                                    <InputGroupText>{baseUrl}/</InputGroupText>
                                                </InputGroupAddon>
                                                <InputGroupAddon align="inline-end">
                                                    {formExists && (
                                                        <Button type="button" variant="ghost" className="cursor-pointer" disabled={watchedSlug.trim() === ''}>
                                                            <Link href={`${baseUrl || ''}/${watchedSlug}`} target="_blank" rel="noopener noreferrer">
                                                                <ExternalLink />
                                                            </Link>
                                                        </Button>
                                                    )}
                                                </InputGroupAddon>
                                            </InputGroup>
                                            {fieldState.invalid && <FieldError className="text-xs" errors={[fieldState.error]} />}
                                        </Field>
                                    </Fragment>
                                )}
                            />
                        </FieldGroup>

                        <FieldGroup className="sticky bottom-0 mt-auto flex w-full flex-col gap-3 border-t px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:px-6 bg-background">
                            <Button type="button" variant="outline" onClick={() => router?.back()} className="gap-1.5 cursor-pointer">
                                <ArrowLeft className="h-4 w-4" />
                                Back
                            </Button>
                            <Button type="submit" form="lead-form" className="cursor-pointer" hidden={formExists} disabled={isCreateLeadFormPending}>
                                <Save />
                                {isCreateLeadFormPending ? 'Saving...' : 'Save changes'}
                            </Button>
                        </FieldGroup>
                    </div>
                </form>
            ) : (
                <LeadFormSkeleton />
            )}
        </div>
    );
}

function LeadFormSkeleton() {
    return (
        <div className="flex min-h-screen flex-1 flex-col">
            <div className="w-full space-y-8 p-10">
                {/* Form Name */}
                <div className="space-y-2">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-10 w-full rounded-md" />
                </div>

                {/* Public URL Slug */}
                <div className="space-y-2">
                    <Skeleton className="h-4 w-32" />

                    <div className="flex h-10 w-full overflow-hidden rounded-md border">
                        <Skeleton className="h-full flex-1 rounded-none" />
                        <Skeleton className="h-full w-56 rounded-none border-l" />
                        <Skeleton className="h-full w-10 rounded-none border-l" />
                    </div>
                </div>
            </div>

            {/* Sticky Footer */}
            <div className="sticky bottom-0 mt-auto flex w-full flex-col gap-3 border-t bg-background px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:px-6">
                <Skeleton className="h-10 w-24 rounded-md" />
                <Skeleton className="h-10 w-36 rounded-md" />
            </div>
        </div>
    );
}
