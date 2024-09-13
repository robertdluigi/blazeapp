import { NextRequest } from 'next/server';
import prisma from '@/lib/prisma';
import { createCanvas, loadImage, CanvasRenderingContext2D } from 'canvas';
import fetch from 'node-fetch';
import sharp from 'sharp';

export async function GET(
  request: NextRequest,
  { params }: { params: { username: string } }
) {
  const { username } = params;

  if (!username) {
    return new Response('Missing username', { status: 400 });
  }

  const user = await prisma.user.findFirst({
    where: {
      username: {
        equals: username,
        mode: 'insensitive'
      }
    },
    select: {
      displayName: true,
      avatarUrl: true,
      cardPrimaryColor: true,
      cardSecondaryColor: true,
    }
  });

  if (!user) {
    return new Response('User not found', { status: 404 });
  }

  console.log('User data:', user);  // Log the user data

  const canvas = createCanvas(1200, 630);
  const ctx = canvas.getContext('2d');

  // Background
  const gradient = ctx.createLinearGradient(0, 0, 1200, 630);
  gradient.addColorStop(0, user.cardPrimaryColor || '#000000');
  gradient.addColorStop(1, user.cardSecondaryColor || '#FFFFFF');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, 1200, 630);

  // Avatar
  console.log('Drawing avatar...');
  await drawAvatar(ctx, user.avatarUrl);
  console.log('Avatar drawing completed');

  // Text
  ctx.fillStyle = 'white';
  ctx.textAlign = 'left';
  ctx.font = '24px Arial, sans-serif';
  ctx.fillText(user.displayName || username, 500, 280);
  
  ctx.font = '24px Arial, sans-serif';
  ctx.fillText(`@${username}`, 500, 340);

  // Reputation (demo number)
  const demoReputation = 1245; // You can adjust this demo number as needed
  ctx.font = '24px Arial, sans-serif';
  ctx.fillText(`Reputation: ${demoReputation}`, 500, 420);

  const buffer = canvas.toBuffer('image/png');
  return new Response(buffer, {
    headers: { 'Content-Type': 'image/png' },
  });
}

async function drawAvatar(ctx: CanvasRenderingContext2D, avatarUrl: string | null) {
  try {
    if (avatarUrl) {
      console.log('Attempting to load avatar from:', avatarUrl);
      
      const response = await fetch(avatarUrl);
      const arrayBuffer = await response.arrayBuffer();
      const buffer = await sharp(Buffer.from(arrayBuffer))
        .png()
        .toBuffer();
      const avatar = await loadImage(buffer);

      console.log('Avatar loaded successfully, dimensions:', avatar.width, 'x', avatar.height);

      ctx.save();
      ctx.beginPath();
      ctx.arc(300, 315, 150, 0, Math.PI * 2);
      ctx.closePath();
      ctx.clip();
      ctx.drawImage(avatar, 150, 165, 300, 300);
      ctx.restore();
      console.log('Avatar drawn on canvas');
    } else {
      console.log('No avatar URL provided, drawing placeholder');
      drawPlaceholderAvatar(ctx);
    }
  } catch (error) {
    console.error('Error loading avatar:', error);
    console.error('Avatar URL that caused the error:', avatarUrl);
    drawPlaceholderAvatar(ctx);
  }
}

function drawPlaceholderAvatar(ctx: CanvasRenderingContext2D) {
  ctx.beginPath();
  ctx.arc(300, 315, 150, 0, Math.PI * 2);
  ctx.fillStyle = '#CCCCCC';
  ctx.fill();
}
