import { Broker } from './types/broker-schema';
import { AddBrokerToDistributionValues, Distribution, DistributionBroker, DistributionBrokersFormValues } from './types/distribution-schema';
import { LeadForm, LeadFormValues } from './types/lead-form-schema';
import { Lead, LeadValues } from './types/lead-schema';
import { Metrics } from './types/metrics';
import { PaginationMetadata, SearchQuery } from './types/pagination';

type BrokerWorkingDaysList = Omit<Broker, 'workingDays'> & { workingDays: string[] };
type BrokerWorkingDaysComma = Omit<Broker, 'workingDays'> & { workingDays: string };
interface DistributionBrokerApi {
    id: string;
    distributionId: string;
    brokerId: string;
    percentage: number;
    isActive: boolean;
    broker: {
        name: string;
        isActive: boolean;
    } | null;
}

export class ApiError<T = unknown> extends Error {
    static readonly defaultErrorMsg: string = 'API request failed';
    status: number | string;
    data: T;

    constructor(message: string, status: number | string, data: T) {
        super(message);
        this.status = status;
        this.data = data;
    }
}

export async function loginUser(data: { email: string; password: string }) {
    const url = new URL('/api/auth/login', process.env.NEXT_PUBLIC_API_URL);
    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
        credentials: 'include',
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new ApiError(errorData?.message || ApiError.defaultErrorMsg, response.status, errorData);
    }
    return response.json();
}

export async function logoutUser() {
    const url = new URL('/api/auth/logout', process.env.NEXT_PUBLIC_API_URL);
    const response = await fetch(url, {
        method: 'POST',
        credentials: 'include',
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new ApiError(errorData?.message || ApiError.defaultErrorMsg, response.status, errorData);
    }
    return response.json();
}

export async function getCurrentUser() {
    const url = new URL('/api/profile', process.env.NEXT_PUBLIC_API_URL);
    const response = await fetch(url, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
        credentials: 'include',
    });
    if (!response.ok) {
        window.location.replace('/login');
        return false;
    }
    return response.json();
}

export async function getBrokers(query: SearchQuery = {}): Promise<{ data: BrokerWorkingDaysList[]; metadata: PaginationMetadata }> {
    const url = new URL('/api/brokers', process.env.NEXT_PUBLIC_API_URL);
    url.search = new URLSearchParams({
        ...(query.search && { search: query.search }),
        ...(query.pagination && {
            page: (query.pagination.pageIndex + 1).toString(),
            limit: query.pagination.pageSize.toString(),
        }),
        ...(query.sorting && {
            orderBy: query.sorting.at(0)?.id,
            orderDirection: query.sorting.at(0)?.desc ? 'desc' : 'asc',
        }),
    }).toString();

    const response = await fetch(url, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
        credentials: 'include',
    });
    if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new ApiError(errorData?.message || ApiError.defaultErrorMsg, response.status, errorData);
    }
    const responseJson = await response.json();
    const data = responseJson.data as BrokerWorkingDaysComma[];

    responseJson.data = data.map((item) => {
        const workingDays = item.workingDays.split(',');
        return {
            ...item,
            workingDays,
        };
    });
    return responseJson;
}

export async function getBrokerById(id: string): Promise<{ data: Broker }> {
    const url = new URL(`/api/brokers/${id.trim()}`, process.env.NEXT_PUBLIC_API_URL);
    const response = await fetch(url, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
        credentials: 'include',
    });
    if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new ApiError(errorData?.message || ApiError.defaultErrorMsg, response.status, errorData);
    }
    const responseJson = await response.json();
    const data = responseJson.data as Omit<Broker, 'workingDays'> & { workingDays: string };
    responseJson.data.workingDays = data.workingDays.split(',');
    return responseJson;
}

export async function createBroker(broker: Omit<Broker, 'id'>): Promise<{ data: Broker }> {
    const url = new URL(`/api/brokers`, process.env.NEXT_PUBLIC_API_URL);
    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(broker),
        credentials: 'include',
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new ApiError(errorData?.message || ApiError.defaultErrorMsg, response.status, errorData);
    }
    return response.json();
}

export async function updateBroker(broker: Broker): Promise<{ data: Broker }> {
    const { id, ...data } = broker;
    const url = new URL(`/api/brokers/${broker.id.trim()}`, process.env.NEXT_PUBLIC_API_URL);
    const response = await fetch(url, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
        credentials: 'include',
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new ApiError(errorData?.message || ApiError.defaultErrorMsg, response.status, errorData);
    }
    return response.json();
}

export async function getLeadForm(): Promise<{ data: LeadForm }> {
    const url = new URL('/api/form', process.env.NEXT_PUBLIC_API_URL);
    const response = await fetch(url, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
        credentials: 'include',
    });
    if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new ApiError(errorData?.message || ApiError.defaultErrorMsg, response.status, errorData);
    }
    return response.json();
}

export async function createLeadForm(leadForm: LeadFormValues): Promise<{ data: LeadForm }> {
    const url = new URL('/api/form', process.env.NEXT_PUBLIC_API_URL);
    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(leadForm),
        credentials: 'include',
    });
    if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new ApiError(errorData?.message || ApiError.defaultErrorMsg, response.status, errorData);
    }
    return response.json();
}

export async function createDistribution(): Promise<{ data: Distribution }> {
    const url = new URL('/api/distribution', process.env.NEXT_PUBLIC_API_URL);
    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        credentials: 'include',
    });
    if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new ApiError(errorData?.message || ApiError.defaultErrorMsg, response.status, errorData);
    }
    return response.json();
}

export async function getDistribution(): Promise<{ data: Distribution }> {
    const url = new URL('/api/distribution', process.env.NEXT_PUBLIC_API_URL);
    const response = await fetch(url, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
        credentials: 'include',
    });
    if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new ApiError(errorData?.message || ApiError.defaultErrorMsg, response.status, errorData);
    }
    return response.json();
}

export async function getDistributionBrokers(query: SearchQuery = {}): Promise<{ data: DistributionBroker[]; metadata: PaginationMetadata }> {
    const url = new URL('/api/distribution/brokers', process.env.NEXT_PUBLIC_API_URL);
    url.search = new URLSearchParams({
        ...(query.search && { search: query.search }),
        ...(query.pagination && {
            page: (query.pagination.pageIndex + 1).toString(),
            limit: query.pagination.pageSize.toString(),
        }),
        ...(query.sorting && {
            orderBy: query.sorting.at(0)?.id,
            orderDirection: query.sorting.at(0)?.desc ? 'desc' : 'asc',
        }),
    }).toString();
    const response = await fetch(url, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
        credentials: 'include',
    });
    if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new ApiError(errorData?.message || ApiError.defaultErrorMsg, response.status, errorData);
    }

    const responseJson = await response.json();
    const data = responseJson.data as DistributionBrokerApi[];

    responseJson.data = data.map((item) => {
        const normalizeObj = {
            brokerName: item.broker?.name || null,
            brokerIsActive: item.broker?.isActive || null,
            ...item,
        };
        const { broker, ...mapped } = normalizeObj;
        return mapped;
    });
    return responseJson;
}

export async function addDistributionBroker(brokerToDistributionValues: AddBrokerToDistributionValues): Promise<{ data: DistributionBroker }> {
    const url = new URL('/api/distribution/broker', process.env.NEXT_PUBLIC_API_URL);
    const response = await fetch(url, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(brokerToDistributionValues),
        credentials: 'include',
    });
    if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new ApiError(errorData?.message || ApiError.defaultErrorMsg, response.status, errorData);
    }
    return response.json();
}

export async function removeDistributionBroker(brokerId: string): Promise<{ data: { count: number } }> {
    const url = new URL(`/api/distribution/${brokerId}`, process.env.NEXT_PUBLIC_API_URL);
    const response = await fetch(url, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
        },
        credentials: 'include',
    });
    if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new ApiError(errorData?.message || ApiError.defaultErrorMsg, response.status, errorData);
    }
    return response.json();
}

export async function saveDistributionSettings(settings: DistributionBrokersFormValues): Promise<{ data: { count: number }[] }> {
    const normalized = settings.brokers.map((setting) => {
        const { brokerIsActive, brokerName, ...newSetting } = setting;
        return newSetting;
    });

    const url = new URL('/api/distribution/settings', process.env.NEXT_PUBLIC_API_URL);
    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            brokers: normalized,
        }),
        credentials: 'include',
    });
    if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new ApiError(errorData?.message || ApiError.defaultErrorMsg, response.status, errorData);
    }
    return response.json();
}

export async function submitLead(leadValues: LeadValues & { slug: string }): Promise<{ data: Lead }> {
    const url = new URL(`/api/leads/${leadValues.slug.trim()}`, process.env.NEXT_PUBLIC_API_URL);
    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(leadValues),
        credentials: 'include',
    });
    if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new ApiError(errorData?.message || ApiError.defaultErrorMsg, response.status, errorData);
    }
    return response.json();
}

export async function getDistributionLeads(query: SearchQuery & { distributionId?: string } = {}): Promise<{ data: Lead[]; metadata: PaginationMetadata }> {
    const url = new URL(`/api/leads/${query.distributionId}`, process.env.NEXT_PUBLIC_API_URL);
    url.search = new URLSearchParams({
        ...(query.search && { search: query.search }),
        ...(query.pagination && {
            page: (query.pagination.pageIndex + 1).toString(),
            limit: query.pagination.pageSize.toString(),
        }),
        ...(query.sorting && {
            orderBy: query.sorting.at(0)?.id,
            orderDirection: query.sorting.at(0)?.desc ? 'desc' : 'asc',
        }),
    }).toString();
    const response = await fetch(url, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
        credentials: 'include',
    });
    if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new ApiError(errorData?.message || ApiError.defaultErrorMsg, response.status, errorData);
    }
    return response.json();
}

export async function getAllLeads(query: SearchQuery = {}): Promise<{ data: Lead[]; metadata: PaginationMetadata }> {
    const url = new URL(`/api/leads`, process.env.NEXT_PUBLIC_API_URL);
    url.search = new URLSearchParams({
        ...(query.brokerId && { brokerId: query.brokerId }),
        ...(query.search && { search: query.search }),
        ...(query.pagination && {
            page: (query.pagination.pageIndex + 1).toString(),
            limit: query.pagination.pageSize.toString(),
        }),
        ...(query.sorting && {
            orderBy: query.sorting.at(0)?.id,
            orderDirection: query.sorting.at(0)?.desc ? 'desc' : 'asc',
        }),
    }).toString();
    const response = await fetch(url, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
        credentials: 'include',
    });
    if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new ApiError(errorData?.message || ApiError.defaultErrorMsg, response.status, errorData);
    }
    return response.json();
}

export async function assignLead(query: { id: string; brokerId: string }): Promise<{ data: Lead }> {
    const { id, brokerId } = query;
    const url = new URL(`/api/leads/${id}/assign`, process.env.NEXT_PUBLIC_API_URL);
    const response = await fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            brokerId,
        }),
        credentials: 'include',
    });
    if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new ApiError(errorData?.message || ApiError.defaultErrorMsg, response.status, errorData);
    }
    return response.json();
}

export async function getMetrics(): Promise<Metrics> {
    const url = new URL(`/api/metrics`, process.env.NEXT_PUBLIC_API_URL);
    const response = await fetch(url, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
        credentials: 'include',
    });
    if (!response.ok) {
        const errorData = await response.json().catch(() => null);
        throw new ApiError(errorData?.message || ApiError.defaultErrorMsg, response.status, errorData);
    }
    return response.json();
}
