import { supabase } from "../lib/supabaseClient";
import { mockNews } from "../data/mockData";

// GET /news
export async function getNews() {
  const { data, error } = await supabase
    .from("news")
    .select("*")
    .order("date", { ascending: false });

  if (error) {
    console.warn("[news] falling back to demo content:", error.message);
    return mockNews;
  }
  return data;
}

// POST /news
export async function createNews(payload) {
  const { data, error } = await supabase
    .from("news")
    .insert({
      title: payload.title,
      excerpt: payload.excerpt,
      body: payload.body,
      image: payload.image,
      category: payload.category,
      author: payload.author,
      date: payload.date,
    })
    .select()
    .single();
  if (error) throw error;
  return data;
}

// PUT /news/:id
export async function updateNews(id, payload) {
  const { data, error } = await supabase
    .from("news")
    .update({
      title: payload.title,
      excerpt: payload.excerpt,
      body: payload.body,
      image: payload.image,
      category: payload.category,
      author: payload.author,
      date: payload.date,
    })
    .eq("id", id)
    .select()
    .single();
  if (error) throw error;
  return data;
}

// DELETE /news/:id
export async function deleteNews(id) {
  const { error } = await supabase.from("news").delete().eq("id", id);
  if (error) throw error;
  return { success: true };
}
