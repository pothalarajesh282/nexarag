import { createContext, useContext, useEffect, useState, useRef } from "react";
import { supabase } from "../lib/supabase";

const AuthContext = createContext(null);

const INACTIVITY_TIME = 60 * 60 * 1000; // 1 hour

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  const inactivityTimer = useRef(null);

  const loadProfile = async (userId) => {
    const { data, error } = await supabase
      .from("profiles")
      .select("id, name, role")
      .eq("id", userId)
      .single();

    if (error) {
      console.error("Profile error:", error);
      setProfile(null);
      return;
    }

    setProfile(data);
  };

  // Reset the 1-hour inactivity timer
  const resetInactivityTimer = () => {
    if (inactivityTimer.current) {
      clearTimeout(inactivityTimer.current);
    }

    inactivityTimer.current = setTimeout(async () => {
      console.log("User inactive for 1 hour. Logging out.");

      await supabase.auth.signOut();

      setUser(null);
      setProfile(null);
    }, INACTIVITY_TIME);
  };

  useEffect(() => {
    let mounted = true;

    const initializeAuth = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!mounted) return;

      if (session?.user) {
        setUser(session.user);
        await loadProfile(session.user.id);

        // Start inactivity timer
        resetInactivityTimer();
      }

      setLoading(false);
    };

    initializeAuth();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      console.log("Auth event:", event);

      if (!mounted) return;

      if (session?.user) {
        setUser(session.user);

        setTimeout(() => {
          loadProfile(session.user.id);
        }, 0);

        resetInactivityTimer();
      } else {
        setUser(null);
        setProfile(null);

        if (inactivityTimer.current) {
          clearTimeout(inactivityTimer.current);
        }
      }

      setLoading(false);
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();

      if (inactivityTimer.current) {
        clearTimeout(inactivityTimer.current);
      }
    };
  }, []);

  // Detect user activity
  useEffect(() => {
    const activityEvents = [
      "mousedown",
      "mousemove",
      "keydown",
      "scroll",
      "touchstart",
      "click",
    ];

    const handleActivity = () => {
      if (user) {
        resetInactivityTimer();
      }
    };

    activityEvents.forEach((event) => {
      window.addEventListener(event, handleActivity);
    });

    return () => {
      activityEvents.forEach((event) => {
        window.removeEventListener(event, handleActivity);
      });
    };
  }, [user]);

  const logout = async () => {
    if (inactivityTimer.current) {
      clearTimeout(inactivityTimer.current);
    }

    const { error } = await supabase.auth.signOut();

    if (error) {
      throw error;
    }

    setUser(null);
    setProfile(null);
  };

  const value = {
    user,
    profile,
    role: profile?.role || null,
    loading,
    logout,
    isAdmin: profile?.role === "admin",
    isEmployee: profile?.role === "employee",
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }

  return context;
}
