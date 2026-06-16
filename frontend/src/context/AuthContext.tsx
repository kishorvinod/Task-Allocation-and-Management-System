import React, {
    createContext,
    useContext,
    useEffect,
    useState
} from "react";

import { getCurrentUser } from "../services/auth.service";

interface AuthContextType {
    user: any;
    loading: boolean;
    setUser: React.Dispatch<React.SetStateAction<any>>;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType>(
    {} as AuthContextType
);

export const AuthProvider = ({
    children
}: {
    children: React.ReactNode;
}) => {

    const [user, setUser] = useState<any>(null);

    const [loading, setLoading] =
        useState(true);

    useEffect(() => {

        const loadUser = async () => {

            try {

                const token =
                    localStorage.getItem(
                        "token"
                    );

                if (!token) {
                    setLoading(false);
                    return;
                }

                const response =
                    await getCurrentUser();

                setUser(response.data);

            } catch {

                localStorage.removeItem(
                    "token"
                );

            } finally {

                setLoading(false);

            }
        };

        loadUser();

    }, []);

    const logout = () => {

        localStorage.removeItem(
            "token"
        );

        setUser(null);
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                loading,
                setUser,
                logout
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () =>
    useContext(AuthContext);