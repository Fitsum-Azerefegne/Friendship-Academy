import { supabase } from "../lib/supabaseClient";
import { mockContent } from "../data/mockData";

// The site's editable copy lives in a single row (id = 1) in the
// "content" table — simplest way to model "one homepage's worth of text".
function fromRow(row) {
  if (!row) return mockContent;
  return {
    schoolName: row.school_name,
    schoolNameAm: row.school_name_am,
    tagline: row.tagline,
    taglineAm: row.tagline_am,
    heroImage: row.hero_image,
    stats: {
      students: row.stats_students,
      teachers: row.stats_teachers,
      yearsOpen: row.stats_years_open,
    },
    mission: row.mission,
    missionAm: row.mission_am,
    vision: row.vision,
    visionAm: row.vision_am,
    goal: row.goal,
    goalAm: row.goal_am,
    values: row.values ? JSON.parse(row.values) : mockContent.values,
    valuesAm: row.values_am ? JSON.parse(row.values_am) : mockContent.valuesAm,
    history: row.history,
    historyAm: row.history_am,
    principal: {
      name: row.principal_name,
      nameAm: row.principal_name_am,
      title: row.principal_title,
      titleAm: row.principal_title_am,
      photo: row.principal_photo,
      message: row.principal_message,
      messageAm: row.principal_message_am,
    },
    address: row.address,
    phone: row.phone,
    email: row.email,
    socials: {
      facebook: row.social_facebook,
      instagram: row.social_instagram,
      twitter: row.social_twitter,
      youtube: row.social_youtube,
    },
    mapEmbedUrl: row.map_embed_url,
  };
}

function toRow(content) {
  return {
    id: 1,
    school_name: content.schoolName,
    school_name_am: content.schoolNameAm,
    tagline: content.tagline,
    tagline_am: content.taglineAm,
    hero_image: content.heroImage,
    stats_students: content.stats?.students,
    stats_teachers: content.stats?.teachers,
    stats_years_open: content.stats?.yearsOpen,
    mission: content.mission,
    mission_am: content.missionAm,
    vision: content.vision,
    vision_am: content.visionAm,
    goal: content.goal,
    goal_am: content.goalAm,
    values: JSON.stringify(content.values),
    values_am: JSON.stringify(content.valuesAm),
    history: content.history,
    history_am: content.historyAm,
    principal_name: content.principal?.name,
    principal_name_am: content.principal?.nameAm,
    principal_title: content.principal?.title,
    principal_title_am: content.principal?.titleAm,
    principal_photo: content.principal?.photo,
    principal_message: content.principal?.message,
    principal_message_am: content.principal?.messageAm,
    address: content.address,
    phone: content.phone,
    email: content.email,
    social_facebook: content.socials?.facebook,
    social_instagram: content.socials?.instagram,
    social_twitter: content.socials?.twitter,
    social_youtube: content.socials?.youtube,
    map_embed_url: content.mapEmbedUrl,
  };
}

export async function getContent() {
  const { data, error } = await supabase.from("content").select("*").eq("id", 1).maybeSingle();
  if (error || !data) {
    console.warn("[content] falling back to demo content:", error?.message);
    return mockContent;
  }
  return fromRow(data);
}

export async function updateContent(payload) {
  const { data, error } = await supabase
    .from("content")
    .upsert(toRow(payload))
    .select()
    .single();
  if (error) throw error;
  return fromRow(data);
}
