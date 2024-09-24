import { NextResponse } from 'next/server';
import enka from '@/lib/enka';
import NodeCache from 'node-cache';

const cache = new NodeCache({ stdTTL: 3600 });

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const uid = searchParams.get('uid');
  const characterName = searchParams.get('character');

  if (!uid || !characterName) {
    return NextResponse.json({ error: 'Missing UID or character name' }, { status: 400 });
  }

  try {
    const user = await enka.fetchUser(uid);
    
    console.log(`Fetched user data for UID: ${uid}`);
    console.log(`Available characters: ${user.characters.map(c => c.characterData.name.get()).join(', ')}`);
    
    const character = user.characters.find(char => 
      char.characterData.name.get().toLowerCase() === characterName.toLowerCase()
    );

    if (!character) {
      console.log(`Character "${characterName}" not found for UID: ${uid}`);
      return NextResponse.json({ error: 'Character not found', availableCharacters: user.characters.map(c => c.characterData.name.get()) }, { status: 404 });
    }

    const characterData = {
      name: character.characterData.name.get(),
      level: character.level,
      maxLevel: character.maxLevel,
      stats: character.stats.statProperties.map(stats => ({
        name: stats.fightPropName.get(),
        value: stats.valueText
      }))
    };

    enka.close();
    return NextResponse.json(characterData);
  } catch (error) {
    console.error('Error fetching character data:', error);
    enka.close();
    if (error instanceof Error) {
      return NextResponse.json({ error: 'Failed to fetch character data', details: error.message }, { status: 500 });
    } else {
      return NextResponse.json({ error: 'Failed to fetch character data', details: 'An unknown error occurred' }, { status: 500 });
    }
  }
}