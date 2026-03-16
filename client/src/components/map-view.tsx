import { useQuery } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import { useLocation } from "wouter";
import { MapContainer, TileLayer, useMap } from "react-leaflet";
import L from "leaflet";

const esc = (str: string) => str.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/"/g,"&quot;");
import "leaflet.markercluster";
import "leaflet.markercluster/dist/MarkerCluster.css";
import "leaflet.markercluster/dist/MarkerCluster.Default.css";
import { supabase } from "@/lib/supabase";
import "leaflet/dist/leaflet.css";

// Fix Leaflet default marker icons broken by bundlers
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

// Custom cross marker icon
const crossIcon = L.divIcon({
  html: `<div style="
    background: white;
    border: 2px solid #C9A84C;
    border-radius: 50%;
    width: 32px;
    height: 32px;
    display: flex;
    align-items: center;
    justify-content: center;
    box-shadow: 0 2px 8px rgba(0,0,0,0.3);
    font-size: 16px;
  ">✝</div>`,
  className: "",
  iconSize: [32, 32],
  iconAnchor: [16, 16],
  popupAnchor: [0, -20],
});

interface Post {
  id: number;
  content: string;
  imageUrl?: string;
  location?: string;
  latitude?: string;
  longitude?: string;
  prayerCount: number;
  createdAt: string;
  user: {
    id: string;
    firstName?: string;
    lastName?: string;
    profileImageUrl?: string;
  };
}

// Marker cluster layer using vanilla Leaflet plugin
function ClusterMarkers({ posts, onView }: { posts: FullPost[], onView: (p: FullPost) => void }) {
  const map = useMap();

  useEffect(() => {
    const cluster = (L as any).markerClusterGroup({ maxClusterRadius: 40 });

    posts.forEach((post) => {
      const marker = L.marker([post.lat, post.lng], { icon: crossIcon });
      const container = document.createElement("div");
      container.style.fontFamily = "'Jost', sans-serif";
      container.style.padding = "16px";
      container.style.minWidth = "220px";
      const initials = esc(([post.user.firstName?.[0], post.user.lastName?.[0]].filter(Boolean).join("").toUpperCase()) || "?");
      const name = esc([post.user.firstName, post.user.lastName].filter(Boolean).join(" ") || "Anonymous");
      const location = post.location ? `<div style="font-size:11px;color:#9CA3AF">📍 ${esc(post.location)}</div>` : "";
      const preview = esc(post.content.length > 120 ? post.content.slice(0, 120) + "…" : post.content);
      container.innerHTML = `
        <div style="display:flex;align-items:center;gap:10px;margin-bottom:10px">
          <div style="width:36px;height:36px;border-radius:50%;background:rgba(201,168,76,0.15);border:1px solid #D6D3D1;display:flex;align-items:center;justify-content:center;font-size:14px;color:#111;font-family:'Cormorant Garamond',serif">
            ${initials}
          </div>
          <div>
            <div style="font-weight:500;font-size:13px;color:#111">${name}</div>
            ${location}
          </div>
        </div>
        <p style="font-size:13px;color:#4B4B4B;line-height:1.5;margin:0 0 10px">${preview}</p>
        <button class="view-post-btn" style="width:100%;padding:7px 0;background:#1A1A1A;color:white;border:none;border-radius:4px;font-size:12px;cursor:pointer;font-family:'Jost',sans-serif;letter-spacing:1px">
          View Full Post
        </button>
      `;
      container.querySelector(".view-post-btn")?.addEventListener("click", () => onView(post));
      marker.bindPopup(container, { maxWidth: 280 });
      cluster.addLayer(marker);
    });

    map.addLayer(cluster);
    return () => { map.removeLayer(cluster); };
  }, [posts, map]);

  return null;
}

function RecenterButton() {
  const map = useMap();
  return (
    <button
      onClick={() => map.setView([20, 10], 2)}
      style={{
        position: "absolute",
        bottom: 24,
        right: 12,
        zIndex: 1000,
        background: "white",
        border: "2px solid #D6D3D1",
        borderRadius: 4,
        padding: "6px 12px",
        fontSize: 12,
        cursor: "pointer",
        fontFamily: "'Jost', sans-serif",
        color: "#374151",
      }}
    >
      Reset View
    </button>
  );
}

interface FullPost extends Post {
  lat: number;
  lng: number;
}

export default function MapView() {
  const [, setLocation] = useLocation();
  const [viewingPost, setViewingPost] = useState<FullPost | null>(null);
  const { data: posts = [] } = useQuery<Post[]>({
    queryKey: ["/api/posts"],
    queryFn: async () => {
      const { data: { session } } = await supabase.auth.getSession();
      const res = await fetch("/api/posts", {
        headers: session?.access_token ? { Authorization: `Bearer ${session.access_token}` } : {},
      });
      if (!res.ok) return [];
      return res.json();
    },
    staleTime: 0,
  });

  // Geocode text locations using OpenStreetMap Nominatim
  const [geocoded, setGeocoded] = useState<Record<number, [number, number]>>({});

  useEffect(() => {
    const postsNeedingGeocode = posts.filter(
      (p) => !(p.latitude && p.longitude) && p.location
    );
    postsNeedingGeocode.forEach(async (p) => {
      if (geocoded[p.id]) return;
      try {
        const res = await fetch(
          `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(p.location!)}&format=json&limit=1`,
          { headers: { "Accept-Language": "en" } }
        );
        const data = await res.json();
        if (data[0]) {
          setGeocoded((prev) => ({
            ...prev,
            [p.id]: [parseFloat(data[0].lat), parseFloat(data[0].lon)],
          }));
        }
      } catch {}
    });
  }, [posts]);

  const postsWithLocation = posts.flatMap((p) => {
    if (p.latitude && p.longitude) {
      return [{ ...p, lat: parseFloat(p.latitude), lng: parseFloat(p.longitude) }];
    }
    if (geocoded[p.id]) {
      return [{ ...p, lat: geocoded[p.id][0], lng: geocoded[p.id][1] }];
    }
    return [];
  });

  const postCount = postsWithLocation.length;

  return (
    <div style={{ height: "100%", width: "100%", position: "relative" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,600;1,300&family=Jost:wght@300;400;500&display=swap');
        .leaflet-popup-content-wrapper {
          border-radius: 4px;
          border: 1px solid #D6D3D1;
          box-shadow: 0 4px 16px rgba(0,0,0,0.12);
          padding: 0;
        }
        .leaflet-popup-content { margin: 0; }
        .leaflet-popup-tip { background: white; }
        .leaflet-top.leaflet-left { top: 56px; }
      `}</style>

      {/* Header bar */}
      <div style={{
        position: "absolute",
        top: 0, left: 0, right: 0,
        zIndex: 1000,
        background: "rgba(255,255,255,0.97)",
        borderBottom: "1px solid #D6D3D1",
        backdropFilter: "blur(8px)",
        padding: "12px 20px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        fontFamily: "'Jost', sans-serif",
      }}>
        <button
          onClick={() => setLocation("/")}
          style={{ fontSize: 13, color: "#6B7280", background: "none", border: "none", cursor: "pointer", fontFamily: "'Jost', sans-serif", display: "flex", alignItems: "center", gap: 4 }}
        >
          ← Feed
        </button>
        <span style={{ fontFamily: "'Cormorant Garamond', serif", fontSize: 20, color: "#111111", fontWeight: 300, letterSpacing: 2 }}>
          Global Miracle Map
        </span>
        <span style={{ fontSize: 12, color: "#9CA3AF" }}>
          {postCount === 0
            ? "No locations yet — share a testimony with location"
            : `${postCount} miracle${postCount !== 1 ? "s" : ""} on the map`}
        </span>
      </div>

      <MapContainer
        center={[20, 10]}
        zoom={2}
        style={{ height: "100%", width: "100%" }}
        zoomControl={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />

        <ClusterMarkers posts={postsWithLocation} onView={setViewingPost} />

        <RecenterButton />
      </MapContainer>

      {/* Full post overlay */}
      {viewingPost && (
        <div
          style={{
            position: "fixed", inset: 0, zIndex: 2000,
            background: "rgba(0,0,0,0.6)", backdropFilter: "blur(4px)",
            display: "flex", alignItems: "center", justifyContent: "center",
            padding: 16,
          }}
          onClick={() => setViewingPost(null)}
        >
          <div
            style={{
              background: "white", borderRadius: 4, border: "1px solid #D6D3D1",
              maxWidth: 520, width: "100%", maxHeight: "85vh", overflowY: "auto",
              fontFamily: "'Jost', sans-serif",
            }}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div style={{ padding: "16px 20px", borderBottom: "1px solid #F0EDE6", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                {viewingPost.user.profileImageUrl ? (
                  <img src={viewingPost.user.profileImageUrl} alt="" style={{ width: 44, height: 44, borderRadius: "50%", objectFit: "cover", border: "1px solid #D6D3D1" }} />
                ) : (
                  <div style={{ width: 44, height: 44, borderRadius: "50%", background: "rgba(201,168,76,0.15)", border: "1px solid #D6D3D1", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "'Cormorant Garamond', serif", fontSize: 16, color: "#111" }}>
                    {[viewingPost.user.firstName?.[0], viewingPost.user.lastName?.[0]].filter(Boolean).join("").toUpperCase() || "?"}
                  </div>
                )}
                <div>
                  <div style={{ fontWeight: 500, fontSize: 14, color: "#111" }}>
                    {[viewingPost.user.firstName, viewingPost.user.lastName].filter(Boolean).join(" ") || "Anonymous"}
                  </div>
                  {viewingPost.location && <div style={{ fontSize: 12, color: "#9CA3AF" }}>📍 {viewingPost.location}</div>}
                  <div style={{ fontSize: 11, color: "#C4C2BF" }}>
                    {new Date(viewingPost.createdAt).toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" })}
                  </div>
                </div>
              </div>
              <button onClick={() => setViewingPost(null)} style={{ background: "none", border: "none", fontSize: 22, cursor: "pointer", color: "#9CA3AF", lineHeight: 1 }}>×</button>
            </div>

            {/* Image */}
            {viewingPost.imageUrl && (
              <img
                src={viewingPost.imageUrl.startsWith("http") ? viewingPost.imageUrl : viewingPost.imageUrl.startsWith("data:") ? viewingPost.imageUrl : `data:image/jpeg;base64,${viewingPost.imageUrl}`}
                alt=""
                style={{ width: "100%", maxHeight: 280, objectFit: "cover" }}
              />
            )}

            {/* Content */}
            <div style={{ padding: 20 }}>
              <p style={{ fontSize: 15, color: "#1A1A1A", lineHeight: 1.7, margin: 0 }}>
                {viewingPost.content}
              </p>
            </div>

            {/* Footer */}
            <div style={{ padding: "12px 20px", borderTop: "1px solid #F0EDE6", display: "flex", gap: 16, fontSize: 13, color: "#9CA3AF" }}>
              <span>🙏 {viewingPost.prayerCount ?? 0} prayers</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
