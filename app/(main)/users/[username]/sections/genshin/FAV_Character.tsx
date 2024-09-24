'use client';

import { useState, useEffect } from 'react';

interface FAV_CharacterProps {
  genshinUid: string;
  character: string; // This will contain the selected character's ID or name
}

export default function UserGenshinFavCharacter({ genshinUid, character }: FAV_CharacterProps) {
  const [characterData, setCharacterData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCharacterData = async () => {
      if (!genshinUid) {
        setError("Genshin UID not provided");
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`/api/enka/genshin-character?uid=${genshinUid}&character=${character}`);
        if (!response.ok) {
          throw new Error('Failed to fetch character data');
        }
        const data = await response.json();
        setCharacterData(data);
      } catch (err) {
        setError("Failed to fetch character data");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchCharacterData();
  }, [genshinUid, character]);

  if (loading) return <div>Loading character data...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!characterData) return <div>No character data available</div>;

  return (
    <div className="bg-white p-4 rounded-lg shadow">
      <h2 className="text-2xl font-bold mb-4">{characterData.characterData.name.get("en")}</h2>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <p><span className="font-semibold">Level:</span> {characterData.level}</p>
          <p><span className="font-semibold">Constellation:</span> {characterData.constellations.length}</p>
          <p><span className="font-semibold">Weapon:</span> {characterData.weapon.weaponData.name.get("en")} (R{characterData.weapon.refinementRank})</p>
        </div>
        <div>
          <h3 className="font-semibold mb-2">Artifacts:</h3>
          <ul className="list-disc list-inside">
            {characterData.artifacts.map((artifact: any, index: number) => (
              <li key={index}>
                {artifact.artifactData.name.get("en")} - {artifact.setNameData.name.get("en")}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
}