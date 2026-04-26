"use client";

import { useMemo } from "react";
import { useSession } from "next-auth/react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import axiosPublic from "@/lib/axiosPublic";
import { Button } from "@/components/ui/button";

const FINAL_TECHNICIAN_STATUSES = ["repaired", "can't be repaired"];

function normalizeStatus(status) {
  return typeof status === "string" ? status.trim().toLowerCase() : "";
}

function StatusBadge({ status }) {
  const normalizedStatus = normalizeStatus(status) || "pending inspection";

  const badgeClassByStatus = {
    assigned: "bg-slate-100 text-slate-700",
    processing: "bg-amber-100 text-amber-700",
    "picked up": "bg-sky-100 text-sky-700",
    "in store house": "bg-violet-100 text-violet-700",
    repaired: "bg-emerald-100 text-emerald-700",
    "can't be repaired": "bg-rose-100 text-rose-700",
    "pending inspection": "bg-slate-100 text-slate-700",
  };

  return (
    <span
      className={`rounded-full px-3 py-1 text-xs font-medium ${
        badgeClassByStatus[normalizedStatus] || badgeClassByStatus["pending inspection"]
      }`}
    >
      {status || "pending inspection"}
    </span>
  );
}

export default function TechnicianAssignmentsBoard({
  title,
  description,
  view,
  allowStatusUpdate,
}) {
  const { data: session } = useSession();
  const queryClient = useQueryClient();

  const technicianEmail = useMemo(
    () => session?.user?.email?.trim()?.toLowerCase() || "",
    [session?.user?.email],
  );

  const queryKey = ["technician-assignments", technicianEmail, view];

  const {
    data: products = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey,
    enabled: Boolean(technicianEmail),
    queryFn: async () => {
      const response = await axiosPublic.get(
        `/api/technicians/assigned?email=${encodeURIComponent(technicianEmail)}&view=${encodeURIComponent(view || "assigned")}`,
      );
      return response.data;
    },
  });

  const { mutate: updateStatus, isPending } = useMutation({
    mutationFn: async ({ productId, status }) => {
      const response = await axiosPublic.patch("/api/technicians/status", {
        productId,
        email: technicianEmail,
        status,
      });
      return response.data;
    },
    onSuccess: () => {
      toast.success("Product health status updated");
      queryClient.invalidateQueries({ queryKey: ["technician-assignments"] });
      queryClient.invalidateQueries({ queryKey: ["all-products"], exact: false });
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message || "Failed to update product status");
    },
  });

  const visibleProducts = useMemo(() => {
    if (view === "assigned") {
      return products.filter(
        (product) => !FINAL_TECHNICIAN_STATUSES.includes(normalizeStatus(product.current_status)),
      );
    }

    if (view === "completed") {
      return products.filter((product) =>
        FINAL_TECHNICIAN_STATUSES.includes(normalizeStatus(product.current_status)),
      );
    }

    return products;
  }, [products, view]);

  return (
    <section className="space-y-4">
      <div>
        <h1 className="text-3xl font-bold">{title}</h1>
        <p className="mt-1 text-sm text-muted-foreground">{description}</p>
      </div>

      {isLoading && <p>Loading technician products...</p>}

      {isError && (
        <p className="text-red-500">
          Failed to load technician products. Please try again.
        </p>
      )}

      {!isLoading && !visibleProducts.length && (
        <div className="rounded-lg border p-4 text-sm text-muted-foreground">
          No products found.
        </div>
      )}

      <div className="space-y-3">
        {visibleProducts.map((product) => (
          <article key={product._id} className="space-y-3 rounded-xl border bg-white p-4">
            <div className="flex items-center justify-between gap-3">
              <div>
                <h2 className="text-base font-semibold">{product.productName || "Product"}</h2>
                <p className="text-sm text-muted-foreground">
                  {product.productCategory || "Uncategorized"}
                </p>
              </div>
              <StatusBadge status={product.current_status} />
            </div>

            <div className="grid gap-2 text-sm sm:grid-cols-2">
              <p>
                <span className="font-medium">Condition:</span> {product.productCondition || "N/A"}
              </p>
              <p>
                <span className="font-medium">Location:</span> {product.productLocation || "N/A"}
              </p>
            </div>

            {allowStatusUpdate && (
              <div className="flex flex-wrap items-center gap-2 pt-2">
                {FINAL_TECHNICIAN_STATUSES.map((status) => (
                  <Button
                    key={status}
                    variant="outline"
                    disabled={isPending || normalizeStatus(product.current_status) === status}
                    onClick={() => updateStatus({ productId: product._id, status })}
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
