import { supabase } from "../lib/supabaseClient";
import { mockMessages } from "../data/mockData";

// GET /messages
export async function getMessages() {
  const { data, error } = await supabase
    .from("messages")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) {
    console.warn("[messages] falling back to demo content:", error.message);
    return mockMessages;
  }
  return data;
}

// Public contact form submission (anon insert, allowed by RLS policy).
export async function submitMessage(payload) {
  const { data, error } = await supabase
    .from("messages")
    .insert({
      name: payload.name,
      email: payload.email,
      subject: payload.subject,
      message: payload.message,
    })
    .select()
    .single();
  if (error) throw error;
  return data;
}

// PUT /messages/:id/read
export async function markMessageRead(id) {
  const { data, error } = await supabase
    .from("messages")
    .update({ read: true })
    .eq("id", id)
    .select()
    .single();
  if (error) throw error;
  return data;
}

// DELETE /messages/:id
export async function deleteMessage(id) {
  const { error } = await supabase.from("messages").delete().eq("id", id);
  if (error) throw error;
  return { success: true };
}
