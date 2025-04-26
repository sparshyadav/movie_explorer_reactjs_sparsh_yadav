import { createContext, useState, ReactNode } from 'react';

type User = {
    email: string;
    mobile_number: string;
    name: string;
    role: string;
}

type UserContextType = {
    user: User | null;
    setUser: (user: User | null) => void;
};


export const UserContext = createContext<UserContextType | undefined>(undefined);

export const UserProvider = ({ children }: { children: ReactNode }) => {
    const [user, setUser] = useState<User | null>(null);

    return (
        <UserContext.Provider value={{ user, setUser }}>
            {children}
        </UserContext.Provider>
    )
};

export default UserContext;