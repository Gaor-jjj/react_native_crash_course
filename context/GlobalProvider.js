import { createContext, useContext, useState, useEffect } from 'react';
import { getCurrentUser } from 'lib/appwrite'; // Make sure this function correctly checks for an active session

const GlobalContext = createContext();
export const useGlobalContext = () => useContext(GlobalContext);

const GlobalProvider = ({ children }) => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const checkUserSession = async () => {
            try {
                const res = await getCurrentUser(); // Fetch the current user
                if (res) {
                    setIsLoggedIn(true); // User is logged in
                    setUser(res); // Set user details
                } else {
                    setIsLoggedIn(false); // No user found
                    setUser(null);
                }
            } catch (error) {
                console.error('Error fetching user session:', error);
                setIsLoggedIn(false); // Assume user is logged out on error
                setUser(null);
            } finally {
                setIsLoading(false); // Loading complete
            }
        };

        checkUserSession(); // Call the session check function
    }, []);

    return (
        <GlobalContext.Provider
            value={{
                isLoggedIn,
                user,
                setUser, 
                setIsLoggedIn,   
                isLoading,
            }}
        >
            {children}
        </GlobalContext.Provider>
    );
};

export default GlobalProvider;
