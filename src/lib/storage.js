import { supabase } from "./supabaseClient";

const BUCKET = "media";

// Uploads a File to the "media" storage bucket under the given folder and
// returns its public URL. Used by the admin content/news/staff/gallery
// managers whenever an admin picks a new image.
export async function uploadImage(file, folder = "uploads") {
  if (!file) return null;

  const ext = file.name.split(".").pop();
  const path = `${folder}/${crypto.randomUUID()}.${ext}`;

  const { error } = await supabase.storage.from(BUCKET).upload(path, file, {
    cacheControl: "3600",
    upsert: false,
  });
  if (error) throw error;

  const { data } = supabase.storage.from(BUCKET).getPublicUrl(path);
  return data.publicUrl;
}
