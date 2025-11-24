import React, { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";

const AuthContext = createContext(null);

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [authLoading, setAuthLoading] = useState(true);
  const [authError, setAuthError] = useState(null);

  useEffect(() => {
    const init = async () => {
      if (!supabase) {
        // No Supabase client – just disable auth but don't crash the app.
        setAuthError(
          "Supabase is not configured. Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY."
        );
        setUser(null);
        setAuthLoading(false);
        return;
      }

      try {
        const {
          data: { session },
          error,
        } = await supabase.auth.getSession();

        if (error) {
          console.error("Supabase getSession error", error);
          setAuthError(error.message);
        } else {
          setUser(session?.user ?? null);
          setAuthError(null);
        }
      } catch (err) {
        console.error("Supabase getSession threw", err);
        setAuthError(String(err));
      } finally {
        setAuthLoading(false);
      }

      const {
        data: { subscription },
      } = supabase.auth.onAuthStateChange((_event, session) => {
        setUser(session?.user ?? null);
      });

      return () => subscription.unsubscribe();
    };

    init();
  }, []);

  const value = { user, authLoading, authError };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
