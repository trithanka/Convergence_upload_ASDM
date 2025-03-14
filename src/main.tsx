import { createRoot } from "react-dom/client";
import "./index.css";
import "./custom.css";
import App from "./App.tsx";
import { BrowserRouter } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; 
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"; 
import useAuthStore from "./utils/cookies.ts";
import CustomModal from "./components/ui/CustomModal.tsx";


const queryClient = new QueryClient();

const initializeAuth = useAuthStore.getState().initializeAuth;

initializeAuth(); 

createRoot(document.getElementById("root")!).render(

  <QueryClientProvider client={ queryClient }> 
    <BrowserRouter>
      <CustomModal />
      <App />
      <ToastContainer
        position="top-center"
        autoClose={ 3000 }
        hideProgressBar={ false }
        closeOnClick
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </BrowserRouter>
  </QueryClientProvider>

);

