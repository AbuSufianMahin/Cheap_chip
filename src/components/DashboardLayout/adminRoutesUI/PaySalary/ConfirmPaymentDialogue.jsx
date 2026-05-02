"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import axiosPublic from "@/lib/axiosPublic";
import { useQueryClient } from "@tanstack/react-query";
import { CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { toast } from "sonner";

function ConfirmPaymentDialogue({ employee, onClose }) {
    const stripe = useStripe();
    const elements = useElements();
    const queryClient = useQueryClient();
    const [isLoading, setIsLoading] = useState(false);
    const [cardError, setCardError] = useState("");

    const initials = employee?.name
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase();

    async function handleConfirm(e) {
        e.preventDefault();
        if (!stripe || !elements) return;

        const card = elements.getElement(CardElement);
        if (!card) return;

        const { error } = await stripe.createPaymentMethod({ type: "card", card });
        if (error) {
            setCardError(error.message);
            return;
        }
        setCardError("");
        setIsLoading(true);

        try {
            // Step 1: create payment intent
            const res = await axiosPublic.post("/api/employees/create-payment-intent", {
                amount: employee.payableAmount,
                employeeId: employee._id,
            });
            const clientSecret = res.data.clientSecret;

            // Step 2: confirm card payment
            const result = await stripe.confirmCardPayment(clientSecret, {
                payment_method: {
                    card: elements.getElement(CardElement),
                    billing_details: { name: employee.name, email: employee.email },
                },
            });

            if (result.error) {
                setCardError(result.error.message);
            } else if (result.paymentIntent.status === "succeeded") {
                // Step 3: log to MongoDB
                await axiosPublic.post(`/api/employees/pay/${employee._id}`, {
                    ...employee,
                    transactionId: result.paymentIntent.id,
                });

                toast.success(`Payment of $${employee.payableAmount} sent to ${employee.name}`);
                queryClient.invalidateQueries({ queryKey: ["all-employees"] });
                onClose();
            }
        } catch (err) {
            toast.error(err.message || "Payment failed.");
        } finally {
            setIsLoading(false);
        }
    }

    return (
        <Dialog open={!!employee} onOpenChange={onClose}>
            <DialogContent className="max-w-md">
                <DialogHeader>
                    <DialogTitle className="text-base font-medium">Confirm payment</DialogTitle>
                </DialogHeader>

                {employee && (
                    <form onSubmit={handleConfirm} className="space-y-4">
                        {/* Employee info */}
                        <div className="flex items-center gap-3 p-3 bg-muted rounded-xl">
                            <div className="w-10 h-10 rounded-full bg-blue-100 text-blue-700 flex items-center justify-center text-sm font-medium shrink-0">
                                {initials}
                            </div>
                            <div>
                                <p className="font-medium text-sm">{employee.name}</p>
                                <p className="text-xs text-muted-foreground">{employee.email} · {employee.phone}</p>
                            </div>
                        </div>

                        {/* Breakdown */}
                        <div className="border rounded-xl overflow-hidden text-sm">
                            <div className="flex justify-between px-4 py-2.5 border-b">
                                <span className="text-muted-foreground">Deliveries this month</span>
                                <span className="font-medium">{employee.thisMonthDeliveries}</span>
                            </div>
                            <div className="flex justify-between px-4 py-2.5 border-b">
                                <span className="text-muted-foreground">Rate per delivery</span>
                                <span className="font-medium">$10.00</span>
                            </div>
                            <div className="flex justify-between px-4 py-2.5 bg-muted">
                                <span className="font-medium">Total payable</span>
                                <span className="font-semibold text-green-600">${employee.payableAmount}</span>
                            </div>
                        </div>

                        {/* Card input */}
                        <div className="border px-3 py-2.5 rounded-xl bg-white dark:bg-background">
                            <CardElement
                                options={{
                                    style: {
                                        base: {
                                            fontSize: "16px",
                                            color: "#424770",
                                            "::placeholder": { color: "#aab7c4" },
                                        },
                                        invalid: { color: "#9e2146" },
                                    },
                                }}
                            />
                        </div>
                        {cardError && <p className="text-xs text-red-500 ml-1">{cardError}</p>}

                        {/* Actions */}
                        <div className="flex gap-2 mt-2">
                            <Button type="button" variant="outline" className="flex-1" onClick={onClose} disabled={isLoading}>
                                Cancel
                            </Button>
                            <Button
                                type="submit"
                                className="flex-2 rounded-xl"
                                disabled={isLoading || !stripe || employee.payableAmount === 0}
                            >
                                {isLoading ? "Processing..." : `Pay $${employee.payableAmount}`}
                            </Button>
                        </div>
                    </form>
                )}
            </DialogContent>
        </Dialog>
    );
}

export default ConfirmPaymentDialogue;