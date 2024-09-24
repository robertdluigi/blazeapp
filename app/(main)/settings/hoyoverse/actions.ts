"use server";

import prisma from "@/lib/prisma";
import { validateRequest } from "@/auth";
import { revalidatePath } from "next/cache";

export async function addGenshinUID(uid: string): Promise<void> {
  const userId = await getUserId();
  await prisma.user.update({
    where: { id: userId },
    data: { genshinUid: uid },
  });
  revalidatePath('/settings');
}

export async function removeGenshinUID(): Promise<void> {
  const userId = await getUserId();
  await prisma.user.update({
    where: { id: userId },
    data: { genshinUid: null },
  });
  revalidatePath('/settings');
}

export async function addHonkaiUID(uid: string): Promise<void> {
  const userId = await getUserId();
  await prisma.user.update({
    where: { id: userId },
    data: { honkaiId: uid },
  });
  revalidatePath('/settings');
}

export async function removeHonkaiUID(): Promise<void> {
  const userId = await getUserId();
  await prisma.user.update({
    where: { id: userId },
    data: { honkaiId: null },
  });
  revalidatePath('/settings');
}

export async function addHoyolabTokens(tokens: { ltokenV2: string, ltuidV2: string }): Promise<void> {
  const userId = await getUserId();
  if (!userId) {
    throw new Error('User not authenticated');
  }

  await prisma.user.update({
    where: { id: userId },
    data: {
      hoyolabLtokenV2: tokens.ltokenV2,
      hoyolabLtuidV2: tokens.ltuidV2,
      hoyolabConnected: true
    },
  });

  revalidatePath('/settings');
}

async function getUserId(): Promise<string> {
  const { user } = await validateRequest();
  if (!user) {
    throw new Error('User not authenticated');
  }
  return user.id;
}