"use client";

import { useState, useEffect } from "react";
import { IBloodRequest } from "@/interfaces";
import { getApprovedBloodRequests } from "@/server-actions/blood-reqests";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Heart, Loader2, Phone, Mail, MapPin } from "lucide-react";
import { useRouter } from "next/navigation";

export default function ApprovedBloodRequests() {
  const [requests, setRequests] = useState<IBloodRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    loadRequests();
  }, []);

  const loadRequests = async () => {
    try {
      setLoading(true);
      const response = await getApprovedBloodRequests();

      if (response.success && response.data) {
        setRequests(response.data);
      } else {
        setRequests([]);
      }
    } catch (error) {
      console.error("Failed to load requests:", error);
      toast.error("Failed to load blood requests");
    } finally {
      setLoading(false);
    }
  };

  const getUrgencyColor = (urgency: string) => {
    switch (urgency.toLowerCase()) {
      case "critical":
        return "bg-red-100 text-red-800 border-red-300";
      case "high":
        return "bg-orange-100 text-orange-800 border-orange-300";
      case "medium":
        return "bg-yellow-100 text-yellow-800 border-yellow-300";
      case "low":
        return "bg-green-100 text-green-800 border-green-300";
      default:
        return "bg-gray-100 text-gray-800 border-gray-300";
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Available Blood Requests</h2>
          <p className="text-muted-foreground">
            Help save lives by donating blood
          </p>
        </div>
      </div>

      {requests.length === 0 ? (
        <div className="text-center py-12 bg-card border border-border rounded-lg">
          <Heart className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground mb-2">
            No blood requests available at the moment
          </p>
          <p className="text-sm text-muted-foreground">
            Check back later for opportunities to donate
          </p>
        </div>
      ) : (
        <div className="grid gap-4">
          {requests.map((request) => (
            <div
              key={request.id}
              className="bg-card border border-border rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="flex justify-between items-start mb-4">
                <div className="flex-1">
                  <h3 className="text-xl font-semibold mb-2">
                    {request.title}
                  </h3>
                  <div className="flex gap-2 mb-3">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium border ${getUrgencyColor(
                        request.urgency
                      )}`}
                    >
                      {request.urgency.toUpperCase()} URGENCY
                    </span>
                  </div>
                </div>
                <Button
                  onClick={() =>
                    router.push(`/donor/blood-requests/${request.id}`)
                  }
                >
                  <Heart className="h-4 w-4 mr-2" />
                  Respond
                </Button>
              </div>

              <p className="text-muted-foreground mb-4 line-clamp-2">
                {request.description}
              </p>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm mb-4">
                <div>
                  <p className="text-muted-foreground">Blood Group</p>
                  <p className="font-semibold text-lg">{request.blood_group}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Units Required</p>
                  <p className="font-semibold text-lg">
                    {request.units_required}
                  </p>
                </div>
                <div>
                  <p className="text-muted-foreground">Posted By</p>
                  <p className="font-medium">
                    {(request as any).recipient?.name || "Anonymous"}
                  </p>
                </div>
                <div>
                  <p className="text-muted-foreground">Date</p>
                  <p className="font-medium">
                    {request.created_at
                      ? new Date(request.created_at).toLocaleDateString()
                      : "N/A"}
                  </p>
                </div>
              </div>

              <div className="border-t pt-4 space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Contact:</span>
                  <a
                    href={`tel:${request.contact_phone}`}
                    className="font-medium hover:text-primary"
                  >
                    {request.contact_phone}
                  </a>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Email:</span>
                  <a
                    href={`mailto:${request.contact_email}`}
                    className="font-medium hover:text-primary"
                  >
                    {request.contact_email}
                  </a>
                </div>
                <div className="flex items-center gap-2 text-sm">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <span className="text-muted-foreground">Location:</span>
                  <span className="font-medium">{request.address}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
