import { Broker, BrokerFormValues } from './types/broker-schema';
import { SearchQuery } from './types/pagination';

export class ApiError extends Error {
    static readonly defaultErrorMsg: string = 'API request failed';
    status: number | string;
    data: any;

    constructor(message: string, status: number | string, data: unknown) {
        super(message);
        this.status = status;
        this.data = data;
    }
}

export async function loginUser(data: { email: string; password: string }) {
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/login`, {
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
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/auth/logout`, {
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
    const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/profile`, {
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

export async function getBrokers(query: SearchQuery = {}) {
    const url = new URL('/brokers', process.env.NEXT_PUBLIC_API_URL);
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
    responseJson.data = responseJson.data.map((item: any) => {
        const workingDays = item.workingDays.split(',');
        return {
            ...item,
            workingDays,
        };
    });
    return responseJson;
}

export async function getBrokerById(id: string) {
    const url = new URL(`/brokers/${id.trim()}`, process.env.NEXT_PUBLIC_API_URL);
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
    responseJson.data.workingDays = responseJson.data.workingDays.split(',');
    return responseJson;
}

export async function createBroker(broker: Omit<Broker, "id">) {
    const url = new URL(`/brokers`, process.env.NEXT_PUBLIC_API_URL);
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

export async function updateBroker(broker: Broker) {
    const { id, ...data } = broker;
    const url = new URL(`/brokers/${broker.id.trim()}`, process.env.NEXT_PUBLIC_API_URL);
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