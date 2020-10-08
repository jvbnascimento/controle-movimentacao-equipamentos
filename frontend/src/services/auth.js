import api from '../services/api';

export async function singIn(data) {
    const response = await api.post(`/login/verify/`, data[0]);
    return [response, data[1]];
}