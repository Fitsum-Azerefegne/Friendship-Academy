import { supabase } from "../lib/supabaseClient";
import { uploadImage } from "../lib/storage";
import { mockGallery, mockGalleryEvents } from "../data/mockData";

// GET /gallery — each photo, with its event/album joined in if it has one.
export async function getGallery() {
  const { data, error } = await supabase
    .from("gallery")
    .select("*, event:gallery_events(id, year_ec, title_am, title_en, category)")
    .order("created_at", { ascending: false });
  if (error) {
    console.warn("[gallery] falling back to demo content:", error.message);
    return mockGallery;
  }
  return data;
}

// GET /gallery/events — the list of albums (year E.C. + Amharic title) that
// photos can be grouped under.
export async function getGalleryEvents() {
  const { data, error } = await supabase
    .from("gallery_events")
    .select("*")
    .order("year_ec", { ascending: false });
  if (error) {
    console.warn("[gallery] falling back to demo events:", error.message);
    return mockGalleryEvents;
  }
  return data;
}

// POST /gallery/events — create a new album.
export async function createGalleryEvent(payload) {
  const { data, error } = await supabase
    .from("gallery_events")
    .insert({
      year_ec: payload.yearEc,
      title_am: payload.titleAm,
      title_en: payload.titleEn,
      category: payload.category,
    })
    .select()
    .single();
  if (error) throw error;
  return data;
}

// DELETE /gallery/events/:id — photos in the album are kept, just unlinked.
export async function deleteGalleryEvent(id) {
  const { error } = await supabase.from("gallery_events").delete().eq("id", id);
  if (error) throw error;
  return { success: true };
}

// POST /gallery — expects a FormData with "image" (File), "category",
// "caption", and optionally "eventId" to file the photo under an album.
export async function uploadGalleryImage(formData) {
  const file = formData.get("image");
  const category = formData.get("category");
  const caption = formData.get("caption");
  const eventId = formData.get("eventId") || null;

  const imageUrl = await uploadImage(file, "gallery");

  const { data, error } = await supabase
    .from("gallery")
    .insert({ image: imageUrl, category, caption, event_id: eventId })
    .select("*, event:gallery_events(id, year_ec, title_am, title_en, category)")
    .single();
  if (error) throw error;
  return data;
}

// DELETE /gallery/:id
export async function deleteGalleryImage(id) {
  const { error } = await supabase.from("gallery").delete().eq("id", id);
  if (error) throw error;
  return { success: true };
}
