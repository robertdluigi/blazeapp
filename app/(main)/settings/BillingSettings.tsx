"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Check } from "lucide-react";
import StripeButton from "@/components/stripe/StripeButton";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import axios from "axios";

const proPlan = {
  name: "Pro",
  price: "$9.99",
  features: [
    "Unlimited reviews",
    "Priority support",
    "Advanced analytics",
  ],
};

interface BillingSettingsProps {
  currentPlan: string;
  stripeCustomerId?: string;
}

export default function BillingSettings({ currentPlan, stripeCustomerId }: BillingSettingsProps) {
  const [isUpgradeDialogOpen, setIsUpgradeDialogOpen] = useState(false);
  const handleManageSubscription = async () => {
    try {
      // Redirect to Stripe Customer Portal
      const response = await axios.get("/api/stripe/checkout-session");
      window.location.href = response.data.url;
    } catch (error) {
      console.error("Error managing subscription:", error);
      // Handle error (e.g., show an error message to the user)
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
        <h2 className="text-xl font-semibold mb-2 sm:mb-0">Current Plan: <span className="text-gray-600">{currentPlan}</span></h2>
        {currentPlan === "FREE" ? (
          <Dialog open={isUpgradeDialogOpen} onOpenChange={setIsUpgradeDialogOpen}>
            <DialogTrigger asChild>
              <Button size="sm">Upgrade to PRO</Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
              <DialogHeader>
                <DialogTitle className="text-2xl">Upgrade to Pro</DialogTitle>
                <DialogDescription className="text-lg">
                  Unlock premium features with our Pro plan.
                </DialogDescription>
              </DialogHeader>
              <Card className="mt-4">
                <CardHeader className="pb-2">
                  <CardTitle className="text-xl">{proPlan.name}</CardTitle>
                  <CardDescription className="text-lg font-semibold">{proPlan.price}/month</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {proPlan.features.map((feature) => (
                      <li key={feature} className="flex items-center">
                        <Check className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
                <CardFooter className="pt-4">
                  <StripeButton onSuccess={() => setIsUpgradeDialogOpen(false)} className="w-full" />
                </CardFooter>
              </Card>
            </DialogContent>
          </Dialog>
        ) : (
          <Button onClick={handleManageSubscription} size="sm">Manage Subscription</Button>
        )}
      </div>
      <div className="border-t pt-4 mt-4">
        <p className="text-sm text-gray-600">
          Having issues with your subscription? <a href="#" className="text-primary hover:underline">Contact our support team</a>.
        </p>
      </div>
    </div>
  );
}