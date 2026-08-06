import { Distribution } from './distribution-schema';
import { LeadForm } from './lead-form-schema';

export interface Metrics {
    totalLeads: number;
    sentLeads: number;
    unsentLeads: number;
    duplicateLeads: number;
    failedLeads: number;
    totalBrokers: number;
    activeBrokers: number;
    form: LeadForm;
    distribution: Distribution;
}
