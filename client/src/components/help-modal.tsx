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
import { HelpCircle, Heart, MapPin, MessageCircle, Users, Cross } from "lucide-react";

interface HelpModalProps {
  currentView?: "feed" | "messages" | "admin" | "register";
}

export default function HelpModal({ currentView = "feed" }: HelpModalProps) {
  const [open, setOpen] = useState(false);

  const getContextualHelp = () => {
    switch (currentView) {
      case "feed":
        return "feed";
      case "messages":
        return "messages";
      case "admin":
        return "admin";
      case "register":
        return "register";
      default:
        return "feed";
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="fixed bottom-24 right-4 z-50 shadow-lg">
          <HelpCircle className="h-4 w-4" />
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
            What does this screen mean?
          </DialogTitle>
          <DialogDescription>
            Learn how to use Proof of a Miracle - your faith community
          </DialogDescription>
        </DialogHeader>

        <Tabs defaultValue={getContextualHelp()} className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="feed" className="text-xs">Feed</TabsTrigger>
            <TabsTrigger value="messages" className="text-xs">Messages</TabsTrigger>
            <TabsTrigger value="register" className="text-xs">Profile</TabsTrigger>
            <TabsTrigger value="admin" className="text-xs">Admin</TabsTrigger>
          </TabsList>

          <TabsContent value="feed" className="space-y-4">
            <div className="space-y-3">
              <h3 className="font-semibold flex items-center gap-2">
                <Heart className="h-4 w-4 text-faith-gold" />
                Faith Community Feed
              </h3>
              <div className="space-y-2 text-sm">
                <p><strong>What you see:</strong> A timeline of miracle testimonies and faith experiences shared by our community members worldwide.</p>
                <p><strong>How to use:</strong></p>
                <ul className="list-disc list-inside space-y-1 ml-4">
                  <li>Read inspiring stories of God's work in people's lives</li>
                  <li>Tap the <Heart className="inline h-3 w-3" /> prayer button to pray for someone</li>
                  <li>Leave encouraging comments on posts</li>
                  <li>Share your own miracle by tapping the "+" button</li>
                </ul>
                <p><strong>Purpose:</strong> Build faith community by sharing and celebrating God's miraculous works.</p>
              </div>
            </div>
          </TabsContent>



          <TabsContent value="messages" className="space-y-4">
            <div className="space-y-3">
              <h3 className="font-semibold flex items-center gap-2">
                <MessageCircle className="h-4 w-4 text-faith-gold" />
                Faith Community Messages
              </h3>
              <div className="space-y-2 text-sm">
                <p><strong>What you see:</strong> Private conversations with fellow believers in your faith community.</p>
                <p><strong>How to use:</strong></p>
                <ul className="list-disc list-inside space-y-1 ml-4">
                  <li>Connect with other community members personally</li>
                  <li>Share prayer requests privately</li>
                  <li>Offer encouragement and spiritual support</li>
                  <li>Build meaningful Christian friendships</li>
                </ul>
                <p><strong>Purpose:</strong> Foster deeper relationships within the body of Christ through personal communication.</p>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="register" className="space-y-4">
            <div className="space-y-3">
              <h3 className="font-semibold flex items-center gap-2">
                <Users className="h-4 w-4 text-faith-gold" />
                Complete Your Profile
              </h3>
              <div className="space-y-2 text-sm">
                <p><strong>What you see:</strong> A form to complete your community member profile.</p>
                <p><strong>Why it matters:</strong></p>
                <ul className="list-disc list-inside space-y-1 ml-4">
                  <li>Helps community members connect with you</li>
                  <li>Shows your location for local fellowship opportunities</li>
                  <li>Builds trust within our faith community</li>
                  <li>Allows others to pray for you more specifically</li>
                </ul>
                <p><strong>Privacy:</strong> Your information is only shared within our Christian community and helps build authentic relationships.</p>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="admin" className="space-y-4">
            <div className="space-y-3">
              <h3 className="font-semibold flex items-center gap-2">
                <img 
                  src="/cross.png" 
                  alt="Cross" 
                  className="w-4 h-auto"
                />
                Community Moderation
              </h3>
              <div className="space-y-2 text-sm">
                <p><strong>What you see:</strong> Administrative tools to maintain a healthy, Christ-centered community.</p>
                <p><strong>Your responsibilities:</strong></p>
                <ul className="list-disc list-inside space-y-1 ml-4">
                  <li>Review and moderate community content</li>
                  <li>Ensure posts align with Christian values</li>
                  <li>Remove inappropriate content if necessary</li>
                  <li>Support community members with technical issues</li>
                  <li>Monitor community growth and engagement</li>
                </ul>
                <p><strong>Purpose:</strong> Maintain a safe, encouraging space where believers can share their faith experiences authentically.</p>
              </div>
            </div>
          </TabsContent>
        </Tabs>

        <div className="border-t pt-4">
          <p className="text-xs text-muted-foreground text-center">
            "And we know that in all things God works for the good of those who love him" - Romans 8:28
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
}