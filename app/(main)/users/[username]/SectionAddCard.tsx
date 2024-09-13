import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { SectionType } from '@/lib/sections';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from '@/components/ui/select';
import { useCreateSection } from './sections/mutations';
import { ProfileSection } from '@/lib/types';
import { useToast } from '@/components/ui/use-toast';

interface SectionAddCardProps {
    onAddSection: (section: ProfileSection) => void;
    userId: string;
}

const SectionAddCard: React.FC<SectionAddCardProps> = ({ onAddSection, userId }) => {
    const [isExpanded, setIsExpanded] = useState(false);
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [type, setType] = useState<SectionType>(SectionType.USER_LEAGUE_FAV_CHAMPIONS);
    const [order, setOrder] = useState(0);
    const { mutate: createSection, isPending } = useCreateSection();
    const { toast } = useToast();

    const handleToggle = () => setIsExpanded((prev) => !prev);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        createSection(
            { title, content, type, order, userId },
            {
                onSuccess: (newSection) => {
                    onAddSection(newSection);
                    resetForm();
                    setIsExpanded(false); // Collapse the card
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
        setOrder(0);
    };

    return (
        <div className="relative">
            <AnimatePresence>
                {isExpanded && (
                    <motion.div
                        className="border rounded-lg shadow-lg p-4 mb-4 bg-card"
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.75, ease: 'easeInOut' }}
                    >
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
                            {/* Submit Button */}
                            <div className="flex justify-end space-x-2">
                                <Button type="button" onClick={handleToggle} variant="secondary">Close</Button>
                                <Button type="submit" variant="default" disabled={isPending}>
                                    {isPending ? 'Adding...' : 'Add Section'}
                                </Button>
                            </div>
                        </form>
                    </motion.div>
                )}
            </AnimatePresence>
            {!isExpanded && (
                <div
                    className="flex items-center justify-center h-24 cursor-pointer bg-card border rounded-lg shadow-lg p-4 mb-4"
                    onClick={handleToggle}
                >
                    <span className="text-gray-700 text-lg">+ Add New Section</span>
                </div>
            )}
        </div>
    );
};

export default SectionAddCard;
