import { useEffect, useMemo, useState } from "react";
import { X, ChevronLeft, ChevronRight, Images, ArrowLeft } from "lucide-react";
import { getGallery, getGalleryEvents } from "../api/gallery";
import PageHero from "../components/ui/PageHero";
import Spinner from "../components/ui/Spinner";
import { usePublicLang } from "../context/PublicLangContext";

const CATS = {
  en: ["All", "Events", "Sports", "Campus", "Graduation", "Arts"],
  am: ["ሁሉም", "ዝግጅቶች", "ስፖርት", "ግቢ", "ምረቃ", "ጥበብ"],
};
const CAT_MAP = { "ሁሉም": "All", "ዝግጅቶች": "Events", "ስፖርት": "Sports", "ግቢ": "Campus", "ምረቃ": "Graduation", "ጥበብ": "Arts" };

const T = {
  en: { eyebrow: "Gallery", title: "School Life in Pictures", desc: "Moments from our classrooms, courts, stages, and quads — organized by event.", morePhotos: "More Photos", backToGallery: "Back to Gallery", empty: "No photos in this category yet.", loading: "Loading gallery…", photos: "photos", photo: "photo" },
  am: { eyebrow: "ማዕከለ-ስዕላት", title: "የግቢ ህይወት በስዕሎች", desc: "ከክፍሎቻችን፣ ሜዳዎቻችን፣ መድረኮቻችን እና ግቢዎቻችን ጊዜያት — በዝግጅት የተደራጁ።", morePhotos: "ተጨማሪ ፎቶዎች", backToGallery: "ወደ ማዕከለ-ስዕላት ተመለስ", empty: "በዚህ ምድብ ምንም ፎቶዎች የሉም።", loading: "ማዕከለ-ስዕላት በመጫን ላይ…", photos: "ፎቶዎች", photo: "ፎቶ" },
};

export default function Gallery() {
  const { lang } = usePublicLang();
  const t = T[lang];
  const cats = CATS[lang];

  const [photos, setPhotos] = useState([]);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [category, setCategory] = useState(cats[0]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [lightboxIndex, setLightboxIndex] = useState(null);

  useEffect(() => { setCategory(cats[0]); }, [lang]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    (async () => {
      const [photoData, eventData] = await Promise.all([getGallery(), getGalleryEvents()]);
      setPhotos(photoData); setEvents(eventData); setLoading(false);
    })();
  }, []);

  const eventsById = useMemo(() => { const m = {}; events.forEach((ev) => (m[ev.id] = ev)); return m; }, [events]);
  function resolveEvent(photo) { return photo.event || eventsById[photo.eventId] || eventsById[photo.event_id] || null; }

  const { albums, unassigned } = useMemo(() => {
    const grouped = {}; const loose = [];
    photos.forEach((photo) => {
      const ev = resolveEvent(photo);
      if (!ev) { loose.push(photo); return; }
      if (!grouped[ev.id]) grouped[ev.id] = { event: ev, photos: [] };
      grouped[ev.id].photos.push(photo);
    });
    const list = Object.values(grouped).sort((a, b) => (b.event.yearEc || b.event.year_ec).localeCompare(a.event.yearEc || a.event.year_ec));
    return { albums: list, unassigned: loose };
  }, [photos, events]); // eslint-disable-line react-hooks/exhaustive-deps

  const rawCat = CAT_MAP[category] || category;
  const filteredAlbums = useMemo(() => (rawCat === "All" ? albums : albums.filter((a) => a.event.category === rawCat)), [albums, rawCat]);
  const filteredLoose = useMemo(() => (rawCat === "All" ? unassigned : unassigned.filter((p) => p.category === rawCat)), [unassigned, rawCat]);
  const activePhotos = selectedEvent ? selectedEvent.photos : filteredLoose;

  function closeLightbox() { setLightboxIndex(null); }
  function showNext(e) { e?.stopPropagation(); setLightboxIndex((i) => (i + 1) % activePhotos.length); }
  function showPrev(e) { e?.stopPropagation(); setLightboxIndex((i) => (i - 1 + activePhotos.length) % activePhotos.length); }

  useEffect(() => {
    function onKey(e) {
      if (lightboxIndex === null) return;
      if (e.key === "Escape") closeLightbox();
      if (e.key === "ArrowRight") showNext();
      if (e.key === "ArrowLeft") showPrev();
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [lightboxIndex, activePhotos.length]); // eslint-disable-line react-hooks/exhaustive-deps

  return (
    <div>
      <PageHero eyebrow={t.eyebrow} title={t.title} description={t.desc} />
      <section className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="flex flex-wrap gap-2">
          {cats.map((cat) => (
            <button key={cat} onClick={() => setCategory(cat)}
              className={`rounded-full px-4 py-2 text-sm font-medium transition-all duration-200 hover:-translate-y-0.5 ${category === cat ? "bg-plum-800 text-white" : "border border-plum-200 text-ink-950/60 hover:bg-plum-50"}`}>
              {cat}
            </button>
          ))}
        </div>

        {loading ? <Spinner size="lg" label={t.loading} />
          : filteredAlbums.length === 0 && filteredLoose.length === 0 ? <p className="mt-12 text-center text-ink-950/50">{t.empty}</p>
          : (
            <>
              {filteredAlbums.length > 0 && (
                <div key={category} className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                  {filteredAlbums.map((album, i) => {
                    const yearEc = album.event.yearEc || album.event.year_ec;
                    const titleAm = album.event.titleAm || album.event.title_am;
                    const titleEn = album.event.titleEn || album.event.title_en;
                    const count = album.photos.length;
                    return (
                      <button key={album.event.id} onClick={() => setSelectedEvent(album)}
                        className="group relative overflow-hidden rounded-2xl bg-plum-100 text-left shadow-sm animate-fade-in-up lift-hover hover:shadow-lg hover:shadow-plum-900/10"
                        style={{ animationDelay: `${Math.min(i, 8) * 60}ms` }}>
                        <div className="aspect-[4/3] w-full overflow-hidden">
                          <img src={album.photos[0]?.image} alt="" className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" loading="lazy" />
                        </div>
                        <div className="absolute inset-0 bg-gradient-to-t from-ink-950/85 via-ink-950/10 to-transparent" />
                        <span className="absolute right-3 top-3 rounded-full bg-brass-500 px-2.5 py-1 text-[11px] font-semibold text-ink-950">{yearEc} E.C.</span>
                        <div className="absolute inset-x-0 bottom-0 p-4">
                          <p className="font-display text-lg font-semibold leading-snug text-white">{lang === "am" ? titleAm : (titleEn || titleAm)}</p>
                          <p className="mt-0.5 text-sm text-white/70">{lang === "am" ? titleEn : titleAm}</p>
                          <p className="mt-1.5 inline-flex items-center gap-1 text-xs text-white/50">
                            <Images className="h-3 w-3" /> {count} {count !== 1 ? t.photos : t.photo}
                          </p>
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}
              {filteredLoose.length > 0 && (
                <div className="mt-12">
                  {filteredAlbums.length > 0 && <p className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-ink-950/35">{t.morePhotos}</p>}
                  <div className="columns-2 gap-4 sm:columns-3 lg:columns-4 [&>*]:mb-4">
                    {filteredLoose.map((img, i) => (
                      <button key={img.id} onClick={() => { setSelectedEvent(null); setLightboxIndex(i); }}
                        className="group block w-full overflow-hidden rounded-xl bg-plum-100 animate-fade-in-up"
                        style={{ animationDelay: `${Math.min(i, 10) * 45}ms` }}>
                        <img src={img.image} alt={img.caption} className="w-full object-cover transition-transform duration-500 group-hover:scale-105" loading="lazy" />
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
      </section>

      {selectedEvent && lightboxIndex === null && (
        <div className="fixed inset-0 z-50 overflow-y-auto bg-paper animate-fade-in">
          <div className="sticky top-0 z-10 border-b border-plum-100 bg-white/95 backdrop-blur px-4 py-4 sm:px-6 lg:px-8">
            <div className="mx-auto flex max-w-7xl items-center justify-between gap-4">
              <button onClick={() => { setSelectedEvent(null); setLightboxIndex(null); }} className="inline-flex items-center gap-2 text-sm font-semibold text-plum-800 hover:text-plum-600">
                <ArrowLeft className="h-4 w-4" /> {t.backToGallery}
              </button>
              <button onClick={() => { setSelectedEvent(null); setLightboxIndex(null); }} className="rounded-full p-2 text-ink-950/40 hover:bg-plum-50 hover:text-plum-700" aria-label="Close"><X className="h-5 w-5" /></button>
            </div>
          </div>
          <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
            <span className="inline-block rounded-full bg-brass-500 px-3 py-1 text-xs font-semibold text-ink-950">{selectedEvent.event.yearEc || selectedEvent.event.year_ec} E.C.</span>
            <h2 className="mt-3 font-display text-2xl font-semibold text-plum-900 sm:text-3xl">{lang === "am" ? (selectedEvent.event.titleAm || selectedEvent.event.title_am) : (selectedEvent.event.titleEn || selectedEvent.event.title_en)}</h2>
            <p className="text-ink-950/50">{lang === "am" ? (selectedEvent.event.titleEn || selectedEvent.event.title_en) : (selectedEvent.event.titleAm || selectedEvent.event.title_am)}</p>
            <div className="mt-8 columns-2 gap-4 sm:columns-3 lg:columns-4 [&>*]:mb-4">
              {selectedEvent.photos.map((img, i) => (
                <button key={img.id} onClick={() => setLightboxIndex(i)} className="group block w-full overflow-hidden rounded-xl bg-plum-100 animate-fade-in-up" style={{ animationDelay: `${Math.min(i, 10) * 45}ms` }}>
                  <img src={img.image} alt={img.caption} className="w-full object-cover transition-transform duration-500 group-hover:scale-105" loading="lazy" />
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {lightboxIndex !== null && activePhotos[lightboxIndex] && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center bg-ink-950/90 p-4 animate-fade-in" onClick={closeLightbox} role="dialog" aria-modal="true">
          <button onClick={closeLightbox} className="absolute right-4 top-4 rounded-full bg-white/10 p-2 text-white hover:bg-white/20" aria-label="Close"><X className="h-5 w-5" /></button>
          <button onClick={showPrev} className="absolute left-2 sm:left-6 rounded-full bg-white/10 p-2.5 text-white hover:bg-white/20" aria-label="Previous"><ChevronLeft className="h-6 w-6" /></button>
          <div key={lightboxIndex} className="max-h-[85vh] max-w-4xl animate-scale-in" onClick={(e) => e.stopPropagation()}>
            <img src={activePhotos[lightboxIndex].image} alt={activePhotos[lightboxIndex].caption} className="max-h-[80vh] w-auto rounded-lg object-contain" />
            <p className="mt-3 text-center text-sm text-white/70">{activePhotos[lightboxIndex].caption}</p>
          </div>
          <button onClick={showNext} className="absolute right-2 sm:right-6 rounded-full bg-white/10 p-2.5 text-white hover:bg-white/20" aria-label="Next"><ChevronRight className="h-6 w-6" /></button>
        </div>
      )}
    </div>
  );
}
