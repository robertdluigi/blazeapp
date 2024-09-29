import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useCreateSection } from './sections/mutations';
import { ProfileSection } from '@/lib/types';
import { SectionType } from '@/lib/sections';
import { useToast } from '@/components/ui/use-toast';
import { Dialog, DialogContent, DialogFooter, DialogTitle } from '@/components/ui/dialog';
import championData from '@/lib/riot/champion-summary.json'; 
import axios from 'axios'; 

const sectionTypes = [
  { type: SectionType.USER_LEAGUE_FAV_CHAMPIONS, label: 'Favorite League Champion' },
  { type: SectionType.USER_STEAM_FAV_GAMES, label: 'Favorite Game' },
  { type: SectionType.USER_LEAGUE_RANK, label: 'League Rank' },
];

interface SectionAddDialogProps {
  userId: string;
  onAddSection: (section: ProfileSection) => void;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  currentSectionsCount: number;
}

const SectionAddDialog: React.FC<SectionAddDialogProps> = ({
  userId,
  onAddSection,
  open,
  onOpenChange,
  currentSectionsCount,
}) => {
  const [championName, setChampionName] = useState('');
  const [steamGameName, setSteamGameName] = useState('');
  const [steamGames, setSteamGames] = useState<any[]>([]);
  const [selectedSteamGames, setSelectedSteamGames] = useState<number[]>([]);
  const [leagueRank, setLeagueRank] = useState('');
  const [sectionType, setSectionType] = useState(sectionTypes[0].type);
  const { mutate: createSection, isPending } = useCreateSection();
  const { toast } = useToast();

  const fetchSteamGames = async () => {
    try {
      const response = await axios.get(`/api/users/${userId}/games/steam`);
      setSteamGames(response.data.games);
    } catch (error) {
      console.error('Error fetching Steam games:', error);
      toast({ variant: 'destructive', title: 'Error', description: 'Failed to fetch Steam games.' });
    }
  };

  useEffect(() => {
    if (open && sectionType === SectionType.USER_STEAM_FAV_GAMES) {
      fetchSteamGames();
    }
  }, [open, sectionType]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newOrder = currentSectionsCount + 1;

    let sectionContent = {};
    let title = '';

    if (sectionType === SectionType.USER_LEAGUE_FAV_CHAMPIONS) {
      const selectedChampionData = championData.find(
        (champ) => champ.name.toLowerCase() === championName.toLowerCase()
      );

      if (!selectedChampionData) {
        toast({ variant: 'destructive', title: 'Error', description: 'Champion not found.' });
        return;
      }

      sectionContent = {
        champions: [{ name: selectedChampionData.name, championId: selectedChampionData.id }],
      };
      title = `Favorite League Champion: ${selectedChampionData.name}`;
    } else if (sectionType === SectionType.USER_STEAM_FAV_GAMES) {
      if (selectedSteamGames.length === 0) {
        toast({ variant: 'destructive', title: 'Error', description: 'Please select at least one Steam game.' });
        return;
      }
      sectionContent = { steamGames: selectedSteamGames };
      title = `Favorite Games`;
    } else if (sectionType === SectionType.USER_LEAGUE_RANK) {
      sectionContent = { rank: leagueRank };
      title = `League Rank: ${leagueRank}`;
    }

    createSection(
      { title, content: sectionContent, type: sectionType, order: newOrder, userId },
      {
        onSuccess: (newSection) => {
          onAddSection(newSection);
          resetForm();
          onOpenChange(false);
          toast({ title: 'Success', description: `${sectionTypes.find(t => t.type === sectionType)?.label} section added successfully` });
        },
        onError: (error) => {
          toast({
            variant: 'destructive',
            title: 'Error',
            description: `Failed to create section: ${error.message}`,
          });
        },
      }
    );
  };

  const resetForm = () => {
    setChampionName('');
    setSteamGameName('');
    setSelectedSteamGames([]);
    setLeagueRank('');
    setSectionType(sectionTypes[0].type);
  };

  const renderSectionSpecificFields = () => {
    if (sectionType === SectionType.USER_LEAGUE_FAV_CHAMPIONS) {
      return (
        <Input
          placeholder="Type Champion Name"
          value={championName}
          onChange={(e) => setChampionName(e.target.value)}
        />
      );
    } else if (sectionType === SectionType.USER_STEAM_FAV_GAMES) {
      return (
        <div className="relative">
          <Input
            placeholder="Search Favorite Steam Game"
            value={steamGameName}
            onChange={(e) => setSteamGameName(e.target.value)}
          />
          {/* Only show the game list if the user types something */}
          {steamGameName && (
            <ul className="absolute z-10 max-h-60 overflow-y-auto border border-gray-300 mt-1 bg-black w-full">
              {steamGames
                .filter(game => game.name.toLowerCase().includes(steamGameName.toLowerCase()))
                .map(game => (
                  <li
                    key={game.appid}
                    className="p-2 cursor-pointer hover:bg-gray-200 hover:bg-opacity-30"
                    onClick={() => {
                      if (!selectedSteamGames.includes(game.appid)) {
                        setSelectedSteamGames((prev) => [...prev, game.appid]);
                        setSteamGameName(''); // Clear input after selection
                      }
                    }}
                  >
                    {game.name}
                  </li>
                ))}
            </ul>
          )}
          <div className="mt-2 flex flex-wrap">
            {selectedSteamGames.map(appId => {
              const game = steamGames.find(g => g.appid === appId);
              return (
                <span key={appId} className="inline-flex items-center bg-gray-500 text-white text-sm font-medium mr-2 mb-2 px-2.5 py-2 rounded-full">
                  {game?.name}
                  <button 
                    className="ml-2 text-gray-300 hover:text-orange-500"
                    onClick={() => setSelectedSteamGames(prev => prev.filter(id => id !== appId))}
                  >
                    &times; {/* X symbol for removal */}
                  </button>
                </span>
              );
            })}
          </div>
        </div>
      );
    } else if (sectionType === SectionType.USER_LEAGUE_RANK) {
      return (
        <Input
          placeholder="League Rank (e.g., Gold IV)"
          value={leagueRank}
          onChange={(e) => setLeagueRank(e.target.value)}
        />
      );
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogTitle>Add New Section</DialogTitle>
        <form onSubmit={handleSubmit} className="space-y-4">
          <select
            value={sectionType}
            onChange={(e) => setSectionType(e.target.value as SectionType)}
            className="w-full p-2 border rounded"
          >
            {sectionTypes.map((section) => (
              <option key={section.type} value={section.type}>
                {section.label}
              </option>
            ))}
          </select>
          {renderSectionSpecificFields()}
          <DialogFooter>
            <Button
              type="button"
              onClick={() => {
                resetForm();
                onOpenChange(false);
              }}
              variant="secondary"
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending ? 'Adding...' : 'Add Section'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default SectionAddDialog;
