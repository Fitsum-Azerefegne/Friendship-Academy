// Hardcoded English <-> Amharic content for the homepage language toggle.
// "Friendship" is intentionally kept untranslated (brand name) in Amharic mode.

export const homeTranslations = {
  en: {
    schoolNameDisplay: "Friendship Academy",
    established: "Est. 1979",
    tagline: "Where Curiosity Becomes Character",
    applyButton: "Get in Touch",
    aboutButton: "Learn About Us",
    statsStudents: "Students",
    statsTeachers: "Teachers",
    statsEducating: "Educating",
    yearsSuffix: "yrs",
    quickLinks: [
      { to: "/news", label: "News", description: "Updates & announcements" },
      { to: "/academics", label: "Academics", description: "Curriculum & programs" },
      { to: "/gallery", label: "Gallery", description: "Campus life in pictures" },
      { to: "/contact", label: "Visit Us", description: "Directions & campus tours" },
    ],
    newsEyebrow: "Newsroom",
    newsTitle: "Latest News",
    newsDescription: "A running account of what's happening across our campuses.",
    viewAllNews: "View all news",
    eventsEyebrow: "Calendar",
    eventsTitle: "Upcoming Events",
    ctaTitle: "Considering Friendship Academy for your child?",
    ctaDescription:
      "Book a guided campus tour or send us a message — our team responds within one business day.",
    ctaApply: "Get in Touch",
    ctaTour: "Schedule a Tour",
    news: {
      n1: {
        title: "Friendship Academy Robotics Team Advances to National Finals",
        excerpt:
          "For the first time in school history, our robotics team has qualified for the national finals after a decisive win at the regional championship.",
        category: "Academics",
      },
      n2: {
        title: "New Library Wing Opens to Students",
        excerpt:
          "The long-awaited extension to the Whitfield Library officially opened its doors this week, adding reading nooks, a media lab, and quiet study rooms.",
        category: "Campus",
      },
      n3: {
        title: "Spring Arts Showcase Draws Record Crowd",
        excerpt:
          "Over 600 parents and community members attended this year's Spring Arts Showcase, featuring student work across painting, ceramics, and photography.",
        category: "Arts",
      },
    },
    events: {
      e1: { title: "Open Campus Day", location: "Main Campus" },
      e2: { title: "Fall Term Begins", location: "All Campuses" },
      e3: { title: "Robotics National Finals Send-off", location: "Auditorium" },
    },
  },
  am: {
    schoolNameDisplay: "ወዳጅነት አካዳሚ",
    established: "ከ1979 ጀምሮ",
    tagline: "የማወቅ ጉጉት ባህሪ የሚሆንበት",
    applyButton: "ያግኙን",
    aboutButton: "ስለ እኛ ይወቁ",
    statsStudents: "ተማሪዎች",
    statsTeachers: "መምህራን",
    statsEducating: "የትምህርት ዓመታት",
    yearsSuffix: "ዓመታት",
    quickLinks: [
      { to: "/news", label: "ዜናዎች", description: "ማሻሻያዎች እና ማስታወቂያዎች" },
      { to: "/academics", label: "አካዳሚክ", description: "ስርዓተ ትምህርት እና ፕሮግራሞች" },
      { to: "/gallery", label: "ማዕከለ-ስዕላት", description: "የግቢ ህይወት በስዕሎች" },
      { to: "/contact", label: "ይጎብኙን", description: "አቅጣጫዎች እና የግቢ ጉብኝቶች" },
    ],
    newsEyebrow: "የዜና ክፍል",
    newsTitle: "የቅርብ ጊዜ ዜናዎች",
    newsDescription: "በግቢዎቻችን ውስጥ እየተከናወነ ያለውን ተከታታይ ዘገባ።",
    viewAllNews: "ሁሉንም ዜናዎች ይመልከቱ",
    eventsEyebrow: "የቀን መቁጠሪያ",
    eventsTitle: "መጪ ዝግጅቶች",
    ctaTitle: "ልጅዎን ወደ ወዳጅነት አካዳሚ ማስገባት እያሰቡ ነው?",
    ctaDescription:
      "የግቢ ጉብኝት ያስይዙ ወይም መልእክት ይላኩልን — ቡድናችን በአንድ የስራ ቀን ውስጥ ምላሽ ይሰጣል።",
    ctaApply: "ያግኙን",
    ctaTour: "ጉብኝት ያስይዙ",
    news: {
      n1: {
        title: "የወዳጅነት አካዳሚ ሮቦቲክስ ቡድን ወደ ሀገር አቀፍ ፍጻሜ አለፈ",
        excerpt:
          "ለትምህርት ቤታችን ታሪክ ለመጀመሪያ ጊዜ፣ የሮቦቲክስ ቡድናችን በክልላዊ ሻምፒዮና ወሳኝ ድል በማግኘት ወደ ሀገር አቀፍ ፍጻሜ አልፏል።",
        category: "አካዳሚክ",
      },
      n2: {
        title: "አዲስ የቤተ መጻሕፍት ክንፍ ለተማሪዎች ተከፈተ",
        excerpt:
          "የዊትፊልድ ቤተ መጻሕፍት ማራዘሚያ በዚህ ሳምንት በይፋ ተከፍቷል፣ የንባብ ማዕዘኖችን፣ የሚዲያ ላብራቶሪ እና ጸጥ ያሉ የጥናት ክፍሎችን ጨምሯል።",
        category: "ግቢ",
      },
      n3: {
        title: "የጸደይ ጥበብ ትርኢት ከፍተኛ ተመልካች ስቧል",
        excerpt:
          "ከ600 በላይ ወላጆች እና የማህበረሰብ አባላት በዚህ አመት የጸደይ ጥበብ ትርኢት ላይ ተገኝተዋል፣ የተማሪዎች ስራዎችን በስዕል፣ በሸክላ ስራ እና በፎቶግራፍ አሳይተዋል።",
        category: "ጥበብ",
      },
    },
    events: {
      e1: { title: "ክፍት የግቢ ቀን", location: "ዋና ግቢ" },
      e2: { title: "የበልግ ትምህርት ዘመን ይጀምራል", location: "ሁሉም ግቢዎች" },
      e3: { title: "የሮቦቲክስ ሀገር አቀፍ ፍጻሜ መሸኛ", location: "አዳራሽ" },
    },
  },
};
