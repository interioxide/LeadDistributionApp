'use client';

import Link from 'next/link';
import { AlertTriangle, CheckCircle2, FileText, GitBranch } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { LeadForm } from '@/lib/types/lead-form-schema';
import { Distribution } from '@/lib/types/distribution-schema';

interface DashboardBroker {
    id: string;
    name: string;
    statusLabel: string;
}

interface LeadCounts {
    total: number;
    sent: number;
    unsent: number;
    duplicate: number;
    failed: number;
}

interface DashboardProps {
    leadCounts: LeadCounts;
    form: LeadForm | null;
    distribution: Distribution | null;
    activeBrokerCount: number;
    totalBrokerCount: number;
}

export function DashboardMetrics({ leadCounts, form, distribution, activeBrokerCount, totalBrokerCount }: DashboardProps) {
    return (
        <div className="space-y-6">
            {(!form || !distribution) && (
                <Card className="border-amber-200 bg-amber-50">
                    <CardContent className="flex items-start gap-3">
                        <AlertTriangle className="h-4 w-4 text-amber-600" aria-hidden="true" />
                        <div className="space-y-1 text-sm text-amber-900">
                            {!form && (
                                <p>
                                    No lead form created yet.{' '}
                                    <Link href="/lead-form" className="font-medium underline underline-offset-2">
                                        Create the form
                                    </Link>{' '}
                                    to start collecting leads.
                                </p>
                            )}
                            {form && !distribution && (
                                <p>
                                    Form created, but no distribution yet. Any incoming leads will be marked unsent until one exists.{' '}
                                    <Link href="/distribution" className="font-medium underline underline-offset-2">
                                        Create the distribution
                                    </Link>
                                    .
                                </p>
                            )}
                        </div>
                    </CardContent>
                </Card>
            )}

            {/* Stat cards — the four statuses from section 9, plus a total. */}
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-5">
                <StatCard label="Total leads" value={leadCounts.total} />
                <StatCard label="Sent" value={leadCounts.sent} tone="success" />
                <StatCard label="Unsent" value={leadCounts.unsent} tone="warning" />
                <StatCard label="Duplicate" value={leadCounts.duplicate} />
                <StatCard label="Failed" value={leadCounts.failed} tone="danger" />
            </div>

            <div className="grid gap-3 sm:grid-cols-3">
                <Card>
                    <CardContent className="flex items-center justify-between pt-6">
                        <div>
                            <p className="text-sm text-muted-foreground">Active brokers</p>
                            <p className="text-xl font-medium">
                                {activeBrokerCount} / {totalBrokerCount}
                            </p>
                        </div>
                        <CheckCircle2 className="h-5 w-5 text-muted-foreground" aria-hidden="true" />
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="flex items-center justify-between pt-6">
                        <div>
                            <p className="text-sm text-muted-foreground">Form</p>
                            <p className="text-sm font-medium">{form ? form.name : 'Not created'}</p>
                        </div>
                        <Button asChild variant="ghost" size="icon">
                            <Link href="/form">
                                <FileText className="h-4 w-4" aria-hidden="true" />
                            </Link>
                        </Button>
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="flex items-center justify-between pt-6">
                        <div>
                            <p className="text-sm text-muted-foreground">Distribution</p>
                            <p className="text-sm font-medium">{distribution ? 'Active' : 'Not created'}</p>
                        </div>
                        <Button asChild variant="ghost" size="icon">
                            <Link href="/distribution">
                                <GitBranch className="h-4 w-4" aria-hidden="true" />
                            </Link>
                        </Button>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

function StatCard({ label, value, tone }: { label: string; value: number; tone?: 'success' | 'warning' | 'danger' }) {
    const toneClass = tone === 'success' ? 'text-green-600' : tone === 'warning' ? 'text-amber-600' : tone === 'danger' ? 'text-red-600' : 'text-foreground';

    return (
        <Card>
            <CardContent className="pt-6">
                <p className="text-xs text-muted-foreground">{label}</p>
                <p className={`text-2xl font-medium ${toneClass}`}>{value}</p>
            </CardContent>
        </Card>
    );
}
