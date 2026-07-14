import { supabase } from "../lib/supabaseClient";
import { mockStaff } from "../data/mockData";

// GET /staff
export async function getStaff() {
  const { data, error } = await supabase.from("staff").select("*").order("name");
  if (error) {
    console.warn("[staff] falling back to demo content:", error.message);
    return mockStaff;
  }
  return data;
}

// POST /staff
export async function createStaff(payload) {
  const { data, error } = await supabase
    .from("staff")
    .insert({
      name: payload.name,
      title: payload.title,
      department: payload.department,
      email: payload.email,
      photo: payload.photo,
    })
    .select()
    .single();
  if (error) throw error;
  return data;
}

// PUT /staff/:id
export async function updateStaff(id, payload) {
  const { data, error } = await supabase
    .from("staff")
    .update({
      name: payload.name,
      title: payload.title,
      department: payload.department,
      email: payload.email,
      photo: payload.photo,
    })
    .eq("id", id)
    .select()
    .single();
  if (error) throw error;
  return data;
}

// DELETE /staff/:id
export async function deleteStaff(id) {
  const { error } = await supabase.from("staff").delete().eq("id", id);
  if (error) throw error;
  return { success: true };
}
