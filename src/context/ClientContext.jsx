import React, { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "../lib/supabaseClient";
import { useAuth } from "./AuthContext";

const ClientContext = createContext(null);

export const useClient = () => useContext(ClientContext);

export const ClientProvider = ({ children }) => {
  const { user } = useAuth();
  const [client, setClient] = useState(null);
  const [clientLoading, setClientLoading] = useState(true);

  useEffect(() => {
    const loadClient = async () => {
      if (!user) {
        setClient(null);
        setClientLoading(false);
        return;
      }

      setClientLoading(true);

      const { data, error } = await supabase
        .from("clients")
        .select("*")
        .eq("user_id", user.id)
        .single();

      if (error) {
        console.error("Error loading client", error);
        setClient(null);
      } else {
        setClient(data);
      }

      setClientLoading(false);
    };

    loadClient();
  }, [user]);

  const value = { client, setClient, clientLoading };

  return (
    <ClientContext.Provider value={value}>{children}</ClientContext.Provider>
  );
};
