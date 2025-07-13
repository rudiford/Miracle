import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useToast } from "@/hooks/use-toast";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { Flag } from "lucide-react";

const reportSchema = z.object({
  reason: z.string().min(1, "Please select a reason"),
  description: z.string().optional(),
});

type ReportForm = z.infer<typeof reportSchema>;

interface ReportPostModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  postId: number;
}

const reportReasons = [
  { value: "inappropriate", label: "Inappropriate Content" },
  { value: "spam", label: "Spam" },
  { value: "harassment", label: "Harassment" },
  { value: "false_information", label: "False Information" },
  { value: "hate_speech", label: "Hate Speech" },
  { value: "violence", label: "Violence or Threats" },
  { value: "other", label: "Other" },
];

export default function ReportPostModal({ open, onOpenChange, postId }: ReportPostModalProps) {
  const { toast } = useToast();
  
  const form = useForm<ReportForm>({
    resolver: zodResolver(reportSchema),
    defaultValues: {
      reason: "",
      description: "",
    },
  });

  const reportMutation = useMutation({
    mutationFn: async (data: ReportForm) => {
      const response = await apiRequest("POST", "/api/reports", {
        postId,
        reason: data.reason,
        description: data.description || null,
      });
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Report Submitted",
        description: "Thank you for reporting this post. Our admins will review it soon.",
      });
      form.reset();
      onOpenChange(false);
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to submit report. Please try again.",
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: ReportForm) => {
    reportMutation.mutate(data);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center text-faith-text">
            <Flag className="w-5 h-5 mr-2 text-red-500" />
            Report Post
          </DialogTitle>
          <DialogDescription>
            Help us maintain a safe community by reporting inappropriate content.
          </DialogDescription>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="reason"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Reason for reporting</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select a reason" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {reportReasons.map((reason) => (
                        <SelectItem key={reason.value} value={reason.value}>
                          {reason.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Additional details (optional)</FormLabel>
                  <FormControl>
                    <Textarea
                      {...field}
                      placeholder="Provide any additional context that might help our review..."
                      className="min-h-[80px]"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter className="gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                disabled={reportMutation.isPending}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={reportMutation.isPending}
                className="bg-red-600 hover:bg-red-700 text-white"
              >
                {reportMutation.isPending ? "Submitting..." : "Submit Report"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}