import { CheckCircle2 } from "lucide-react"

function ClearedPaymentState() {
    return (
        <section className="space-y-4">
            <div className="bg-white shadow-md rounded-2xl border p-10 flex flex-col items-center gap-4 text-center">
                <div className="w-13 h-13 rounded-full bg-green-100 flex items-center justify-center">
                    <CheckCircle2 className="text-green-600 w-6 h-6" />
                </div>
                <div>
                    <p className="font-semibold text-base">All payments cleared</p>
                    <p className="text-sm text-gray-500 mt-1">
                        Every employee has been paid for this period.
                    </p>
                </div>
            </div>
        </section>
    )
}

export default ClearedPaymentState