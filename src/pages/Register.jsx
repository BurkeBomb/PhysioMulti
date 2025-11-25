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

  navigate("/app");
};
