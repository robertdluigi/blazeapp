import { Separator } from "@/components/ui/separator";

export default function PrivacyPolicy() {
  return (
    <main className="flex justify-center w-full min-w-0 p-5">
      <div className="w-full max-w-4xl space-y-8">
        <h1 className="text-4xl font-bold text-center text-gray-900 dark:text-white">Privacy Policy</h1>

        <section>
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">Introduction</h2>
          <p className="mt-2 text-black dark:text-white">
            Welcome to our Privacy Policy. Your privacy is critically important to us. This document explains how we collect, use, and share your personal information.
          </p>
        </section>

        <Separator />

        <section>
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">Information We Collect</h2>
          <p className="mt-2 text-black dark:text-white">
            We collect various types of information in connection with the services we provide, including:
          </p>
          <ul className="list-disc list-inside mt-2 text-gray-700 dark:text-white">
            <li>Personal information (e.g., name, email address)</li>
            <li>Gaming activity and performance data</li>
            <li>Interactions with other users</li>
          </ul>
        </section>

        <Separator />

        <section>
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">How We Use Your Information</h2>
          <p className="mt-2 text-gray-700 dark:text-black">
            Your information is used to enhance your experience on our platform, such as:
          </p>
          <ul className="list-disc list-inside mt-2 text-gray-700 dark:text-white">
            <li>Personalizing your profile</li>
            <li>Enabling social interactions and reviews</li>
            <li>Improving our platform and services</li>
          </ul>
        </section>

        <Separator />

        <section>
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">Sharing Your Information</h2>
          <p className="mt-2 text-gray-700 dark:text-white">
            We do not share your personal information with third parties, except in the following cases:
          </p>
          <ul className="list-disc list-inside mt-2 text-gray-700 dark:text-white">
            <li>With your consent</li>
            <li>For legal compliance</li>
            <li>To protect the rights and safety of our users</li>
          </ul>
        </section>

        <Separator />

        <section>
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">Your Rights and Choices</h2>
          <p className="mt-2 text-gray-700 dark:text-white">
            You have control over your personal information. You can:
          </p>
          <ul className="list-disc list-inside mt-2 text-gray-700 dark:text-white">
            <li>Access and update your information</li>
            <li>Request the deletion of your data</li>
            <li>Opt-out of certain data collection practices</li>
          </ul>
        </section>

        <Separator />

        <section>
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">Data Security</h2>
          <p className="mt-2 text-gray-700 dark:text-white">
            We take reasonable measures to protect your information from unauthorized access, use, or disclosure.
          </p>
        </section>

        <Separator />

        <section>
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">Changes to This Policy</h2>
          <p className="mt-2 text-gray-700 dark:text-white">
            We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new policy on our website.
          </p>
        </section>

        <Separator />

        <section>
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">Contact Us</h2>
          <p className="mt-2 text-gray-700 dark:text-white">
            If you have any questions about this Privacy Policy, please contact us at: robertdluigi@gmail.com.
          </p>
        </section>
      </div>
    </main>
  );
}
