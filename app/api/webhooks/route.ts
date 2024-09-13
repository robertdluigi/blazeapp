import prisma from '@/lib/prisma';
import { PlanType } from '@prisma/client';
import { NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: '2024-06-20' });

const WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET!;

export async function POST(req: Request) {
  const body = await req.text();
  const sig = req.headers.get("stripe-signature")!;
  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, sig, WEBHOOK_SECRET);
  } catch (err: any) {
    console.error("Webhook signature verification failed.", err.message);
    return NextResponse.json({ error: `Webhook Error: ${err.message}` }, { status: 400 });
  }

  try {
    switch (event.type) {
      case 'checkout.session.completed':
        await handleCheckoutSessionCompleted(event.data.object as Stripe.Checkout.Session);
        break;
      case 'customer.subscription.deleted':
        await handleSubscriptionCancelled(event.data.object as Stripe.Subscription);
        break;
      default:
        console.log(`Unhandled event type ${event.type}`);
    }

    return NextResponse.json({ received: true }, { status: 200 });
  } catch (err: unknown) {
    if (err instanceof Error) {
      console.error(`Webhook Error: ${err.message}`);
      return NextResponse.json({ error: err.message }, { status: 400 });
    } else {
      console.error('Unknown webhook error');
      return NextResponse.json({ error: 'Unknown webhook error' }, { status: 400 });
    }
  }
}

async function handleCheckoutSessionCompleted(session: Stripe.Checkout.Session) {
  const userId = session.metadata?.userId;
  const subscriptionId = session.subscription as string;

  if (!userId) {
    throw new Error('No client_reference_id found in session');
  }

  const subscription = await stripe.subscriptions.retrieve(subscriptionId);
  const customerId = subscription.customer as string;

  await prisma.subscription.upsert({
    where: { userId: userId },
    update: {
      stripeCustomerId: customerId,
      stripeSubscriptionId: subscriptionId,
      plan: PlanType.PRO,
      expiresAt: new Date(subscription.current_period_end * 1000),
    },
    create: {
      userId: userId,
      stripeCustomerId: customerId,
      stripeSubscriptionId: subscriptionId,
      plan: PlanType.PRO,
      expiresAt: new Date(subscription.current_period_end * 1000),
    },
  });

  await prisma.user.update({
    where: { id: userId },
    data: { plan: PlanType.PRO },
  });

  console.log(`Subscription created/updated and user updated to PRO plan for user ${userId}`);
}

async function handleSubscriptionUpdated(subscription: Stripe.Subscription) {
  const subscriptionId = subscription.id;
  const userId = subscription.metadata?.userId;

  if (!userId) {
    throw new Error('No client_reference_id found in session');
  }
  
}
async function handleSubscriptionCreated(subscription: Stripe.Subscription) {
  const subscriptionId = subscription.id;
  const userId = subscription.metadata?.userId;

  if (!userId) {
    throw new Error('No client_reference_id found in session');
  }
  
}

async function handleSubscriptionDeleted(subscription: Stripe.Subscription) {
  const subscriptionId = subscription.id;
  const userId = subscription.metadata?.userId;

  if (!userId) {
    throw new Error('No client_reference_id found in session');
  }

  await prisma.subscription.update({
    where: { userId: userId },
    data: {
      plan: PlanType.FREE,
      expiresAt: new Date(subscription.current_period_end * 1000),
    },
  });
  
  await prisma.user.update({
    where: { id: userId },
    data: { plan: PlanType.FREE },
  });

  console.log(`Subscription cancelled and user reverted to FREE plan for user ${userId}`);

} 

async function handleSubscriptionCancelled(subscription: Stripe.Subscription) {
  const subscriptionId = subscription.id;

  const dbSubscription = await prisma.subscription.findFirst({
    where: { stripeSubscriptionId: subscriptionId },
    select: { userId: true },
  });

  if (dbSubscription) {
    await prisma.subscription.update({
      where: { userId: dbSubscription.userId },
      data: {
        plan: PlanType.FREE,
        expiresAt: new Date(subscription.current_period_end * 1000),
      },
    });

    console.log(`Subscription cancelled and user reverted to FREE plan for user ${dbSubscription.userId}`);
  } else {
    console.error(`No subscription found for Stripe subscription ID: ${subscriptionId}`);
  }
}
