import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import Cookies from 'js-cookie';

// Define the user details interface
interface UserDetails {
  username: string;
  departmentId: string;
  adminLoginId: string;
  isDept: string;
  vsDepartmentName	: string
}

// Define the Zustand store interface
interface AuthStore {
  token: string | null;
  userDetails: UserDetails | null;
  isAuthenticated: boolean;
  setAuth: (token: string, userDetails: UserDetails) => void;
  clearAuth: () => void;
  initializeAuth: () => void;
}

const useAuthStore = create<AuthStore>()(
  devtools((set) => {
    let logoutTimer: NodeJS.Timeout | null = null; // Store logout timer

    return {
      token: null,
      userDetails: null,
      isAuthenticated: false,

      setAuth: (token: string, userDetails: UserDetails) => {
        const oneDayInMilliseconds = 24 * 60 * 60 * 1000; 
        const expiryTime = new Date().getTime() + oneDayInMilliseconds;
        
        Cookies.set('token', token, { expires: 1, path: '/' }); // 1 day
        Cookies.set('userDetails', JSON.stringify(userDetails), { expires: 1, path: '/' });

        set({ token, userDetails, isAuthenticated: true });

        // Clear any existing timer
        if (logoutTimer) clearTimeout(logoutTimer);

        // Auto logout when token expires
        logoutTimer = setTimeout(() => {
          set({ token: null, userDetails: null, isAuthenticated: false });
          Cookies.remove('token', { path: '/' });
          Cookies.remove('userDetails', { path: '/' });
        }, expiryTime - new Date().getTime());
      },

      clearAuth: () => {
        Cookies.remove('token', { path: '/' });
        Cookies.remove('userDetails', { path: '/' });
        set({ token: null, userDetails: null, isAuthenticated: false });
      
      },

      initializeAuth: () => {
        const token = Cookies.get('token');
        const userDetails = Cookies.get('userDetails');

        if (token && userDetails) {
          set({ token, userDetails: JSON.parse(userDetails), isAuthenticated: true });
        } else {
          set({ isAuthenticated: false });
          
        }
      },
    };
  })
);

export default useAuthStore;
