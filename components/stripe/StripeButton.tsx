"use client";

import { Button } from "@/components/ui/button";
import axios from "axios";

interface StripeButtonProps {
  onSuccess?: () => void;
  className?: string;
}

const StripeButton: React.FC<StripeButtonProps> = ({ onSuccess, className }) => {
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
        <Button onClick={onSubscribe}  className={className}>Subscribe</Button>
    )
}

export default StripeButton;