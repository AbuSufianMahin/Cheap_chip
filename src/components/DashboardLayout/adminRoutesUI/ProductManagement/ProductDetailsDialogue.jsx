import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
} from '@/components/ui/dialog';
import Image from 'next/image';
import { Check, ArrowRight } from "lucide-react";
import { useQuery } from '@tanstack/react-query';
import axiosPublic from '@/lib/axiosPublic';
import { Skeleton } from '@/components/ui/skeleton';
const DELIVERY_STEPS = ['ordered', 'assigned', 'picked up', 'in Store house', 'delivered'];

function getStepState(step, currentStatus) {
    const currentIndex = DELIVERY_STEPS.indexOf(currentStatus);
    const stepIndex = DELIVERY_STEPS.indexOf(step);

    if (stepIndex < currentIndex) return "done";

    if (stepIndex === currentIndex) {
        return currentStatus === "delivered" ? "done" : "active";
    }

    return "pending";
}

function isFinalTechStatus(status) {
    return ["repaired", "can't be repaired"].includes(status);
}

function ProductDetailsDialogue({ productObjToShow, setProductObjToshow }) {

    const { data: deliverymanData = {}, isLoading: isDeliverymanLoading } = useQuery({
        queryKey: ["assigned-deliveryman-data", productObjToShow?.assignedDeliveryman],
        enabled: !!productObjToShow?.assignedDeliveryman,
        queryFn: async () => {
            const result = await axiosPublic.get(`/api/deliverymen/${productObjToShow.assignedDeliveryman}`);
            return result.data.data;
        }
    });

    // const { data: technicianData = {}, isLoading: isTechnicianLoading } = useQuery({
    //     queryKey: ["assigned-technician-data", productObjToShow?.assignedTechnician],
    //     enabled: !!productObjToShow?.assignedTechnician,
    //     queryFn: async () => {
    //         const result = await axiosPublic.get(`/api/technician/${productObjToShow.assignedTechnician}`);
    //         return result.data.data;
    //     }
    // });

    // console.log(deliverymanData)

    return (
        <Dialog open={!!productObjToShow} onOpenChange={(open) => { if (!open) setProductObjToshow(null) }} >
            <DialogContent className="sm:max-w-3xl">
                <DialogHeader>
                    <DialogTitle>{productObjToShow?.productName}</DialogTitle>
                    <DialogDescription className="text-xs text-muted-foreground">
                        Tracking ID: <span className="font-medium text-foreground">{productObjToShow?.trackingId}</span>
                    </DialogDescription>
                </DialogHeader>

                {/* Image */}
                <div className="relative w-full h-72">
                    <Image
                        src={
                            productObjToShow?.productImage ||
                            "https://res.cloudinary.com/dsos8ty6s/image/upload/q_auto/f_auto/v1777143751/no-image-icon-23485_im59ix.png"
                        }
                        fill
                        sizes="(max-width: 640px) 100vw, 100vw"
                        className="rounded-md object-contain"
                        alt={`${productObjToShow?.productName} image`}
                    />
                </div>

                {/* Delivery status stepper */}
                <div className="w-full">
                    <p className="text-sm font-semibold uppercase tracking-wide mb-4 ml-2">
                        Delivery status
                    </p>

                    <div className="flex items-start w-full">
                        {DELIVERY_STEPS.map((step, i) => {
                            const state = getStepState(step, productObjToShow?.current_status);

                            return (
                                <div key={step} className="flex-1 flex flex-col items-center relative">

                                    {/* Circle */}
                                    <div
                                        className={`w-7 h-7 rounded-full border-2 flex items-center justify-center ${state === "done" ? "bg-green-100 border-green-500 text-green-600" : state === "active" ? "bg-blue-100 border-blue-500 text-blue-600" : "bg-muted border-border text-muted-foreground"}`}
                                    >
                                        {state === "done" ? (
                                            <Check size={14} />
                                        ) : state === "active" ? (
                                            <ArrowRight size={14} />
                                        ) : (
                                            <span className="text-xs">•</span>
                                        )}
                                    </div>

                                    {/* Label */}
                                    <span
                                        className={`text-xs mt-2 text-center ${state === "active" ? "font-semibold text-foreground" : "text-muted-foreground"
                                            }`}
                                    >
                                        {step}
                                    </span>

                                    {/* Line */}
                                    {i < DELIVERY_STEPS.length - 1 && (
                                        <div
                                            className={`absolute top-3 left-1/2 w-full h-0.5 z-[-1] ${state === "done" ? "bg-green-400" : "bg-border"}`}
                                        />
                                    )}
                                </div>
                            );
                        })}
                    </div>
                </div>

                {/* Technician verdict */}
                {isFinalTechStatus(productObjToShow?.current_status) && (
                    <div>
                        <p className="text-xs text-muted-foreground uppercase tracking-wide mb-2">Technician verdict</p>
                        <span className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium
                            ${productObjToShow?.technicianDecision === 'repaired'
                                ? 'bg-green-100 text-green-700'
                                : 'bg-red-100 text-red-700'}`}>
                            {productObjToShow?.technicianDecision}
                        </span>
                    </div>
                )}

                {/* Info grid */}
                <div className="grid grid-cols-2 gap-2">
                    {[
                        { label: 'Asking price', value: productObjToShow?.askingPrice ? `৳${productObjToShow.askingPrice}` : 'Not set' },
                        { label: 'Customer decision', value: productObjToShow?.customerDecision ?? 'Pending' },
                        { label: 'Condition', value: productObjToShow?.productCondition },
                        { label: 'Category', value: productObjToShow?.productCategory?.replace('_', ' ') },
                    ].map(({ label, value }) => (
                        <div key={label} className="bg-muted rounded-md px-3 py-2">
                            <p className="text-[11px] text-muted-foreground">{label}</p>
                            <p className="text-sm font-medium mt-0.5">{value}</p>
                        </div>
                    ))}
                </div>

                {/* Repair log */}
                {productObjToShow?.repairLog?.length > 0 && (
                    <div>
                        <p className="text-xs text-muted-foreground uppercase tracking-wide mb-2">Repair log</p>
                        {productObjToShow.repairLog.map((entry, i) => (
                            <div key={i} className="border-l-2 border-red-300 pl-3 mb-2">
                                <p className="text-[11px] text-muted-foreground">
                                    {new Date(entry.updatedAt).toLocaleDateString()} · {entry.updatedByEmail}
                                </p>
                                <p className="text-sm mt-0.5">Decision: <strong>{entry.decision}</strong></p>
                                {entry.note && <p className="text-xs text-muted-foreground mt-0.5">{entry.note}</p>}
                            </div>
                        ))}
                    </div>
                )}

                <div className='space-y-2'>
                    <h2 className='text-sm font-semibold uppercase tracking-wide ml-2'>Assigned Employees</h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">

                        {/* Deliveryman */}
                        {productObjToShow?.assignedDeliveryman && (
                            <div className="bg-muted rounded-md px-3 py-2">
                                <p className="text-[11px] text-muted-foreground">Delivery Man</p>

                                {isDeliverymanLoading ? (
                                    <div className="mt-2 space-y-2">
                                        <Skeleton className="h-4 w-28" />
                                        <Skeleton className="h-3 w-36" />
                                    </div>
                                ) : (
                                    <>
                                        <p className="text-sm font-medium">
                                            {deliverymanData?.name}
                                        </p>
                                        <p className="text-xs text-muted-foreground">
                                            {deliverymanData?.email}
                                        </p>
                                    </>
                                )}
                            </div>
                        )}

                        {/* Technician */}
                        {/* {productObjToShow?.assignedTechnician && (
                        <div className="bg-muted rounded-md px-3 py-2">
                            <p className="text-[11px] text-muted-foreground">Technician</p>
                            <p className="text-sm font-medium">
                                {technicianData?.name || "Loading..."}
                            </p>
                            <p className="text-xs text-muted-foreground">
                                {technicianData?.email || ""}
                            </p>
                        </div>
                    )} */}
                    </div>
                </div>
            </DialogContent>
        </Dialog>
    )
}

export default ProductDetailsDialogue