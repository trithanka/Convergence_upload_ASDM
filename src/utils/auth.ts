import useAuthStore from "./cookies";
// Check if the user is authenticated
export const isAuthenticated = (): boolean => {
  // eslint-disable-next-line react-hooks/rules-of-hooks
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  return isAuthenticated;
};
