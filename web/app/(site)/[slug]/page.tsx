import { PublicLeadForm } from '@/components/custom/forms/public-lead-form';
import { getLeadForm } from '@/lib/api';
import { notFound } from 'next/navigation';

interface PageProps {
    params: Promise<{ slug: string }>;
}

export default async function Page({ params }: PageProps) {
    const { slug } = await params;
    const { data } = await getLeadForm();
    if (!data || data?.slug !== slug) {
        notFound();
    }

    return (
        <div className="mx-auto flex min-h-screen max-w-md flex-col justify-center px-4 py-12">
            <h1 className="mb-1 text-xl font-medium">{data?.name}</h1>
            <p className="mb-6 text-sm text-muted-foreground">Send us your details below, and we will reach out to you shortly.</p>
            <PublicLeadForm slug={data?.slug} />
        </div>
    );
}
