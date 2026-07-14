import axios from 'axios';

export const api = axios.create({
    baseURL: 'http://localhost:5000'
});

api.interceptors.request.use(c => {
    const token = localStorage.getItem('accessToken');
    if (token)
        c.headers.Authorization = `Bearer ${token}`;
    return c;
});

api.interceptors.response.use(
    r => r,
    async error => {
        const request = error.config;

        if (error.response?.status === 401 && !request._retry) {
            const refreshToken = localStorage.getItem('refreshToken');

            if (!refreshToken) {
                localStorage.clear();
                return Promise.reject(error);
            }

            request._retry = true;

            try {
                const result = await axios.post(
                    'http://localhost:5000/auth/refresh',
                    { refreshToken }
                );

                const tokens = result.data.data;

                localStorage.setItem('accessToken', tokens.accessToken);
                localStorage.setItem('refreshToken', tokens.refreshToken);

                request.headers.Authorization = `Bearer ${tokens.accessToken}`;

                return api(request);
            }
            catch {
                localStorage.clear();
                location.assign('/login');
            }
        }

        return Promise.reject(error);
    });

export const unwrap = <T>(response: { data: { data: T } }) =>
    response.data.data;