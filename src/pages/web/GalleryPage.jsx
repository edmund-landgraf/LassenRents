import { useEffect, useMemo, useState } from "react";
import { ArrowRight, Grid3X3, ImageIcon, Search, X } from "lucide-react";
import { Badge, Button, Card } from "@/components/ui";
import { saveContactIntent } from "@/lib/contactIntent";
import { PublicLayout } from "./PublicLayout";

const categories = ["All", "Containers", "Delivery", "Trucking", "Options", "Slides", "Brand"];

function titleize(value) {
  return value
    .replace(/\.(jpg|jpeg|png|gif)$/i, "")
    .replace(/[-_]/g, " ")
    .replace(/([a-z])([0-9])/g, "$1 $2")
    .replace(/([0-9])([a-z])/g, "$1 $2")
    .replace(/\b\w/g, (letter) => letter.toUpperCase());
}

function classify(slug, title, post) {
  const text = `${slug} ${title}`.toLowerCase();

  if (text.includes("truck") || text.includes("hay") || text.includes("relocating")) return "Trucking";
  if (text.includes("delivery") || text.includes("longday") || text.includes("toughdelivery")) return "Delivery";
  if (
    text.includes("shelving") ||
    text.includes("rack") ||
    text.includes("door") ||
    text.includes("window") ||
    text.includes("vent") ||
    text.includes("whirly") ||
    text.includes("office") ||
    text.includes("lockbox") ||
    text.includes("conditioner") ||
    post === 10 ||
    post === 12
  ) {
    return "Options";
  }
  if (text.includes("slide")) return "Slides";
  if (text.includes("header") || text.includes("background") || text.includes("safe") || text.includes("insta")) return "Brand";
  return "Containers";
}

function cleanCaption(html) {
  if (!html) return "";
  const div = document.createElement("div");
  div.innerHTML = html;
  return div.textContent?.trim() || "";
}

function normalizeMedia(item) {
  const url = item.source_url || "";
  const filename = url.split("/").pop();
  const title = item.title?.rendered || filename || "Lassen Rents photo";
  const localSrc = filename === "twentyfoot.jpg" ? "/assets/lassen-gallery/twentyfoot.jpg" : url;
  const category = classify(item.slug || "", title, item.post);

  return {
    id: item.id,
    title: titleize(title),
    slug: item.slug,
    src: localSrc,
    originalSrc: url,
    category,
    width: item.media_details?.width,
    height: item.media_details?.height,
    caption: cleanCaption(item.caption?.rendered)
  };
}

export function GalleryPage() {
  const [photos, setPhotos] = useState([]);
  const [activeCategory, setActiveCategory] = useState("Containers");
  const [query, setQuery] = useState("");
  const [selectedPhoto, setSelectedPhoto] = useState(null);

  useEffect(() => {
    let isMounted = true;

    fetch("/assets/lassen-gallery/media.json")
      .then((response) => response.json())
      .then((items) => {
        if (!isMounted) return;
        const normalized = items.filter((item) => item.media_type === "image").map(normalizeMedia);
        setPhotos(normalized);
      })
      .catch(() => {
        if (isMounted) setPhotos([]);
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const featuredPhoto = photos.find((photo) => photo.slug === "truckingbig") || photos[0];

  const filteredPhotos = useMemo(() => {
    const search = query.trim().toLowerCase();

    return photos.filter((photo) => {
      const matchesCategory = activeCategory === "All" || photo.category === activeCategory;
      const matchesSearch = !search || `${photo.title} ${photo.category} ${photo.caption}`.toLowerCase().includes(search);
      return matchesCategory && matchesSearch;
    });
  }, [activeCategory, photos, query]);

  return (
    <PublicLayout>
      <section className="border-b border-border bg-muted/30 py-12">
        <div className="container grid gap-8 lg:grid-cols-[.85fr_1.15fr] lg:items-end">
          <div>
            <p className="text-sm font-semibold uppercase tracking-wide text-primary">Photo gallery</p>
            <h1 className="mt-2 max-w-3xl text-4xl font-bold">Containers, delivery work, trucking, and add-on options</h1>
            <p className="mt-4 max-w-2xl text-muted-foreground">
              A modern gallery built from the Lassen Rents media library, organized so customers can browse real container sizes, placement work, accessories, and hauling photos.
            </p>
          </div>
          {featuredPhoto && (
            <div className="overflow-hidden rounded-lg border border-border bg-card shadow-soft">
              <div className="flex h-72 items-center bg-white p-3">
                <img className="max-h-full w-full object-contain" src={featuredPhoto.src} alt={featuredPhoto.title} />
              </div>
              <div className="flex items-center justify-between gap-4 p-4">
                <div>
                  <p className="text-sm font-semibold">{featuredPhoto.title}</p>
                  <p className="text-xs text-muted-foreground">{photos.length} scraped images in the gallery</p>
                </div>
                <Badge>{featuredPhoto.category}</Badge>
              </div>
            </div>
          )}
        </div>
      </section>

      <section className="py-10">
        <div className="container">
          <Card className="p-4">
            <div className="grid gap-4 lg:grid-cols-[1fr_auto] lg:items-center">
              <div className="flex flex-wrap gap-2">
                {categories.map((category) => (
                  <button
                    key={category}
                    className={`h-9 rounded-md px-3 text-sm font-semibold transition ${
                      activeCategory === category ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground hover:bg-secondary hover:text-foreground"
                    }`}
                    type="button"
                    onClick={() => setActiveCategory(category)}
                  >
                    {category}
                  </button>
                ))}
              </div>
              <label className="flex h-10 min-w-64 items-center gap-2 rounded-md border border-input bg-background px-3 text-sm">
                <Search className="h-4 w-4 text-muted-foreground" />
                <input
                  className="w-full bg-transparent outline-none placeholder:text-muted-foreground"
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                  placeholder="Search photos"
                />
              </label>
            </div>
          </Card>

          <div className="mt-6 flex items-center justify-between gap-4">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <Grid3X3 className="h-4 w-4" />
              {filteredPhotos.length} photos shown
            </div>
            <a className="inline-flex items-center gap-2 text-sm font-semibold text-primary hover:underline" href="/request-quote" onClick={() => saveContactIntent("Gallery")}>
              Request a quote <ArrowRight className="h-4 w-4" />
            </a>
          </div>

          <div className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {filteredPhotos.map((photo) => (
              <button
                key={photo.id}
                className="group overflow-hidden rounded-lg border border-border bg-card text-left shadow-soft transition hover:-translate-y-0.5 hover:shadow-lg"
                type="button"
                onClick={() => setSelectedPhoto(photo)}
              >
                <div className="flex aspect-[4/3] items-center overflow-hidden bg-white p-3">
                  <img
                    className="max-h-full w-full object-contain transition duration-300 group-hover:scale-[1.02]"
                    src={photo.src}
                    alt={photo.title}
                    loading="lazy"
                  />
                </div>
                <div className="space-y-2 p-4">
                  <div className="flex items-start justify-between gap-3">
                    <h2 className="text-sm font-bold">{photo.title}</h2>
                    <Badge>{photo.category}</Badge>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {photo.width && photo.height ? `${photo.width} x ${photo.height}` : "Original site media"}
                  </p>
                </div>
              </button>
            ))}
          </div>

          {!filteredPhotos.length && (
            <Card className="mt-6 flex items-center gap-3 p-6 text-muted-foreground">
              <ImageIcon className="h-5 w-5" />
              No photos match that filter.
            </Card>
          )}
        </div>
      </section>

      {selectedPhoto && (
        <div className="fixed inset-0 z-50 bg-black/80 p-4 backdrop-blur-sm" role="dialog" aria-modal="true">
          <div className="mx-auto flex h-full max-w-6xl flex-col justify-center">
            <div className="overflow-hidden rounded-lg bg-card shadow-2xl">
              <div className="flex items-center justify-between gap-4 border-b border-border p-4">
                <div>
                  <p className="font-bold">{selectedPhoto.title}</p>
                  <p className="text-sm text-muted-foreground">{selectedPhoto.category}</p>
                </div>
                <Button variant="ghost" className="h-9 w-9 px-0" onClick={() => setSelectedPhoto(null)} aria-label="Close photo">
                  <X className="h-5 w-5" />
                </Button>
              </div>
              <div className="max-h-[74vh] bg-black">
                <img className="mx-auto max-h-[74vh] w-full object-contain" src={selectedPhoto.src} alt={selectedPhoto.title} />
              </div>
              {selectedPhoto.caption && <p className="p-4 text-sm text-muted-foreground">{selectedPhoto.caption}</p>}
            </div>
          </div>
        </div>
      )}
    </PublicLayout>
  );
}
