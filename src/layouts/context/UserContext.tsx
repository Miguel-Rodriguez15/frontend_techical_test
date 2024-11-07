import type { ReactNode } from 'react';

import React, { useMemo, useState, useContext, createContext } from 'react';

interface UserContextType {
    userId: string | null;
    decodeToken: () => void; 
}

const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [userId, setUserId] = useState<string | null>(null);

    const decodeToken = () => {
        const token = localStorage.getItem('token');
        if (token) {
            try {
                const payload = token.split('.')[1];
                if (!payload) throw new Error("Token no válido");
                const decodedPayload = JSON.parse(atob(payload));
                setUserId(decodedPayload.id); 
            } catch (error) {
                console.error("Error al decodificar el token:", error.message);
            }
        }
    };

    const value = useMemo(() => ({ userId, decodeToken }), [userId]);

    return (
        <UserContext.Provider value={value}>
            {children}
        </UserContext.Provider>
    );
};

export const useUser = () => {
    const context = useContext(UserContext);
    if (!context) {
        throw new Error('useUser must be used within a UserProvider');
    }
    return context;
};