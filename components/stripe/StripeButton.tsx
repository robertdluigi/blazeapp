"use client";

import { Button } from "@/components/ui/button";
import axios from "axios";

interface StripeButtonProps {
  priceId: string;
}

const StripeButton = () => {
    const onSubscribe = async () => {
        try {
          const response = await axios.get("/api/stripe/checkout-session");
          window.location.href = response.data.url;
          console.log(response.data.url);
        } catch (error) {
          console.log(error, "Stripe client error");
        } finally {
          console.log("Stripe client error");
        }
      };

    return (
        <Button onClick={onSubscribe}>Subscribe</Button>
    )
}

export default StripeButton;