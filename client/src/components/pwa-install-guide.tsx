import React, { useState } from "react";
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
import { Smartphone, Download, Cross, Share, MoreVertical } from "lucide-react";

export default function PWAInstallGuide() {
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <Smartphone className="h-4 w-4" />
          Install on Phone
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <img 
              src="/cross.png" 
              alt="Cross" 
              className="w-5 h-auto"
            />
            Install Proof of a Miracle on Your Phone
          </DialogTitle>
          <DialogDescription>
            Get the full app experience on your mobile device
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue="ios" className="w-full">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="ios">iPhone (Safari)</TabsTrigger>
            <TabsTrigger value="android">Android (Chrome)</TabsTrigger>
          </TabsList>

          <TabsContent value="ios" className="space-y-4">
            <div className="space-y-3">
              <h3 className="font-semibold text-lg">Install on iPhone</h3>
              <div className="space-y-4">
                <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
                  <div className="w-6 h-6 bg-faith-blue text-white rounded-full flex items-center justify-center text-sm font-bold">1</div>
                  <div>
                    <p className="font-medium">Open Safari Browser</p>
                    <p className="text-sm text-gray-600">Make sure you're using Safari (not Chrome or other browsers)</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
                  <div className="w-6 h-6 bg-faith-blue text-white rounded-full flex items-center justify-center text-sm font-bold">2</div>
                  <div>
                    <p className="font-medium">Tap the Share Button</p>
                    <div className="flex items-center gap-1 text-sm text-gray-600">
                      <Share className="h-3 w-3" />
                      <span>Look for the share icon at the bottom of your screen</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
                  <div className="w-6 h-6 bg-faith-blue text-white rounded-full flex items-center justify-center text-sm font-bold">3</div>
                  <div>
                    <p className="font-medium">Select "Add to Home Screen"</p>
                    <p className="text-sm text-gray-600">Scroll down in the share menu to find this option</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3 p-3 bg-blue-50 rounded-lg">
                  <div className="w-6 h-6 bg-faith-blue text-white rounded-full flex items-center justify-center text-sm font-bold">4</div>
                  <div>
                    <p className="font-medium">Tap "Add"</p>
                    <p className="text-sm text-gray-600">The app icon will appear on your home screen</p>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="android" className="space-y-4">
            <div className="space-y-3">
              <h3 className="font-semibold text-lg">Install on Android</h3>
              <div className="space-y-4">
                <div className="flex items-start gap-3 p-3 bg-green-50 rounded-lg">
                  <div className="w-6 h-6 bg-faith-blue text-white rounded-full flex items-center justify-center text-sm font-bold">1</div>
                  <div>
                    <p className="font-medium">Open Chrome Browser</p>
                    <p className="text-sm text-gray-600">Make sure you're using Chrome for the best experience</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3 p-3 bg-green-50 rounded-lg">
                  <div className="w-6 h-6 bg-faith-blue text-white rounded-full flex items-center justify-center text-sm font-bold">2</div>
                  <div>
                    <p className="font-medium">Tap the Menu Button</p>
                    <div className="flex items-center gap-1 text-sm text-gray-600">
                      <MoreVertical className="h-3 w-3" />
                      <span>Three dots in the top-right corner</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-start gap-3 p-3 bg-green-50 rounded-lg">
                  <div className="w-6 h-6 bg-faith-blue text-white rounded-full flex items-center justify-center text-sm font-bold">3</div>
                  <div>
                    <p className="font-medium">Select "Add to Home screen" or "Install app"</p>
                    <p className="text-sm text-gray-600">Look for either option in the menu</p>
                  </div>
                </div>
                
                <div className="flex items-start gap-3 p-3 bg-green-50 rounded-lg">
                  <div className="w-6 h-6 bg-faith-blue text-white rounded-full flex items-center justify-center text-sm font-bold">4</div>
                  <div>
                    <p className="font-medium">Confirm Installation</p>
                    <p className="text-sm text-gray-600">Tap "Add" or "Install" to complete the process</p>
                  </div>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        <div className="border-t pt-4 space-y-3">
          <h4 className="font-medium">Benefits of Installing:</h4>
          <ul className="space-y-1 text-sm text-gray-600">
            <li>• Works like a native app with full-screen experience</li>
            <li>• Access your faith community offline</li>
            <li>• Get notifications for prayers and messages</li>
            <li>• Quick access from your home screen</li>
            <li>• Better performance and faster loading</li>
          </ul>
        </div>

        <div className="border-t pt-4">
          <p className="text-xs text-muted-foreground text-center">
            "Faith comes by hearing, and hearing by the word of God" - Romans 10:17
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}