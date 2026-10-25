import { BrowserRouter } from "react-router-dom";
import {
  ClerkProvider,
  useAuth as useClerkAuth,
  useClerk,
  useUser,
} from "@clerk/clerk-react";
import { useEffect } from "react";
import { ThemeProvider } from "./contexts/themeContext.jsx";
import { AuthProvider, useAuth } from "./contexts/AuthContext.jsx";
import { ToastProvider } from "./contexts/ToastContext.jsx";
import App from "./App.jsx";
import { CartProvider } from "./contexts/CartContext.jsx";
import { AdminProvider } from "./contexts/adminContext.jsx";
import { ProductsProvider } from "./contexts/productsContext.jsx";

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY?.trim();

export default function AppProviders() {
  const app = (
    <BrowserRouter>
      <ThemeProvider>
        <ToastProvider>
          <AuthProvider>
            <CartProvider>
              <AdminProvider>
                <ProductsProvider>
                  {PUBLISHABLE_KEY ? (
                    <ClerkSessionBridge>
                      <App />
                    </ClerkSessionBridge>
                  ) : (
                    <App />
                  )}
                </ProductsProvider>
              </AdminProvider>
            </CartProvider>
          </AuthProvider>
        </ToastProvider>
      </ThemeProvider>
    </BrowserRouter>
  );

  return PUBLISHABLE_KEY ? (
    <ClerkProvider publishableKey={PUBLISHABLE_KEY}>{app}</ClerkProvider>
  ) : (
    app
  );
}

function ClerkSessionBridge({ children }) {
  const { isSignedIn, getToken } = useClerkAuth();
  const { openSignIn, signOut } = useClerk();
  const { user: clerkUser } = useUser();
  const { registerClerkActions, syncClerkSession, clearSession } = useAuth();

  useEffect(() => {
    registerClerkActions({
      isSignedIn: Boolean(isSignedIn),
      openSignIn,
      signOut,
      imageUrl: clerkUser?.imageUrl,
    });
  }, [
    clerkUser?.imageUrl,
    isSignedIn,
    openSignIn,
    registerClerkActions,
    signOut,
  ]);

  useEffect(() => {
    if (isSignedIn) {
      syncClerkSession(getToken, clerkUser?.imageUrl).catch((error) => {
        console.error("Unable to sync Clerk session:", error);
        clearSession();
      });
    }
  }, [
    clearSession,
    clerkUser?.imageUrl,
    getToken,
    isSignedIn,
    syncClerkSession,
  ]);

  return children;
}
