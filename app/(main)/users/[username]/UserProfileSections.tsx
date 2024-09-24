"use client";

import React, { useState } from 'react';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, DragOverlay } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, rectSortingStrategy, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripHorizontal, Plus } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import SectionAddDialog from './SectionAddDialog';
import { useQueryClient } from '@tanstack/react-query';
import { useQuery } from '@tanstack/react-query';
import { Loader2 } from 'lucide-react';
import UserProfileSection from './UserProfileSection';
import { SectionType } from '@/lib/sections';
import { $Enums } from '@prisma/client';
import ky from '@/lib/ky';
import { updateSectionOrder } from './sections/actions';
import { toast } from '@/components/ui/use-toast';
import { UserData } from '@/lib/types';

type ProfileSection = {
  id: string;
  title: string;
  type: $Enums.SectionType;
  content: any;
  order: number;
};

const fetchProfileSections = async (userId: string): Promise<ProfileSection[]> => {
  try {
    return await ky.get(`/api/users/${userId}/sections`).json<ProfileSection[]>();
  } catch (error) {
    console.error('Error fetching profile sections:', error);
    throw new Error('Failed to fetch profile sections');
  }
};

const mapSectionType = (prismaSectionType: $Enums.SectionType): SectionType => {
  switch (prismaSectionType) {
    case $Enums.SectionType.USER_LEAGUE_FAV_CHAMPIONS:
      return SectionType.USER_LEAGUE_FAV_CHAMPIONS;
    case $Enums.SectionType.USER_GENSHIN_FAV_CHARACTER:
      return SectionType.USER_GENSHIN_FAV_CHARACTER;
    // Add other mappings as needed
    default:
      throw new Error('Unknown section type');
  }
};

const SortableSection = ({ user, section, isEditMode }: { user: UserData; section: ProfileSection; isEditMode: boolean }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: section.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`relative bg-card rounded-lg overflow-visible transition-all duration-300 ease-in-out border border-gray-700 ${
        isDragging ? 'z-10 shadow-lg opacity-50' : ''
      }`}
    >
      {isEditMode && (
        <div
          {...attributes}
          {...listeners}
          className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-gray-700 p-1.5 rounded-full cursor-move z-10"
        >
          <GripHorizontal size={20} />
        </div>
      )}
      <UserProfileSection
        user={user}
        type={mapSectionType(section.type)}
        data={{
          title: section.title,
          content: section.content,
        }}
      />
    </div>
  );
};

const UserProfileSections: React.FC<{ user: UserData; userId: string; isOwner: boolean }> = ({ user, userId, isOwner }) => {
  const queryClient = useQueryClient();
  const [isEditMode, setIsEditMode] = useState(false);
  const [isSectionAddDialogOpen, setIsSectionAddDialogOpen] = useState(false);
  const [activeId, setActiveId] = useState<string | null>(null);

  const { data: sections, isLoading, isError, error } = useQuery<ProfileSection[], Error>({
    queryKey: ['profileSections', userId],
    queryFn: () => fetchProfileSections(userId),
  });

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragStart = (event: any) => {
    setActiveId(event.active.id);
  };

  const handleDragEnd = (event: any) => {
    const { active, over } = event;

    if (active.id !== over?.id && sections) {
      const oldIndex = sections.findIndex((section) => section.id === active.id);
      const newIndex = sections.findIndex((section) => section.id === over.id);

      if (newIndex !== -1) {
        const newSections = arrayMove(sections, oldIndex, newIndex);
        
        // Optimistically update the UI
        queryClient.setQueryData(['profileSections', userId], newSections);

        // Then update the server
        updateSectionOrder(userId, newSections.map(section => section.id))
          .catch(() => {
            // If the update fails, revert to the original order
            queryClient.setQueryData(['profileSections', userId], sections);
            toast({
              title: "Error",
              description: "Failed to update section order",
              variant: "destructive",
            });
          });
      }
    }

    setActiveId(null);
  };

  const handleAddSection = (newSection: ProfileSection) => {
    // Add the new section to your sections state
    if (sections) {
      // Update the local cache
      queryClient.setQueryData(['profileSections', userId], [...sections, newSection]);
    }
    setIsSectionAddDialogOpen(false);
  };

  if (isLoading) return <Loader2 className="mx-auto my-3 animate-spin" />;
  if (isError) return <p className="text-center text-red-500">Error: {error.message}</p>;

  return (
    <div className="user-profile-sections p-4">
      {isOwner && (
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center space-x-2">
            <Switch
              checked={isEditMode}
              onCheckedChange={setIsEditMode}
              id="edit-mode"
            />
            <label htmlFor="edit-mode" className="text-gray-300">Edit Mode</label>
          </div>
          {isEditMode && (
            <Button
              onClick={() => setIsSectionAddDialogOpen(true)}
              variant="outline"
              size="sm"
              className="bg-gray-800 text-gray-300 hover:bg-gray-700"
            >
              <Plus className="mr-2 h-4 w-4" /> New Section
            </Button>
          )}
        </div>
      )}

      {sections && sections.length > 0 && (
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragStart={handleDragStart}
          onDragEnd={handleDragEnd}
        >
          <SortableContext 
            items={sections.map(s => s.id)}
            strategy={rectSortingStrategy}
          >
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {sections.map((section) => (
                <SortableSection key={section.id} user={user} section={section} isEditMode={isEditMode} />
              ))}
            </div>
          </SortableContext>
          <DragOverlay>
            {activeId ? (
              <SortableSection 
                section={sections.find(s => s.id === activeId)!} 
                isEditMode={isEditMode} 
                user={user}
              />
            ) : null}
          </DragOverlay>
        </DndContext>
      )}

      <SectionAddDialog
        userId={userId}
        onAddSection={handleAddSection}
        open={isSectionAddDialogOpen}
        onOpenChange={setIsSectionAddDialogOpen}
        currentSectionsCount={sections?.length ?? 0}
      />
    </div>
  );
};

export default UserProfileSections;
