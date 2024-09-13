
import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { stripe } from "@/lib/stripe";
import { validateRequest } from "@/auth";

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const { user } =  await validateRequest();
    const userId = user?.id;
    if (!userId || !user) {
      return new NextResponse("unauthoriced", {
        status: 401,
      });
    }

    const userSubscription = await prisma.subscription.findUnique({
      where: {
        userId: user.id,
      },
    });

    if (userSubscription && userSubscription.stripeCustomerId) {
      const stripeSession = await stripe.billingPortal.sessions.create({
        customer: userSubscription.stripeCustomerId,
        return_url: `${process.env.URL}/subscribe`,
      });

      return NextResponse.json({ url: stripeSession.url });
    }

    const stripeSession = await stripe.checkout.sessions.create({
      success_url: `${process.env.URL}/settings?success=true&session_id={CHECKOUT_SESSION_ID}&&userId=${userId}`,
      cancel_url: `${process.env.URL}/settings?canceled=true`,
      payment_method_types: ["card"],
      mode: "subscription",
      billing_address_collection: "auto",
      customer_email: user.email,
      line_items: [
        {
          price_data: {
            currency: "EUR",
            product_data: {
              name: "Pro Plan",
              description: "Unlock Blaze Pro",
            },
            unit_amount: 500,
            recurring: {
              interval: "month",
            },
          },
          quantity: 1,
        },
      ],
      metadata: {
        userId,
      },
    });

    return NextResponse.json({ url: stripeSession.url });
  } catch (error) {
    console.log("[STRIPE_ERROR]", error);

    return new NextResponse("Internal Server Error", {
      status: 500,
    });
  }
}