"use client";

import { useState, useEffect } from "react";
import { IBloodRequest } from "@/interfaces";
import {
  getAllBloodRequests,
  deleteBloodRequest,
} from "@/server-actions/blood-reqests";
import { currentUser } from "@/server-actions/users";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Edit, Trash2, Plus, Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export default function BloodRequestsList() {
  const [requests, setRequests] = useState<IBloodRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleteId, setDeleteId] = useState<number | null>(null);
  const [deleting, setDeleting] = useState(false);
  const router = useRouter();

  useEffect(() => {
    loadRequests();
  }, []);

  const loadRequests = async () => {
    try {
      setLoading(true);
      const user = await currentUser();

      if (!user) {
        toast.error("Please log in to view your requests");
        return;
      }

      const response = await getAllBloodRequests(user.id);

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

  const handleDelete = async () => {
    if (!deleteId) return;

    try {
      setDeleting(true);
      const response = await deleteBloodRequest(deleteId);

      if (response.success) {
        toast.success("Blood request deleted successfully");
        setRequests(requests.filter((req) => req.id !== deleteId));
      } else {
        toast.error(response.message || "Failed to delete blood request");
      }
    } catch (error) {
      toast.error("An error occurred while deleting");
    } finally {
      setDeleting(false);
      setDeleteId(null);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-300";
      case "in_progress":
        return "bg-blue-100 text-blue-800 border-blue-300";
      case "fulfilled":
        return "bg-green-100 text-green-800 border-green-300";
      case "cancelled":
        return "bg-red-100 text-red-800 border-red-300";
      default:
        return "bg-gray-100 text-gray-800 border-gray-300";
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
          <h2 className="text-2xl font-bold">My Blood Requests</h2>
          <p className="text-muted-foreground">
            Manage your blood donation requests
          </p>
        </div>
        <Button onClick={() => router.push("/recipient/blood-requests")}>
          <Plus className="h-4 w-4 mr-2" />
          New Request
        </Button>
      </div>

      {requests.length === 0 ? (
        <div className="text-center py-12 bg-card border border-border rounded-lg">
          <p className="text-muted-foreground mb-4">
            You haven't created any blood requests yet
          </p>
          <Button onClick={() => router.push("/recipient/blood-requests")}>
            <Plus className="h-4 w-4 mr-2" />
            Create Your First Request
          </Button>
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
                      className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(
                        request.status
                      )}`}
                    >
                      {request.status.replace("_", " ").toUpperCase()}
                    </span>
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-medium border ${getUrgencyColor(
                        request.urgency
                      )}`}
                    >
                      {request.urgency.toUpperCase()} URGENCY
                    </span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() =>
                      router.push(
                        `/recipient/blood-requests/edit/${request.id}`
                      )
                    }
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setDeleteId(request.id)}
                    className="text-destructive hover:text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <p className="text-muted-foreground mb-4 line-clamp-2">
                {request.description}
              </p>

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
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
                  <p className="text-muted-foreground">Contact</p>
                  <p className="font-medium">{request.contact_phone}</p>
                </div>
                <div>
                  <p className="text-muted-foreground">Location</p>
                  <p className="font-medium truncate">{request.address}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Blood Request</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this blood request? This action
              cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={deleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={deleting}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {deleting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                "Delete"
              )}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
