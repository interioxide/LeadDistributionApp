'use client';
import { PageHeader } from '@/components/custom/page-header';
import { Fragment, useEffect, useState } from 'react';
import Link from 'next/link';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ArrowLeft, ClipboardCopy, InfoIcon, Plus, Save, Search, SearchIcon } from 'lucide-react';
import { PaginationState, SortingState } from '@tanstack/react-table';
import { useQuery } from '@tanstack/react-query';
import { getBrokers } from '@/lib/api';
import { DataTable } from '@/components/custom/table/data-table';
import { DataTableSkeleton } from '@/components/custom/skeleton/data-table-skeleton';
import { brokerColumns } from '@/components/custom/table/columns/broker';
import { InputGroup, InputGroupAddon, InputGroupButton, InputGroupInput, InputGroupText } from '@/components/ui/input-group';
import { Controller, useForm, useWatch } from 'react-hook-form';
import { Field, FieldContent, FieldDescription, FieldError, FieldGroup, FieldLabel } from '@/components/ui/field';
import { zodResolver } from '@hookform/resolvers/zod';
import { leadFormSchema, LeadFormValues } from '@/lib/types/lead-form-schema';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

const EMPTY_DEFAULTS: LeadFormValues = {
    name: '',
    slug: '',
};

export default function LeadFormPage() {
    const router = useRouter();
    const [ baseUrl, setBaseUrl ] = useState('');

    useEffect(() => {
        setBaseUrl(window.location.origin);
    }, []);

    const form = useForm<LeadFormValues>({
        resolver: zodResolver(leadFormSchema),
        defaultValues: { ...EMPTY_DEFAULTS },
    });
    
    const watchedSlug = useWatch({control: form.control, name: 'slug'});
    
    const handleCopyPublicUrl = async () => {
        const publicUrl = `${baseUrl || ''}/${watchedSlug}`;
        await navigator.clipboard.writeText(publicUrl);
        toast.info('Public URL copied to clipboard.', {
                description: <p className="text-1x">{publicUrl}</p>
            }
        )
    };

    /*const {
        data: itemData,
        isSuccess: isItemDataSuccess,
        isLoading: isItemDataLoading,
    } = useQuery({
        queryFn: () =>
            getBrokers({
                search,
                pagination,
                sorting,
            }),
        queryKey: ['brokers'],
    });*/

    return (
        <div className="flex flex-1 flex-col">
            <PageHeader title={`Lead Form`} />
            
            {/* Lead Form */}
            <form id="lead-form" >
                <div className="flex min-h-screen flex-1 flex-col">
                    <FieldGroup className="w-full p-10">
                        <Controller
                            name="name"
                            control={form.control}
                            render={({ field, fieldState }) => (
                                <Field data-invalid={fieldState.invalid}>
                                    <FieldLabel htmlFor="form-name">Form name</FieldLabel>
                                    <Input {...field} id="form-name" placeholder="Lead Form A" aria-invalid={fieldState.invalid} />
                                    {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
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
                                            <InputGroupInput {...field} id="slug" placeholder="your-slug" aria-invalid={fieldState.invalid} />
                                            <InputGroupAddon>
                                                <InputGroupText>{baseUrl}/</InputGroupText>
                                            </InputGroupAddon>
                                            <InputGroupAddon align="inline-end">
                                                <Button type="button" onClick={handleCopyPublicUrl} variant="ghost" className="cursor-pointer" disabled={watchedSlug.trim() === ''}>
                                                    <ClipboardCopy />
                                                </Button>
                                            </InputGroupAddon>
                                        </InputGroup>
                                        {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
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
                        <Button type="submit" form="broker-form" disabled={false} className="cursor-pointer">
                            <Save />
                            Save changes
                        </Button>
                    </FieldGroup>
                </div>
            </form>
        </div>
    );
}
