import { NextRequest, NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';
import { rateLimiter } from '@/lib/rateLimiter'; // Adjust the path to your rate limiter file

const prisma = new PrismaClient();

export async function POST(request: NextRequest) {
    try {
        const { email } = await request.json();
        const ip = request.headers.get('x-forwarded-for') || 'unknown'; // Get the client's IP address

        if (!rateLimiter(ip)) {
            return NextResponse.json({ type: 'Error', message: 'Too many requests. Please try again later.' }, { status: 429 });
        }

        if (!email) {
            return NextResponse.json({ type: 'Error', message: 'Email is required' }, { status: 400 });
        }

        // Check if the email is already subscribed
        const existingSubscriber = await prisma.subscriber.findUnique({
            where: { email },
        });

        if (existingSubscriber) {
            return NextResponse.json({ type: 'Info', message: 'You are already subscribed.' }, { status: 400 });
        }

        // Create a new subscriber record in the database
        await prisma.subscriber.create({
            data: { email },
        });

        return NextResponse.json({ type: 'Success', message: 'Success! You are subscribed.' });
    } catch (error) {
        console.error('Error saving subscriber:', error);
        return NextResponse.json({ type: 'Error', message: 'Error saving subscriber.' }, { status: 500 });
    }
}
