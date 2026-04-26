import { Button } from "@/components/ui/button";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import axiosPublic from "@/lib/axiosPublic";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";

function AvailableRidersDialogue({ product }) {
    const queryClient = useQueryClient();

    const [open, setOpen] = useState(false);
    const [assigningId, setAssigningId] = useState(null);

    const { data: availableDeliverymenData = [], isLoading } = useQuery({
        queryKey: ["available-deliverymen", open],
        queryFn: async () => {
            // this needs to be axiosSecure
            const result = await axiosPublic.get(`/api/deliverymen/available`);
            return result.data;
        },
        enabled: open,
    })

    const { mutate: assignRider, isPending } = useMutation({
        mutationFn: async ({ productId, deliverymanId }) => {
            const result = await axiosPublic.patch(`/api/deliverymen/assign-product`, {
                productId,
                deliverymanId,
            });
            return result.data;
        },
        onSuccess: () => {
            // updating fetched values
            queryClient.invalidateQueries({ queryKey: ["available-deliverymen"], exact: false });
            queryClient.invalidateQueries({ queryKey: ["all-products"], exact: false });

            // ui variables
            setOpen(false);
            toast.success("Rider assigned successfully");
            setAssigningId(null);
        },
        onError: (error) => {
            console.error("Failed to assign rider:", error);
            toast.error(error.response?.data?.message || "Failed to assign rider");
            setAssigningId(null);
        },
    });

    const assignRiderToProduct = (productId, deliverymanId) => {
        setAssigningId(deliverymanId);
        assignRider({ productId, deliverymanId });
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild >
                <Button variant='outline' className={"flex-1"}>Assign Deliveryman</Button>
            </DialogTrigger>
            <DialogContent className={"sm:max-w-2xl"} aria-describedby={undefined}>
                <DialogHeader>
                    <DialogTitle>Available Deliverymen</DialogTitle>
                </DialogHeader>

                <div className="-mx-4 no-scrollbar max-h-[60vh] overflow-y-auto px-4 border-y-2">

                    {
                        isLoading ? <p>
                            loading...
                        </p>
                            :
                            <div className="grid gap-2 my-4">
                                {availableDeliverymenData.map((deliveryman) =>
                                    <div key={deliveryman._id} className="flex items-center justify-between bg-white border rounded-xl px-4 py-3 shadow-sm hover:shadow-md transition">

                                        {/* Left */}
                                        <div className="flex items-center gap-3">
                                            {/* Avatar */}
                                            <div className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center font-semibold">
                                                {deliveryman.name.charAt(0)}
                                            </div>

                                            {/* Info */}
                                            <div>
                                                <p className="text-sm font-medium">{deliveryman.name}</p>
                                                <p className="text-xs text-gray-500">{deliveryman.phone}</p>
                                            </div>
                                        </div>

                                        {/* Middle */}
                                        <div className="text-xs text-gray-600 text-center">
                                            <p>Active</p>
                                            <p className="font-semibold">
                                                {deliveryman.currentlyAssigned.length}/5
                                            </p>
                                        </div>

                                        {/* Right */}
                                        <div className="text-right">
                                            <p className="text-xs text-gray-500">Total Collected</p>
                                            <p className="text-sm font-semibold">
                                                ৳{deliveryman.stats.moneyCollected}
                                            </p>
                                        </div>


                                        <Button variant="outline" disabled={isPending} onClick={() => assignRiderToProduct(product._id, deliveryman._id)}>
                                            {assigningId === deliveryman._id ? "Assigning..." : "Assign"}
                                        </Button>
                                    </div>
                                )}
                            </div>
                    }

                </div>

                <DialogFooter>
                    <DialogClose asChild>
                        <Button variant="outline">Close</Button>
                    </DialogClose>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}

export default AvailableRidersDialogue