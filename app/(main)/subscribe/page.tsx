import { validateRequest } from "@/auth";
import StripeButton from "@/components/stripe/StripeButton";
import { SubscribeButton } from "@/components/stripe/SubscribeButton";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import prisma from "@/lib/prisma";
import { Check } from "lucide-react";
import { redirect } from "next/navigation";

const proPlan = {
  name: "Pro",
  price: "$9.99",
  features: [
    "Unlimited reviews",
    "Priority support",
    "Advanced analytics",
  ],
};

export default async function SubscribePage() {
  const { user } = await validateRequest();

  if (!user) {
    redirect("/login");
  }

  const subscription = await prisma.subscription.findUnique({
    where: { userId: user.id },
  });

  if (subscription && subscription.plan !== "FREE") {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen">
        <h1 className="text-2xl font-bold mb-4">You&apos;re already subscribed!</h1>
        <p>Your current plan: {subscription.plan}</p>
        <Button asChild className="mt-4">
          <a href="/settings">Manage Subscription</a>
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-8">Upgrade to Pro</h1>
      <div className="max-w-md mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>{proPlan.name}</CardTitle>
            <CardDescription>{proPlan.price}/month</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {proPlan.features.map((feature) => (
                <li key={feature} className="flex items-center">
                  <Check className="h-5 w-5 text-green-500 mr-2" />
                  {feature}
                </li>
              ))}
            </ul>
          </CardContent>
          <CardFooter>
            <StripeButton />
          </CardFooter>
        </Card>
      </div>
    </div>
  );
}