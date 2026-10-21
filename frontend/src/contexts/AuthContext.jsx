import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

const API_URL = import.meta.env.VITE_API_URL || "/api";
const TOKEN_KEY = "token";
const TOKEN_TYPE_KEY = "token_type";
const emailAvatar = (email) =>
  `https://picsum.photos/seed/${encodeURIComponent(email || "novalorx")}/160/160`;

const AuthContext = createContext(null);

async function readResponse(response) {
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(data?.error || "Something went wrong");
  }
  return data;
}

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(() =>
    localStorage.getItem(TOKEN_TYPE_KEY) === "EMAIL"
      ? localStorage.getItem(TOKEN_KEY)
      : null,
  );
  const [clerkActions, setClerkActions] = useState(null);
  const [clerkSignedIn, setClerkSignedIn] = useState(false);
  const [loading, setLoading] = useState(true);
  // const [ isAdmin, setIsAdmin ] = useState(false);

  const clearSession = useCallback(() => {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(TOKEN_TYPE_KEY);
    setToken(null);
    setUser(null);
    setClerkSignedIn(false);
  }, []);

  const fetchProfile = useCallback(async (authToken) => {
    const response = await fetch(`${API_URL}/auth/profile`, {
      headers: { Authorization: `Bearer ${authToken}` },
    });
    return readResponse(response);
  }, []);

  useEffect(() => {
    if (!token) {
      setLoading(false);
      return;
    }

    let active = true;
    fetchProfile(token)
      .then((data) => {
        if (active) {
          setUser((currentUser) => ({
            ...data.user,
            imageUrl: currentUser?.imageUrl || emailAvatar(data.user.email),
          }));
        }
      })
      .catch(() => {
        if (active) clearSession();
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [clearSession, fetchProfile, token]);

  const login = useCallback(async (credentials) => {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(credentials),
    });
    const data = await readResponse(response);

    if (!data.token || !data.user) {
      throw new Error("Login response was incomplete");
    }

    localStorage.setItem(TOKEN_KEY, data.token);
    localStorage.setItem(TOKEN_TYPE_KEY, "EMAIL");
    setToken(data.token);
    setUser({ ...data.user, imageUrl: emailAvatar(data.user.email) });
    setClerkSignedIn(false);
    return data;
  }, []);

  const signup = useCallback(async (details) => {
    const response = await fetch(`${API_URL}/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(details),
    });
    return readResponse(response);
  }, []);

  const resetPassword = useCallback(async (details) => {
    const response = await fetch(`${API_URL}/auth/reset-password`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(details),
    });
    return readResponse(response);
  }, []);

  const updateProfile = useCallback(
    async (details) => {
      const response = await fetch(`${API_URL}/auth/profile`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
        body: JSON.stringify(details),
      });
      const data = await readResponse(response);
      setUser((currentUser) => ({
        ...data.user,
        imageUrl: currentUser?.imageUrl || emailAvatar(data.user.email),
      }));
      return data;
    },
    [token],
  );

  const changePassword = useCallback(
    async (details) => {
      const response = await fetch(`${API_URL}/auth/profile/password`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: "Bearer " + token,
        },
        body: JSON.stringify(details),
      });
      return readResponse(response);
    },
    [token],
  );

  const syncClerkSession = useCallback(
    async (getToken, imageUrl) => {
      const clerkToken = await getToken();
      if (!clerkToken) return;

      const response = await fetch(`${API_URL}/auth/clerk/sync`, {
        method: "POST",
        headers: { Authorization: `Bearer ${clerkToken}` },
      });
      const data = await readResponse(response);
      setUser({ ...data.user, imageUrl });
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(TOKEN_TYPE_KEY);
      setToken(clerkToken);
      setClerkSignedIn(true);
    },
    [fetchProfile],
  );

  const registerClerkActions = useCallback((actions) => {
    setClerkActions(actions);
    setClerkSignedIn(actions.isSignedIn);
  }, []);

  const logout = useCallback(async () => {
    const activeToken = token;
    try {
      if (activeToken) {
        await fetch(`${API_URL}/auth/logout`, {
          method: "POST",
          headers: { Authorization: `Bearer ${activeToken}` },
        });
      }
    } finally {
      if (clerkActions?.signOut) await clerkActions.signOut();
      clearSession();
    }
  }, [clearSession, clerkActions, token]);

  const value = useMemo(
    () => ({
      user,
      token,
      loading,
      isLoggedIn: Boolean(user) || clerkSignedIn,
      isAdmin: user?.role === "ADMIN",
      login,
      signup,
      resetPassword,
      updateProfile,
      changePassword,
      logout,
      openClerkSignIn: clerkActions?.openSignIn,
      registerClerkActions,
      syncClerkSession,
      clearSession,
    }),
    [
      clearSession,
      clerkActions,
      clerkSignedIn,
      loading,
      login,
      logout,
      registerClerkActions,
      resetPassword,
      updateProfile,
      changePassword,
      signup,
      syncClerkSession,
      token,
      user,
    ],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used inside an AuthProvider");
  }
  return context;
}
