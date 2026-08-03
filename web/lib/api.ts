import Cookies from 'js-cookie';

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
    const responseJson = await response.json();
    return responseJson;
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