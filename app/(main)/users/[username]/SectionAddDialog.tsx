import React from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from '@/components/ui/select';
import { useCreateSection } from './sections/mutations';
import { ProfileSection } from '@/lib/types';
import { SectionType } from '@/lib/sections';
import { useToast } from '@/components/ui/use-toast';
import { Dialog, DialogContent, DialogFooter, DialogTitle, DialogTrigger } from '@/components/ui/dialog';

// Demo data for Genshin characters
const demoGenshinCharacters = [
    { id: '1', name: 'Diluc', element: 'Pyro' },
    { id: '2', name: 'Keqing', element: 'Electro' },
    { id: '3', name: 'Venti', element: 'Anemo' },
    // Add more characters as needed
  ];
  
  // Demo data for League champions
  const demoLeagueChampions = [
    { id: '1', name: 'Ahri', role: 'Mid' },
    { id: '2', name: 'Darius', role: 'Top' },
    { id: '3', name: 'Thresh', role: 'Support' },
    // Add more champions as needed
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
    currentSectionsCount
}) => {
    const [title, setTitle] = React.useState('');
    const [content, setContent] = React.useState('');
    const [type, setType] = React.useState<SectionType>(SectionType.USER_LEAGUE_FAV_CHAMPIONS);
    const [selectedCharacter, setSelectedCharacter] = React.useState('');
    const [selectedChampion, setSelectedChampion] = React.useState('');
    const { mutate: createSection, isPending } = useCreateSection();
    const { toast } = useToast();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const newOrder = currentSectionsCount + 1;
        let sectionContent = content;

        if (type === SectionType.USER_GENSHIN_FAV_CHARACTERS) {
            sectionContent = selectedCharacter;
        } else if (type === SectionType.USER_LEAGUE_FAV_CHAMPIONS) {
            sectionContent = selectedChampion;
        }

        createSection(
            { title, content: sectionContent, type, order: newOrder, userId },
            {
                onSuccess: (newSection) => {
                    onAddSection(newSection);
                    resetForm();
                    onOpenChange(false);
                    toast({ title: 'Success', description: 'Section added successfully' });
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
        setTitle('');
        setContent('');
        setType(SectionType.USER_LEAGUE_FAV_CHAMPIONS);
        setSelectedCharacter('');
        setSelectedChampion('');
    };

    const renderContentInput = () => {
        switch (type) {
            case SectionType.CUSTOM:
                return (
                    <Input
                        placeholder="Enter text content"
                        value={content}
                        onChange={(e) => setContent(e.target.value)}
                        required
                    />
                );
            case SectionType.USER_GENSHIN_FAV_CHARACTERS:
                return (
                    <Select value={selectedCharacter} onValueChange={setSelectedCharacter}>
                        <SelectTrigger>
                            <SelectValue placeholder="Select Genshin Character" />
                        </SelectTrigger>
                        <SelectContent>
                            {demoGenshinCharacters.map((char) => (
                                <SelectItem key={char.id} value={char.id}>
                                    {char.name} ({char.element})
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                );
            case SectionType.USER_LEAGUE_FAV_CHAMPIONS:
                return (
                    <Select value={selectedChampion} onValueChange={setSelectedChampion}>
                        <SelectTrigger>
                            <SelectValue placeholder="Select League Champion" />
                        </SelectTrigger>
                        <SelectContent>
                            {demoLeagueChampions.map((champ) => (
                                <SelectItem key={champ.id} value={champ.id}>
                                    {champ.name} ({champ.role})
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                );
            default:
                return null;
        }
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogTitle>Add New Section</DialogTitle>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <Input
                        placeholder="Section Title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        required
                    />
                    <Select value={type} onValueChange={(value) => setType(value as SectionType)}>
                        <SelectTrigger>
                            <SelectValue placeholder="Select Section Type" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value={SectionType.CUSTOM}>Text</SelectItem>
                            <SelectItem value={SectionType.USER_GENSHIN_FAV_CHARACTER}>Favorite Genshin Character</SelectItem>
                            <SelectItem value={SectionType.USER_LEAGUE_FAV_CHAMPIONS}>Favorite League Champion</SelectItem>
                        </SelectContent>
                    </Select>
                    {renderContentInput()}
                    <DialogFooter>
                        <Button type="button" onClick={resetForm} variant="secondary">Cancel</Button>
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
