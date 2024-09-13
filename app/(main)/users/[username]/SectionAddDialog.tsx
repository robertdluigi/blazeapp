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
    const { mutate: createSection, isPending } = useCreateSection();
    const { toast } = useToast();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const newOrder = currentSectionsCount + 1;

        createSection(
            { title, content, type, order: newOrder, userId },
            {
                onSuccess: (newSection) => {
                    onAddSection(newSection);
                    resetForm();
                    onOpenChange(false);
                },
                onError: (error) => {
                    toast({
                        variant: 'destructive',
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
    };

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogTitle>Add New Section</DialogTitle>
                <form onSubmit={handleSubmit} className="space-y-4">
                    {/* Title Input */}
                    <div>
                        <label htmlFor="title" className="block text-gray-700 text-sm font-medium">Title</label>
                        <Input
                            id="title"
                            type="text"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            required
                            className="border rounded px-3 py-2 w-full"
                        />
                    </div>
                    {/* Content Input */}
                    <div>
                        <label htmlFor="content" className="block text-gray-700 text-sm font-medium">Content</label>
                        <Textarea
                            id="content"
                            value={content}
                            onChange={(e) => setContent(e.target.value)}
                            rows={4}
                            required
                            className="border rounded px-3 py-2 w-full"
                        />
                    </div>
                    {/* Type Select */}
                    <div>
                        <label htmlFor="type" className="block text-gray-700 text-sm font-medium">Type</label>
                        <Select
                            value={type}
                            onValueChange={(value) => setType(value as SectionType)}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Select Section Type" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value={SectionType.USER_LEAGUE_FAV_CHAMPIONS}>Favorite Champions</SelectItem>
                                {/* Add more section types here */}
                            </SelectContent>
                        </Select>
                    </div>
                    {/* Dialog Actions */}
                    <DialogFooter>
                        <Button type="button" onClick={() => resetForm()} variant="secondary">Cancel</Button>
                        <Button type="submit" variant="default" disabled={isPending}>
                            {isPending ? 'Adding...' : 'Add Section'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default SectionAddDialog;
