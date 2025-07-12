import { useQuery } from "@tanstack/react-query";
import { Plus, Minus, Navigation, Cross, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

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

export default function MapView() {
  const { data: posts = [] } = useQuery<Post[]>({
    queryKey: ["/api/posts"],
  });

  // Filter posts that have location data (either GPS coordinates or text location)
  const postsWithLocation = posts.filter(post => 
    (post.latitude && post.longitude) || post.location
  );

  return (
    <div className="h-screen relative">
      {/* Map placeholder */}
      <div className="w-full h-full bg-gradient-to-br from-green-100 to-blue-100 flex items-center justify-center">
        <div className="text-center">
          <Cross className="w-16 h-16 text-faith-blue mb-4 mx-auto" />
          <p className="text-faith-text text-lg font-semibold">Interactive Map with Cross Markers</p>
          <p className="text-sm text-gray-600 mt-2">Showing miracle locations worldwide</p>
          {postsWithLocation.length > 0 && (
            <p className="text-sm text-faith-blue mt-2">{postsWithLocation.length} miracles discovered</p>
          )}
        </div>
      </div>
      
      {/* Dynamic cross markers for actual posts */}
      {postsWithLocation.map((post, index) => {
        // Create semi-random but consistent positions based on post content
        const hash = post.content.length + post.id;
        const leftPos = 20 + (hash % 60); // 20-80% from left
        const topPos = 20 + ((hash * 7) % 60); // 20-80% from top
        
        return (
          <div 
            key={post.id}
            className="absolute text-faith-gold text-2xl cursor-pointer hover:scale-110 transition-transform group"
            style={{ 
              left: `${leftPos}%`, 
              top: `${topPos}%`,
              transform: 'translate(-50%, -50%)'
            }}
            title={`${post.location || 'Unknown location'} - ${post.content.substring(0, 50)}...`}
          >
            <Cross />
            {/* Location label on hover */}
            <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 bg-white px-2 py-1 rounded shadow-lg text-xs text-faith-text opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10">
              {post.location || 'GPS Location'}
            </div>
          </div>
        );
      })}
      
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
      
      {/* Photo Overlay Cards */}
      {postsWithLocation.length > 0 && (
        <div className="absolute bottom-4 left-4 right-4">
          <Card className="max-w-sm shadow-xl border border-gray-200">
            <CardContent className="p-4">
              <div className="flex items-center space-x-3 mb-3">
                {postsWithLocation[0].user.profileImageUrl ? (
                  <img 
                    src={postsWithLocation[0].user.profileImageUrl} 
                    alt="Profile" 
                    className="w-8 h-8 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-8 h-8 bg-faith-blue rounded-full flex items-center justify-center">
                    <User className="w-4 h-4 text-white" />
                  </div>
                )}
                <div>
                  <h4 className="font-semibold text-sm text-faith-text">
                    {postsWithLocation[0].user.firstName}'s Miracle
                  </h4>
                  <p className="text-xs text-gray-600">
                    {postsWithLocation[0].location || "Unknown Location"}
                  </p>
                </div>
              </div>
              
              {postsWithLocation[0].imageUrl ? (
                <img 
                  src={postsWithLocation[0].imageUrl} 
                  alt="Miracle" 
                  className="w-full h-24 object-cover rounded-lg mb-2" 
                />
              ) : (
                <div className="w-full h-24 bg-gray-100 rounded-lg mb-2 flex items-center justify-center">
                  <Cross className="w-8 h-8 text-gray-400" />
                </div>
              )}
              
              <p className="text-xs text-faith-text font-georgia line-clamp-2">
                {postsWithLocation[0].content}
              </p>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
