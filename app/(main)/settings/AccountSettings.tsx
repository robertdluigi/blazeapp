"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";

export default function AccountSettings() {
  const [email, setEmail] = useState("user@example.com");
  const [password, setPassword] = useState("");
  const [twoFactor, setTwoFactor] = useState(false);

  const handleSave = () => {
    // Implement save logic here
    console.log("Saving account settings:", { email, password, twoFactor });
  };

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>
      <div className="space-y-2">
        <Label htmlFor="password">Change Password</Label>
        <Input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="Enter new password"
        />
      </div>
      <div className="flex items-center space-x-2">
        <Switch
          id="two-factor"
          checked={twoFactor}
          onCheckedChange={setTwoFactor}
        />
        <Label htmlFor="two-factor">Enable Two-Factor Authentication</Label>
      </div>
      <Button onClick={handleSave}>Save Changes</Button>
    </div>
  );
}
