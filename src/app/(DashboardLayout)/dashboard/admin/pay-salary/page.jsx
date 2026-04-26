"use client"
import axiosPublic from '@/lib/axiosPublic';
import { useQuery } from '@tanstack/react-query'
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from '@/components/ui/button';
import ConfirmPaymentDialogue from '@/components/DashboardLayout/adminRoutesUI/PaySalary/ConfirmPaymentDialogue';
import { useState } from 'react';
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLIC_KEY);

function page() {
  const [employeeToPay, setEmployeeToPay] = useState();

  const { data: employeesData = [], isLoading, refetch: fetchEmployees } = useQuery({
    queryKey: ["all-employees"],
    queryFn: async () => {
      const result = await axiosPublic.get("/api/employees/get-all-employee");
      return result.data;
    }
  })

  return (
    <section className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold">
          Employee Payout - {employeesData?.periodLabel || "Loading..."}
        </h1>
      </div>

      {isLoading ? (
        <p>Loading...</p>
      ) : (
        <div className="grid md:grid-cols-2 gap-x-2 gap-y-4">
          {employeesData.employees.map((employee) => (
            <Card key={employee._id} className="rounded-2xl shadow-sm">
              <CardContent className="p-4 space-y-2">
                <div className="flex justify-between items-center">
                  <div>
                    <h2 className="font-semibold">{employee.name}</h2>
                    <p className="text-sm text-gray-500">{employee.email}</p>
                  </div>

                  <div className="text-right">
                    <p className="font-bold">
                      $ {employee.payableAmount}
                    </p>
                    <p className="text-xs text-gray-500">
                      {employee.thisMonthDeliveries} deliveries
                    </p>
                  </div>
                </div>

                <div className="flex justify-end gap-2">

                  <Button className=" mt-2 py-2" onClick={() => setEmployeeToPay(employee)}>
                    Pay Now
                  </Button>
                </div>


              </CardContent>
            </Card>
          ))}
        </div>
      )}
      <Elements stripe={stripePromise}>
        <ConfirmPaymentDialogue
          employee={employeeToPay}
          onClose={() => setEmployeeToPay(null)}
          onSuccess={() => fetchEmployees()} // refetch your list after payment
        />
      </Elements>
    </section>
  )
}

export default page