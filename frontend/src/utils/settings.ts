export const SECRET_KEY = process.env.SECRET_KEY;

export const environmentVariable = {
    BASE_URL: process.env.NEXT_PUBLIC_BASE_URL,
    BACKEND_API_URL: process.env.NEXT_PUBLIC_BACKEND_API_URL,
    INTERNAL_API_URL: process.env.NEXT_PUBLIC_BASE_URL + '/internal-api'
};
