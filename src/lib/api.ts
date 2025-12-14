import { Task, Hackathon } from '@/types';

const API_BASE_URL = 'http://localhost:5001/api';

const getAuthHeaders = () => {
    const token = localStorage.getItem('token');
    return token ? { 'Authorization': `Bearer ${token}` } : {};
};

// Helper to handle date strings from JSON
const parseDates = (obj: any): any => {
    if (obj === null || obj === undefined) return obj;
    if (typeof obj === 'string') {
        // Simple ISO date check
        if (/^\d{4}-\d{2}-\d{2}T/.test(obj)) {
            return new Date(obj);
        }
        return obj;
    }
    if (Array.isArray(obj)) {
        return obj.map(parseDates);
    }
    if (typeof obj === 'object') {
        const newObj: any = {};
        for (const key in obj) {
            newObj[key] = parseDates(obj[key]);
        }
        return newObj;
    }
    return obj;
};

export const api = {
    auth: {
        login: async (credentials: any) => {
            const res = await fetch(`${API_BASE_URL}/auth/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(credentials),
            });
            if (!res.ok) {
                const error = await res.json();
                throw new Error(error.error || 'Login failed');
            }
            return res.json();
        },
        register: async (credentials: any) => {
            const res = await fetch(`${API_BASE_URL}/auth/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(credentials),
            });
            if (!res.ok) {
                const error = await res.json();
                throw new Error(error.error || 'Registration failed');
            }
            return res.json();
        }
    },
    tasks: {
        getAll: async (): Promise<Task[]> => {
            const res = await fetch(`${API_BASE_URL}/tasks`, {
                headers: getAuthHeaders()
            });
            if (!res.ok) throw new Error('Failed to fetch tasks');
            const data = await res.json();
            return parseDates(data);
        },
        create: async (task: Partial<Task>): Promise<Task> => {
            // Remove ID if it's empty or temporary, let backend handle it or pass it if you rely on UUIDs
            const res = await fetch(`${API_BASE_URL}/tasks`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    ...getAuthHeaders()
                },
                body: JSON.stringify(task),
            });
            if (!res.ok) throw new Error('Failed to create task');
            const data = await res.json();
            return parseDates(data);
        },
        update: async (id: string, task: Partial<Task>): Promise<Task> => {
            const res = await fetch(`${API_BASE_URL}/tasks/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    ...getAuthHeaders()
                },
                body: JSON.stringify(task),
            });
            if (!res.ok) throw new Error('Failed to update task');
            const data = await res.json();
            return parseDates(data);
        },
        delete: async (id: string): Promise<void> => {
            const res = await fetch(`${API_BASE_URL}/tasks/${id}`, {
                method: 'DELETE',
                headers: getAuthHeaders()
            });
            if (!res.ok) throw new Error('Failed to delete task');
        },
    },
    hackathons: {
        getAll: async (): Promise<Hackathon[]> => {
            const res = await fetch(`${API_BASE_URL}/hackathons`, {
                headers: getAuthHeaders()
            });
            if (!res.ok) throw new Error('Failed to fetch hackathons');
            const data = await res.json();
            return parseDates(data);
        },
        create: async (hackathon: Partial<Hackathon>): Promise<Hackathon> => {
            const res = await fetch(`${API_BASE_URL}/hackathons`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    ...getAuthHeaders()
                },
                body: JSON.stringify(hackathon),
            });
            if (!res.ok) throw new Error('Failed to create hackathon');
            const data = await res.json();
            return parseDates(data);
        },
        update: async (id: string, hackathon: Partial<Hackathon>): Promise<Hackathon> => {
            const res = await fetch(`${API_BASE_URL}/hackathons/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    ...getAuthHeaders()
                },
                body: JSON.stringify(hackathon),
            });
            if (!res.ok) throw new Error('Failed to update hackathon');
            const data = await res.json();
            return parseDates(data);
        },
        delete: async (id: string): Promise<void> => {
            const res = await fetch(`${API_BASE_URL}/hackathons/${id}`, {
                method: 'DELETE',
                headers: getAuthHeaders()
            });
            if (!res.ok) throw new Error('Failed to delete hackathon');
        },
    },
    notifications: {
        testEmail: async (): Promise<void> => {
            const res = await fetch(`${API_BASE_URL}/notifications/test`, {
                method: 'POST',
            });
            if (!res.ok) throw new Error('Failed to trigger test email');
        }
    }
};
