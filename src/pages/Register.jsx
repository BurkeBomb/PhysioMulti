import React, { useState } from "react";
import { supabase } from "../lib/supabaseClient";
import { useNavigate, Link } from "react-router-dom";

const Register = () => {
  const navigate = useNavigate();

  const [form, setForm] = useState({
    email: "",
    password: "",
    practice_name: "",
    specialty: "physio",
    contact_name: "",
    phone: "",
    address: "",
    registration_no: "",
    bank_name: "",
    bank_account: "",
    bank_branch: "",
  });

  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");

    if (!supabase) {
      setErrorMsg(
        "Supabase is not configured. Check src/lib/supabaseClient.js."
      );
      setLoading(false);
      return;
    }

    // 1) Create auth user
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email: form.email,
      password: form.password,
    });

    if (authError || !authData?.user) {
      console.error("signUp error:", authError);
      setErrorMsg(authError?.message || "Registration failed");
      setLoading(false);
      return;
    }

    const userId = authData.user.id;

    // 2) Insert practice row
    const { error: clientError } = await supabase.from("clients").insert({
      user_id: userId,
      practice_name: form.practice_name,
      specialty: form.specialty,
      contact_name: form.contact_name,
      email: form.email,
      phone: form.phone,
      address: form.address,
      registration_no: form.registration_no,
      bank_name: form.bank_name,
      bank_account: form.bank_account,
      bank_branch: form.bank_branch,
    });

    if (clientError) {
      console.error("Insert clients error:", clientError);
      setErrorMsg("Failed to save practice details");
      setLoading(false);
      return;
    }

    // 3) Go to app – ClientContext will load their practice
    navigate("/app");
  };

  return (
    <div className="auth-page">
      <h1>Register your Practice</h1>
      <form onSubmit={handleSubmit}>
        <h2>Login details</h2>

        <label>
          Email
          <input
            name="email"
            type="email"
            value={form.email}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          Password
          <input
            name="password"
            type="password"
            value={form.password}
            onChange={handleChange}
            required
          />
        </label>

        <h2>Practice details</h2>

        <label>
          Practice name
          <input
            name="practice_name"
            value={form.practice_name}
            onChange={handleChange}
            required
          />
        </label>

        <label>
          Specialty
          <select
            name="specialty"
            value={form.specialty}
            onChange={handleChange}
          >
            <option value="physio">Physiotherapy</option>
            <option value="anaesthetic">Anaesthetist</option>
            <option value="neuro">Neuromonitoring</option>
            <option value="other">Other</option>
          </select>
        </label>

        <label>
          Contact person
          <input
            name="contact_name"
            value={form.contact_name}
            onChange={handleChange}
          />
        </label>

        <label>
          Phone
          <input
            name="phone"
            value={form.phone}
            onChange={handleChange}
          />
        </label>

        <label>
          Address
          <textarea
            name="address"
            value={form.address}
            onChange={handleChange}
          />
        </label>

        <label>
          Practice / HPCSA number
          <input
            name="registration_no"
            value={form.registration_no}
            onChange={handleChange}
          />
        </label>

        <h2>Bank details</h2>

        <label>
          Bank name
          <input
            name="bank_name"
            value={form.bank_name}
            onChange={handleChange}
          />
        </label>

        <label>
          Account number
          <input
            name="bank_account"
            value={form.bank_account}
            onChange={handleChange}
          />
        </label>

        <label>
          Branch code
          <input
            name="bank_branch"
            value={form.bank_branch}
            onChange={handleChange}
          />
        </label>

        {errorMsg && <p className="error">{errorMsg}</p>}

        <button type="submit" disabled={loading}>
          {loading ? "Creating account..." : "Register"}
        </button>
      </form>

      <p>
        Already have an account? <Link to="/login">Login</Link>
      </p>
    </div>
  );
};

export default Register;
