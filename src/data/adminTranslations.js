// Hardcoded English <-> Amharic strings for the admin dashboard's static
// chrome (sidebar, page headers, buttons). Actual CRUD content (news
// articles, staff records, messages) is left as entered by the admin.
// "Friendship" is intentionally kept untranslated (brand name) in Amharic mode.

export const adminTranslations = {
  en: {
    brand: "Friendship Admin",
    brandSubtitle: "Content Management",
    nav: {
      dashboard: "Dashboard",
      content: "Content Editor",
      news: "News Manager",
      staff: "Staff Manager",
      gallery: "Gallery Manager",
      messages: "Messages",
    },
    viewWebsite: "View Website",
    logOut: "Log Out",

    // Login
    loginTitle: "Admin Sign In",
    loginSubtitle: "Manage the Friendship Academy website",
    email: "Email",
    password: "Password",
    signIn: "Sign In",
    signingIn: "Signing in…",
    demoCreds: "Demo credentials: admin@school.edu / admin123",

    // Dashboard
    welcomeBack: "Welcome back",
    dashboardSubtitle: "Here's what's happening on the website today.",
    statNews: "News Articles",
    statStaff: "Staff Members",
    statGallery: "Gallery Images",
    statMessages: "Unread Messages",
    recentNews: "Recent News",
    recentMessages: "Recent Messages",
    manage: "Manage",
    viewAll: "View all",

    // Page headers
    contentEditorTitle: "Content Editor",
    contentEditorDesc: "Edit the homepage text and hero image.",
    newsManagerTitle: "News Manager",
    newsManagerDesc: "Add, edit, or remove news articles.",
    newArticle: "New Article",
    staffManagerTitle: "Staff Manager",
    staffManagerDesc: "Add, edit, or remove staff directory entries.",
    addStaff: "Add Staff",
    galleryManagerTitle: "Gallery Manager",
    galleryManagerDesc: "Upload photos and organize them by category.",
    uploadImage: "Upload Image",
    messagesTitle: "Messages",
    messagesDesc: "View and manage contact form submissions.",
  },
  am: {
    brand: "ወዳጅነት አድሚን",
    brandSubtitle: "የይዘት አስተዳደር",
    nav: {
      dashboard: "ዳሽቦርድ",
      content: "የይዘት አርታዒ",
      news: "የዜና አስተዳዳሪ",
      staff: "የሰራተኞች አስተዳዳሪ",
      gallery: "የማዕከለ-ስዕላት አስተዳዳሪ",
      messages: "መልዕክቶች",
    },
    viewWebsite: "ድህረ ገጹን ይመልከቱ",
    logOut: "ውጣ",

    // Login
    loginTitle: "የአስተዳዳሪ መግቢያ",
    loginSubtitle: "የወዳጅነት አካዳሚ ድህረ ገጽን ያስተዳድሩ",
    email: "ኢሜይል",
    password: "የይለፍ ቃል",
    signIn: "ግባ",
    signingIn: "በመግባት ላይ…",
    demoCreds: "የማሳያ መረጃ፡ admin@school.edu / admin123",

    // Dashboard
    welcomeBack: "እንኳን ደህና መጡ",
    dashboardSubtitle: "ዛሬ በድህረ ገጹ ላይ እየተከናወነ ያለው ይህ ነው።",
    statNews: "የዜና ጽሁፎች",
    statStaff: "ሰራተኞች",
    statGallery: "የማዕከለ-ስዕላት ምስሎች",
    statMessages: "ያልተነበቡ መልዕክቶች",
    recentNews: "የቅርብ ጊዜ ዜናዎች",
    recentMessages: "የቅርብ ጊዜ መልዕክቶች",
    manage: "አስተዳድር",
    viewAll: "ሁሉንም ይመልከቱ",

    // Page headers
    contentEditorTitle: "የይዘት አርታዒ",
    contentEditorDesc: "የመነሻ ገጹን ጽሑፍ እና ዋና ምስል ያስተካክሉ።",
    newsManagerTitle: "የዜና አስተዳዳሪ",
    newsManagerDesc: "የዜና ጽሁፎችን ያክሉ፣ ያስተካክሉ ወይም ያስወግዱ።",
    newArticle: "አዲስ ጽሁፍ",
    staffManagerTitle: "የሰራተኞች አስተዳዳሪ",
    staffManagerDesc: "የሰራተኞች ዝርዝር ያክሉ፣ ያስተካክሉ ወይም ያስወግዱ።",
    addStaff: "ሰራተኛ ያክሉ",
    galleryManagerTitle: "የማዕከለ-ስዕላት አስተዳዳሪ",
    galleryManagerDesc: "ፎቶዎችን ይስቀሉ እና በምድብ ያደራጁ።",
    uploadImage: "ምስል ስቀል",
    messagesTitle: "መልዕክቶች",
    messagesDesc: "የመገናኛ ቅጽ ማስገቢያዎችን ይመልከቱ እና ያስተዳድሩ።",
  },
};
