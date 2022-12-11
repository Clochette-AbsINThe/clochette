import { getJwtInCookie } from '@utils/auth_internal_api';
import { createContext, useContext, useEffect, useState } from 'react';

export const AppContext = createContext<{ jwt: string | null; setJwt: (jwt: string | null) => void; authenticated: boolean }>({ jwt: null, setJwt: (jwt: string | null) => {}, authenticated: false });

const getJwt = async () => {
    const { data } = await getJwtInCookie();
    return data;
};

export function AppContextProvider({ children }: { children: React.ReactNode }): JSX.Element {
    const [jwt, setJwt] = useState<string | null>(null);

    // We update the context with the jwt from the cookie in the base layout because we want to have the jwt in the context in all the pages
    useEffect(() => {
        if (jwt === null) {
            getJwt().then((data) => {
                if (data.jwt) {
                    setJwt(data.jwt);
                } else {
                    setJwt(null);
                }
            });
        }
    }, []);

    return <AppContext.Provider value={{ jwt, setJwt, authenticated: jwt !== null }}>{children}</AppContext.Provider>;
}

export const useAuthContext = () => useContext(AppContext);
