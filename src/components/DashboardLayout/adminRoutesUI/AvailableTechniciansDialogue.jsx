import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import axiosPublic from "@/lib/axiosPublic";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";

function AvailableTechniciansDialogue({ product }) {
  const queryClient = useQueryClient();

  const [open, setOpen] = useState(false);
  const [assigningId, setAssigningId] = useState(null);

  const { data: availableTechniciansData = [], isLoading } = useQuery({
    queryKey: ["available-technicians", open],
    queryFn: async () => {
      const result = await axiosPublic.get("/api/technicians/available");
      return result.data;
    },
    enabled: open,
  });

  const { mutate: assignTechnician, isPending } = useMutation({
    mutationFn: async ({ productId, technicianId }) => {
      const result = await axiosPublic.patch("/api/technicians/assign-product", {
        productId,
        technicianId,
      });
      return result.data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["available-technicians"],
        exact: false,
      });
      queryClient.invalidateQueries({ queryKey: ["all-products"], exact: false });

      setOpen(false);
      setAssigningId(null);
      toast.success("Technician assigned successfully");
    },
    onError: (error) => {
      console.error("Failed to assign technician:", error);
      toast.error(error.response?.data?.message || "Failed to assign technician");
      setAssigningId(null);
    },
  });

  const assignTechnicianToProduct = (productId, technicianId) => {
    setAssigningId(technicianId);
    assignTechnician({ productId, technicianId });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">Assign Technician</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-2xl" aria-describedby={undefined}>
        <DialogHeader>
          <DialogTitle>Available Technicians</DialogTitle>
        </DialogHeader>

        <div className="-mx-4 max-h-[60vh] overflow-y-auto border-y-2 px-4 no-scrollbar">
          {isLoading ? (
            <p>loading...</p>
          ) : (
            <div className="my-4 grid gap-2">
              {availableTechniciansData.map((technician) => (
                <div
                  key={technician._id}
                  className="flex items-center justify-between rounded-xl border bg-white px-4 py-3 shadow-sm transition hover:shadow-md"
                >
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-gray-200 font-semibold">
                      {technician.name?.charAt(0) || "T"}
                    </div>

                    <div>
                      <p className="text-sm font-medium">{technician.name}</p>
                      <p className="text-xs text-gray-500">{technician.mobileNumber}</p>
                    </div>
                  </div>

                  <div className="text-center text-xs text-gray-600">
                    <p>Active Jobs</p>
                    <p className="font-semibold">{technician.activeAssignments}</p>
                  </div>

                  <div className="text-right text-xs text-gray-600">
                    <p>Skills</p>
                    <p className="font-semibold capitalize">{technician.skills || "N/A"}</p>
                  </div>

                  <Button
                    variant="outline"
                    disabled={isPending}
                    onClick={() => assignTechnicianToProduct(product._id, technician._id)}
                  >
                    {assigningId === technician._id ? "Assigning..." : "Assign"}
                  </Button>
                </div>
              ))}

              {!availableTechniciansData.length && (
                <p className="py-4 text-center text-sm text-muted-foreground">
                  No approved technicians found.
                </p>
              )}
            </div>
          )}
        </div>

        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Close</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default AvailableTechniciansDialogue;
