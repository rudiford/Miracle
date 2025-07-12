import { useState } from "react";
import { useQuery, useMutation } from "@tanstack/react-query";
import { queryClient } from "@/lib/queryClient";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Flag, User, Clock, CheckCircle, XCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { apiRequest } from "@/lib/queryClient";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface Report {
  id: number;
  reason: string;
  description?: string;
  status: string;
  createdAt: string;
  reviewedAt?: string;
  reviewedBy?: string;
  reporter: {
    id: string;
    firstName: string;
    lastName: string;
    email?: string;
  };
  post: {
    id: number;
    content: string;
    user: {
      id: string;
      firstName: string;
      lastName: string;
    };
  };
}

export default function ReportsManagement() {
  const { toast } = useToast();
  const [filter, setFilter] = useState("pending");

  const { data: reports, isLoading } = useQuery({
    queryKey: ['/api/admin/reports'],
  });

  const updateReportMutation = useMutation({
    mutationFn: async ({ reportId, status }: { reportId: number; status: string }) => {
      const response = await apiRequest("PATCH", `/api/admin/reports/${reportId}`, {
        status,
      });
      return response.json();
    },
    onSuccess: () => {
      toast({
        title: "Report Updated",
        description: "Report status has been updated successfully.",
      });
      queryClient.invalidateQueries({ queryKey: ['/api/admin/reports'] });
    },
    onError: () => {
      toast({
        title: "Error",
        description: "Failed to update report status",
        variant: "destructive",
      });
    },
  });

  const handleUpdateReport = (reportId: number, status: string) => {
    updateReportMutation.mutate({ reportId, status });
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "pending":
        return <Badge variant="outline" className="text-orange-600 border-orange-600">Pending</Badge>;
      case "reviewed":
        return <Badge variant="outline" className="text-blue-600 border-blue-600">Reviewed</Badge>;
      case "resolved":
        return <Badge variant="outline" className="text-green-600 border-green-600">Resolved</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  const getReasonLabel = (reason: string) => {
    const labels = {
      inappropriate: "Inappropriate Content",
      spam: "Spam",
      harassment: "Harassment",
      false_information: "False Information",
      hate_speech: "Hate Speech",
      violence: "Violence or Threats",
      other: "Other",
    };
    return labels[reason as keyof typeof labels] || reason;
  };

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    
    if (diffHours < 1) {
      return "now";
    } else if (diffHours < 24) {
      return `${diffHours}h ago`;
    } else {
      const diffDays = Math.floor(diffHours / 24);
      return `${diffDays}d ago`;
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center text-faith-text">
            <Flag className="w-5 h-5 mr-2" />
            Content Reports
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-gray-500">Loading reports...</p>
        </CardContent>
      </Card>
    );
  }

  const allReports = reports as Report[] || [];
  const filteredReports = filter === "all" ? allReports : allReports.filter(report => report.status === filter);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between text-faith-text">
          <div className="flex items-center">
            <Flag className="w-5 h-5 mr-2" />
            Content Reports
          </div>
          <Select value={filter} onValueChange={setFilter}>
            <SelectTrigger className="w-[140px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Reports</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="reviewed">Reviewed</SelectItem>
              <SelectItem value="resolved">Resolved</SelectItem>
            </SelectContent>
          </Select>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {filteredReports.length === 0 ? (
          <p className="text-gray-500">No reports found</p>
        ) : (
          <div className="space-y-4">
            {filteredReports.map((report) => (
              <div
                key={report.id}
                className="border rounded-lg p-4 space-y-3"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      {getStatusBadge(report.status)}
                      <Badge variant="secondary">{getReasonLabel(report.reason)}</Badge>
                      <span className="text-sm text-gray-500">
                        <Clock className="w-3 h-3 inline mr-1" />
                        {formatTimeAgo(report.createdAt)}
                      </span>
                    </div>
                    
                    <div className="text-sm text-gray-600 mb-2">
                      <strong>Reporter:</strong> {report.reporter.firstName} {report.reporter.lastName}
                      {report.reporter.email && ` (${report.reporter.email})`}
                    </div>
                    
                    {report.description && (
                      <div className="text-sm text-gray-700 mb-3">
                        <strong>Details:</strong> {report.description}
                      </div>
                    )}
                    
                    <div className="bg-gray-50 p-3 rounded border-l-4 border-gray-300">
                      <div className="text-sm text-gray-600 mb-1">
                        <strong>Reported Post by:</strong> {report.post.user.firstName} {report.post.user.lastName}
                      </div>
                      <div className="text-sm text-gray-800">
                        {report.post.content.length > 150 
                          ? `${report.post.content.substring(0, 150)}...` 
                          : report.post.content}
                      </div>
                    </div>
                  </div>
                </div>
                
                {report.status === "pending" && (
                  <div className="flex gap-2 pt-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleUpdateReport(report.id, "reviewed")}
                      disabled={updateReportMutation.isPending}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      <CheckCircle className="w-4 h-4 mr-1" />
                      Mark Reviewed
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleUpdateReport(report.id, "resolved")}
                      disabled={updateReportMutation.isPending}
                      className="text-green-600 hover:text-green-800"
                    >
                      <XCircle className="w-4 h-4 mr-1" />
                      Mark Resolved
                    </Button>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}