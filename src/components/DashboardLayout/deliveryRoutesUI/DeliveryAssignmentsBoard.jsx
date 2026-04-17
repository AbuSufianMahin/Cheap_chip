"use client";

import { useMemo } from "react";
import { useSession } from "next-auth/react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import axiosPublic from "@/lib/axiosPublic";
import { Button } from "@/components/ui/button";

const ALLOWED_STATUSES = ["on the way", "picked up", "delivered", "in Store house"];

function StatusBadge({ status }) {
  const normalizedStatus = (status || "assigned").toLowerCase();

  const badgeClassByStatus = {
    assigned: "bg-slate-100 text-slate-700",
    "on the way": "bg-amber-100 text-amber-700",
    "picked up": "bg-sky-100 text-sky-700",
    delivered: "bg-emerald-100 text-emerald-700",
    "in store house": "bg-violet-100 text-violet-700",
  };

  return (
    <span className={`rounded-full px-3 py-1 text-xs font-medium ${badgeClassByStatus[normalizedStatus] || badgeClassByStatus.assigned}`}>
      {status || "assigned"}
    </span>
  );
}

export default function DeliveryAssignmentsBoard({
  title,
  description,
  activeOnly,
  allowStatusUpdate,
}) {
  const { data: session } = useSession();
  const queryClient = useQueryClient();

  const deliveryEmail = useMemo(
    () => session?.user?.email?.trim()?.toLowerCase() || "",
    [session?.user?.email],
  );

  const queryKey = ["delivery-assignments", deliveryEmail, activeOnly];

  const {
    data: deliveries = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey,
    enabled: Boolean(deliveryEmail),
    queryFn: async () => {
      const response = await axiosPublic.get(
        `/api/deliverymen/assigned?email=${encodeURIComponent(deliveryEmail)}&activeOnly=${activeOnly}`,
      );
      return response.data;
    },
  });

  const { mutate: updateStatus, isPending } = useMutation({
    mutationFn: async ({ productId, status }) => {
      const response = await axiosPublic.patch("/api/deliverymen/status", {
        productId,
        email: deliveryEmail,
        status,
      });
      return response.data;
    },
    onSuccess: () => {
      toast.success("Delivery status updated");
      queryClient.invalidateQueries({ queryKey: ["delivery-assignments"] });
      queryClient.invalidateQueries({ queryKey: ["all-products"], exact: false });
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message || "Failed to update status");
    },
  });

  return (
    <section className="space-y-4">
      <div>
        <h1 className="text-3xl font-bold">{title}</h1>
        <p className="text-sm text-muted-foreground mt-1">{description}</p>
      </div>

      {isLoading && <p>Loading assigned deliveries...</p>}

      {isError && (
        <p className="text-red-500">
          Failed to load assigned deliveries. Please try again.
        </p>
      )}

      {!isLoading && !deliveries.length && (
        <div className="rounded-lg border p-4 text-sm text-muted-foreground">
          No deliveries found.
        </div>
      )}

      <div className="space-y-3">
        {deliveries.map((delivery) => (
          <article key={delivery._id} className="rounded-xl border bg-white p-4 space-y-3">
            <div className="flex items-center justify-between gap-3">
              <div>
                <h2 className="text-base font-semibold">{delivery.name || "Product"}</h2>
                <p className="text-sm text-muted-foreground">{delivery.description || "No description"}</p>
              </div>
              <StatusBadge status={delivery.current_status} />
            </div>

            <div className="grid gap-2 text-sm sm:grid-cols-2">
              <p>
                <span className="font-medium">Price:</span>{" "}
                {typeof delivery.askingPrice === "number" ? `৳${delivery.askingPrice}` : "N/A"}
              </p>
              <p>
                <span className="font-medium">Location:</span> {delivery.location || "N/A"}
              </p>
            </div>

            {allowStatusUpdate && (
              <div className="flex flex-wrap items-center gap-2 pt-2">
                {ALLOWED_STATUSES.map((status) => (
                  <Button
                    key={status}
                    variant="outline"
                    disabled={isPending || delivery.current_status === status}
                    onClick={() => updateStatus({ productId: delivery._id, status })}
                  >
                    {status}
                  </Button>
                ))}
              </div>
            )}
          </article>
        ))}
      </div>
    </section>
  );
}
