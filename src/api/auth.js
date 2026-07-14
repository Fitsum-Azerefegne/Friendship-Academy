import { supabase } from "../lib/supabaseClient";

// Signs in using Supabase Auth (email/password). The admin user must be
// created once in the Supabase dashboard — see README for the exact steps.
export async function login(email, password) {
  const { data, error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) throw error;
  return data; // { user, session }
}

export async function logoutRequest() {
  await supabase.auth.signOut();
}

export async function getSession() {
  const { data } = await supabase.auth.getSession();
  return data.session;
}
