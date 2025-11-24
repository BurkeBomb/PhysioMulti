import React from "react";
import { useClient } from "./context/ClientContext";
import PhysiotherapyQuoteBuilder from "./components/PhysiotherapyQuoteBuilder.jsx";
import AnaestheticQuoteForm from "./components/AnaestheticQuoteForm.jsx";
import { supabase } from "./lib/supabaseClient";

const App = () => {
  const { client, clientLoading, clientError } = useClient();

  if (!supabase) {
    return (
      <div className="app-shell">
        <header>
          <h1>AutoQuote – Supabase not configured</h1>
        </header>
        <main>
          <div className="quote-card">
            <p>
              Supabase is not configured. Add{" "}
              <code>VITE_SUPABASE_URL</code> and{" "}
              <code>VITE_SUPABASE_ANON_KEY</code> to your <code>.env</code>{" "}
              file, restart <code>npm run dev</code>, and refresh.
            </p>
          </div>
        </main>
      </div>
    );
  }

  if (clientLoading) return <div>Loading your practice...</div>;
  if (clientError)
    return (
      <div className="quote-card">
        <p>Error loading practice: {clientError}</p>
      </div>
    );
  if (!client) return <div>No practice profile linked to this user.</div>;

  const { specialty, practice_name, contact_name } = client;

  const renderBuilder = () => {
    switch (specialty) {
      case "physio":
        return <PhysiotherapyQuoteBuilder client={client} />;
      case "anaesthetic":
        return <AnaestheticQuoteForm client={client} />;
      default:
        return (
          <div className="quote-card">
            <p>
              No quote builder configured for specialty:{" "}
              <strong>{specialty}</strong>.
            </p>
            <p>Please contact support to configure your quote builder.</p>
          </div>
        );
    }
  };

  const handleLogout = async () => {
    if (supabase) {
      await supabase.auth.signOut();
    }
    window.location.href = "/login";
  };

  return (
    <div className="app-shell">
      <header>
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            gap: "1rem",
          }}
        >
          <div>
            <h1>{practice_name} – AutoQuote</h1>
            <div style={{ fontSize: "0.85rem", opacity: 0.9 }}>
              {contact_name && <>Contact: {contact_name} • </>}
              Specialty: {specialty}
            </div>
          </div>
          <button
            onClick={handleLogout}
            style={{
              border: "none",
              borderRadius: "999px",
              padding: "0.35rem 0.9rem",
              background: "#f97316",
              color: "white",
              fontSize: "0.85rem",
              cursor: "pointer",
            }}
          >
            Logout
          </button>
        </div>
      </header>
      <main>{renderBuilder()}</main>
    </div>
  );
};

export default App;
