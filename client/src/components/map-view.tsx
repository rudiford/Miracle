import { useQuery } from "@tanstack/react-query";
import { useState, useEffect } from "react";
import { Plus, Minus, Navigation, Cross, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import ChristianCross from "./christian-cross";

interface Post {
  id: number;
  content: string;
  imageUrl?: string;
  location?: string;
  latitude?: string;
  longitude?: string;
  user: {
    id: string;
    firstName: string;
    lastName: string;
    profileImageUrl?: string;
  };
}

// Simple geocoding function for major cities
const getCityCoordinates = (location: string) => {
  const cityMap: { [key: string]: [number, number] } = {
    'dallas, texas': [32.7767, -96.7970],
    'dallas': [32.7767, -96.7970],
    'new york': [40.7128, -74.0060],
    'los angeles': [34.0522, -118.2437],
    'chicago': [41.8781, -87.6298],
    'houston': [29.7604, -95.3698],
    'phoenix': [33.4484, -112.0740],
    'philadelphia': [39.9526, -75.1652],
    'san antonio': [29.4241, -98.4936],
    'san diego': [32.7157, -117.1611],
    'austin': [30.2672, -97.7431],
    'miami': [25.7617, -80.1918],
    'atlanta': [33.7490, -84.3880],
    'boston': [42.3601, -71.0589],
    'seattle': [47.6062, -122.3321],
    'denver': [39.7392, -104.9903],
    'orlando': [28.5383, -81.3792],
    'las vegas': [36.1699, -115.1398],
    'london': [51.5074, -0.1278],
    'paris': [48.8566, 2.3522],
    'tokyo': [35.6762, 139.6503],
    'sydney': [-33.8688, 151.2093],
    'toronto': [43.6532, -79.3832],
    'rome': [41.9028, 12.4964],
    'berlin': [52.5200, 13.4050],
    'madrid': [40.4168, -3.7038],
    'beijing': [39.9042, 116.4074],
    'moscow': [55.7558, 37.6176],
    'mumbai': [19.0760, 72.8777],
    'cairo': [30.0444, 31.2357],
    'mexico city': [19.4326, -99.1332],
    'buenos aires': [-34.6118, -58.3960],
    'rio de janeiro': [-22.9068, -43.1729],
    'cape town': [-33.9249, 18.4241],
    'jerusalem': [31.7683, 35.2137]
  };
  
  const key = location.toLowerCase().trim();
  return cityMap[key] || null;
};

export default function MapView() {
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const { data: posts = [] } = useQuery<Post[]>({
    queryKey: ["/api/posts"],
  });

  // Filter posts that have location data and add coordinates
  const postsWithLocation = posts.filter(post => 
    (post.latitude && post.longitude) || post.location
  ).map(post => {
    let lat, lng;
    
    if (post.latitude && post.longitude) {
      lat = parseFloat(post.latitude);
      lng = parseFloat(post.longitude);
    } else if (post.location) {
      const coords = getCityCoordinates(post.location);
      if (coords) {
        [lat, lng] = coords;
      }
    }
    
    return { ...post, mappedLat: lat, mappedLng: lng };
  }).filter(post => post.mappedLat && post.mappedLng);

  return (
    <div className="h-screen relative bg-blue-50">
      {/* World Map Background */}
      <div className="w-full h-full relative overflow-hidden">
        {/* Simple world map representation */}
        <svg viewBox="0 0 800 400" className="w-full h-full">
          {/* Background */}
          <rect width="800" height="400" fill="#e6f3ff" />
          
          {/* Simple continent shapes */}
          {/* North America */}
          <path d="M50 80 L200 70 L220 120 L180 160 L120 150 L80 120 Z" fill="#d4d4aa" stroke="#999" strokeWidth="1"/>
          
          {/* South America */}
          <path d="M150 200 L180 180 L200 220 L190 280 L170 290 L160 260 Z" fill="#d4d4aa" stroke="#999" strokeWidth="1"/>
          
          {/* Europe */}
          <path d="M320 60 L380 55 L390 90 L370 100 L340 95 Z" fill="#d4d4aa" stroke="#999" strokeWidth="1"/>
          
          {/* Africa */}
          <path d="M330 120 L380 110 L390 180 L370 220 L350 210 L340 160 Z" fill="#d4d4aa" stroke="#999" strokeWidth="1"/>
          
          {/* Asia */}
          <path d="M400 50 L600 45 L620 100 L580 120 L520 110 L450 90 Z" fill="#d4d4aa" stroke="#999" strokeWidth="1"/>
          
          {/* Australia */}
          <path d="M550 250 L620 245 L630 270 L600 280 L570 275 Z" fill="#d4d4aa" stroke="#999" strokeWidth="1"/>
        </svg>
        
        {/* Post markers on map */}
        {postsWithLocation.map((post) => {
          // Convert lat/lng to map coordinates (simplified projection)
          const x = ((post.mappedLng! + 180) / 360) * 800;
          const y = ((90 - post.mappedLat!) / 180) * 400;
          
          return (
            <div
              key={post.id}
              className="absolute cursor-pointer group z-10"
              style={{
                left: `${(x / 800) * 100}%`,
                top: `${(y / 400) * 100}%`,
                transform: 'translate(-50%, -50%)'
              }}
              onClick={() => setSelectedPost(post)}
            >
              <div className="relative">
                <ChristianCross className="text-faith-gold hover:scale-125 transition-transform drop-shadow-lg" size={28} />
                <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-white px-2 py-1 rounded shadow-lg text-xs text-faith-text opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-20 pointer-events-none">
                  {post.location || `${post.mappedLat!.toFixed(2)}, ${post.mappedLng!.toFixed(2)}`}
                </div>
              </div>
            </div>
          );
        })}
      </div>
      
      {/* No posts message */}
      {postsWithLocation.length === 0 && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="text-center bg-white/90 p-6 rounded-lg shadow-lg">
            <ChristianCross className="text-faith-blue mb-4 mx-auto" size={64} />
            <p className="text-faith-text font-semibold">No miracle locations to display</p>
            <p className="text-sm text-gray-600 mt-2">Share your faith experiences with location to see them on the map</p>
          </div>
        </div>
      )}
      
      {/* Map Controls */}
      <div className="absolute top-4 right-4 space-y-2">
        <Button variant="secondary" size="icon" className="bg-white shadow-lg hover:shadow-xl">
          <Plus className="w-4 h-4 text-faith-blue" />
        </Button>
        <Button variant="secondary" size="icon" className="bg-white shadow-lg hover:shadow-xl">
          <Minus className="w-4 h-4 text-faith-blue" />
        </Button>
        <Button variant="secondary" size="icon" className="bg-white shadow-lg hover:shadow-xl">
          <Navigation className="w-4 h-4 text-faith-blue" />
        </Button>
      </div>
      
      {/* Selected Post Card */}
      {selectedPost && (
        <div className="absolute bottom-4 left-4 right-4">
          <Card className="bg-white/95 backdrop-blur-sm shadow-xl">
            <CardContent className="p-4">
              <div className="flex justify-between items-start mb-3">
                <div className="flex items-start space-x-3">
                  {selectedPost.user.profileImageUrl ? (
                    <img 
                      src={selectedPost.user.profileImageUrl} 
                      alt="Profile" 
                      className="w-10 h-10 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-10 h-10 bg-faith-gold rounded-full flex items-center justify-center">
                      <User className="w-5 h-5 text-white" />
                    </div>
                  )}
                  <div>
                    <h3 className="font-semibold text-faith-text">
                      {selectedPost.user.firstName} {selectedPost.user.lastName}
                    </h3>
                    <p className="text-xs text-gray-500">
                      {selectedPost.location || 'GPS Location'}
                    </p>
                  </div>
                </div>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => setSelectedPost(null)}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ×
                </Button>
              </div>
              
              <p className="text-sm text-gray-700 mb-3">
                {selectedPost.content}
              </p>
              
              {selectedPost.imageUrl && (
                <img 
                  src={selectedPost.imageUrl} 
                  alt="Post content" 
                  className="w-full h-40 object-cover rounded-lg"
                />
              )}
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
