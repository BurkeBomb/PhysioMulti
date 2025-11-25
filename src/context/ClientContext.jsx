import React, { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import { useAuth } from "./AuthContext";

const ClientContext = createContext(null);

export const useClient = () => useContext(ClientContext);

export const ClientProvider = ({ children }) => {
  const { user } = useAuth();
  const [client, setClient] = useState(null);
  const [clientLoading, setClientLoading] = useState(true);
  const [clientError, setClientError] = useState(null);

  useEffect(() => {
    const loadClient = async () => {
      if (!user || !supabase) {
        setClient(null);
        setClientLoading(false);
        if (!supabase) {
          setClientError(
            "Supabase is not configured, client profile cannot be loaded."
          );
        }
        return;
      }

      setClientLoading(true);
      setClientError(null);

      const { data, error } = await supabase
      .from("clients")
      .select("*")
      .eq("user_id", user.id)
      .maybeSingle();

      if (error) {
        console.error("Error loading client", error);
        setClient(null);
        setClientError(error.message);
      } else {
        setClient(data);
      }

      setClientLoading(false);
    };

    loadClient();
  }, [user]);

  const value = { client, setClient, clientLoading, clientError };

  return (
    <ClientContext.Provider value={value}>{children}</ClientContext.Provider>
  );
};
