import {
    createContext,
    useContext,
    useState
} from "react";

interface AuthContextType {
    user: any;
    setUser: React.Dispatch<any>;
}

const AuthContext =
    createContext<AuthContextType>(
        {} as AuthContextType
    );

export const AuthProvider = ({
    children
}: any) => {

    const [user, setUser] = useState(null);

    return (
        <AuthContext.Provider
            value={{
                user,
                setUser
            }}
        >
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () =>
    useContext(AuthContext);