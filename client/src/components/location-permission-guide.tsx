import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { MapPin, Settings, Smartphone } from "lucide-react";

export default function LocationPermissionGuide() {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="link" size="sm" className="text-xs underline p-0 h-auto">
          How to enable location?
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-lg max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <MapPin className="h-5 w-5 text-faith-gold" />
            Enable Location Permission
          </DialogTitle>
          <DialogDescription>
            Step-by-step guide to share your location for miracle posts
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="iphone" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="iphone">iPhone Safari</TabsTrigger>
            <TabsTrigger value="android">Android Chrome</TabsTrigger>
          </TabsList>

          <TabsContent value="iphone" className="space-y-4">
            <div className="space-y-3">
              <h3 className="font-semibold">iPhone Safari</h3>
              <div className="space-y-3">
                <div className="p-3 bg-blue-50 rounded-lg">
                  <p className="font-medium mb-2">Method 1: When prompted</p>
                  <p className="text-sm text-gray-600">When you tap "Use Current" location, Safari will show a popup asking for permission. Tap "Allow" or "Allow While Using App".</p>
                </div>
                
                <div className="p-3 bg-blue-50 rounded-lg">
                  <p className="font-medium mb-2">Method 2: Settings</p>
                  <div className="text-sm text-gray-600 space-y-1">
                    <p>1. Go to iPhone Settings → Privacy & Security → Location Services</p>
                    <p>2. Make sure Location Services is ON</p>
                    <p>3. Scroll down and tap "Safari"</p>
                    <p>4. Select "Ask Next Time Or When I Share"</p>
                    <p>5. Return to the app and try again</p>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="android" className="space-y-4">
            <div className="space-y-3">
              <h3 className="font-semibold">Android Chrome</h3>
              <div className="space-y-3">
                <div className="p-3 bg-green-50 rounded-lg">
                  <p className="font-medium mb-2">Method 1: When prompted</p>
                  <p className="text-sm text-gray-600">When you tap "Use Current" location, Chrome will show a popup. Tap "Allow" to grant permission.</p>
                </div>
                
                <div className="p-3 bg-green-50 rounded-lg">
                  <p className="font-medium mb-2">Method 2: Site Settings</p>
                  <div className="text-sm text-gray-600 space-y-1">
                    <p>1. Tap the lock icon next to the website URL</p>
                    <p>2. Tap "Permissions"</p>
                    <p>3. Find "Location" and set to "Allow"</p>
                    <p>4. Refresh the page and try again</p>
                  </div>
                </div>
                
                <div className="p-3 bg-green-50 rounded-lg">
                  <p className="font-medium mb-2">Method 3: Chrome Settings</p>
                  <div className="text-sm text-gray-600 space-y-1">
                    <p>1. Open Chrome menu (3 dots) → Settings</p>
                    <p>2. Tap "Site settings" → "Location"</p>
                    <p>3. Make sure location access is enabled</p>
                    <p>4. Return to the app and try again</p>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        <div className="border-t pt-4 space-y-3">
          <div className="flex items-start gap-2">
            <Settings className="h-4 w-4 text-faith-gold mt-0.5" />
            <div>
              <p className="font-medium text-sm">Why does this happen?</p>
              <p className="text-xs text-gray-600">Browsers protect your privacy by asking permission before sharing your location. This is normal and secure.</p>
            </div>
          </div>
          
          <div className="flex items-start gap-2">
            <Smartphone className="h-4 w-4 text-faith-gold mt-0.5" />
            <div>
              <p className="font-medium text-sm">Alternative option</p>
              <p className="text-xs text-gray-600">You can always type your location manually instead of using GPS.</p>
            </div>
          </div>
        </div>

        <div className="border-t pt-4">
          <p className="text-xs text-muted-foreground text-center">
            Your location helps the community discover miracles in their area
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}