'use client';

import { useState } from 'react';

const NewsletterSignUp = () => {
    const [email, setEmail] = useState('');
    const [status, setStatus] = useState<{ type: string, message: string } | null>(null);

    const handleSubmit = async (event: React.FormEvent) => {
        event.preventDefault();
        setStatus(null);

        try {
            const response = await fetch('/api/email', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email }),
            });

            const data = await response.json();
            if (response.ok) {
                setStatus({ type: 'Success', message: 'Success! You are subscribed.' });
                setEmail('');
            } else {
                // Handle the different types of responses
                setStatus({ type: data.type || 'Error', message: data.message || 'Error subscribing.' });
            }
        } catch (error) {
            setStatus({ type: 'Error', message: 'Error subscribing.' });
        }
    };

    return (
        <section>
            <div className="container mx-auto px-4">
                <div className="text-center mb-8">
                    <h2 className="text-3xl font-bold text-gray-800">Join the waitlist</h2>
                    <p className="section-description mt-5">Join our waitlist to show your interest and help shape the future of our app!</p>
                </div>
                <div className="flex justify-center">
                    <div className="p-8 bg-white border border-[#c9c8c8] rounded-3xl shadow-[0_7px_14px_#EAEAEA] max-w-md w-full">
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div>
                                <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email:</label>
                                <input
                                    type="email"
                                    id="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    placeholder="Enter your email"
                                    required
                                    className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                />
                            </div>
                            <button
                                type="submit"
                                className="w-full py-3 px-4 bg-black text-white font-semibold rounded-lg shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                            >
                                Subscribe
                            </button>
                            {status && <p className={`text-center text-sm mt-4 ${status.type === 'Error' ? 'text-red-600' : status.type === 'Info' ? 'text-yellow-600' : 'text-green-600'}`}>{status.message}</p>}
                        </form>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default NewsletterSignUp;
