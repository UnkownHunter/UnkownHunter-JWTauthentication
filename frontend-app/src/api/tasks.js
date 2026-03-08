import { endpoints, apiFetch } from './config';

export const getTasks = async () => {
    // --- REAL IMPLEMENTATION ---
    return apiFetch(endpoints.tasks.base);
};

export const createTask = async (taskData) => {
    // --- REAL IMPLEMENTATION ---
    return apiFetch(endpoints.tasks.base, {
        method: 'POST',
        body: JSON.stringify(taskData)
    });
};

export const updateTask = async (id, taskData) => {
    // --- REAL IMPLEMENTATION ---
    return apiFetch(`${endpoints.tasks.base}/${id}`, {
        method: 'PUT',
        body: JSON.stringify(taskData)
    });
};

export const deleteTask = async (id) => {
    // --- REAL IMPLEMENTATION ---
    return apiFetch(`${endpoints.tasks.base}/${id}`, {
        method: 'DELETE'
    });
};
