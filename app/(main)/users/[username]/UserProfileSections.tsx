"use client";

import React, { useState } from 'react';
import { useQuery, useQueryClient } from '@tanstack/react-query';
import { DndContext, closestCenter, KeyboardSensor, PointerSensor, useSensor, useSensors, DragOverlay } from '@dnd-kit/core';
import { arrayMove, SortableContext, sortableKeyboardCoordinates, rectSortingStrategy, useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripHorizontal, Loader2 } from 'lucide-react';
import { Switch } from '@/components/ui/switch';
import UserProfileSection from './UserProfileSection';
import { SectionType } from '@/lib/sections';
import { $Enums } from '@prisma/client';
import ky from '@/lib/ky';

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
    // Add other mappings as needed
    default:
      throw new Error('Unknown section type');
  }
};

const SortableSection = ({ section, isEditMode }: { section: ProfileSection; isEditMode: boolean }) => {
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
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={`relative bg-gray-800 rounded-lg p-4 transition-all duration-500 ease-in-out ${isDragging ? 'z-10 shadow-lg' : ''}`}
    >
      {isEditMode && (
        <div
          {...attributes}
          {...listeners}
          className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-gray-700 p-1 rounded cursor-move z-10"
        >
          <GripHorizontal size={24} />
        </div>
      )}
      <UserProfileSection
        type={mapSectionType(section.type)}
        data={{
          title: section.title,
          content: section.content,
        }}
      />
    </div>
  );
};

const UserProfileSections: React.FC<{ userId: string; isOwner: boolean }> = ({ userId, isOwner }) => {
  const queryClient = useQueryClient();
  const [isEditMode, setIsEditMode] = useState(false);
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

    if (active.id !== over.id && sections) {
      const oldIndex = sections.findIndex((section) => section.id === active.id);
      const newIndex = sections.findIndex((section) => section.id === over.id);

      const newSections = arrayMove(sections, oldIndex, newIndex);
      queryClient.setQueryData(['profileSections', userId], newSections);

      // TODO: Implement API call to update order in the backend
      console.log('New order:', newSections.map(section => section.id));
    }

    setActiveId(null);
  };

  if (isLoading) return <Loader2 className="mx-auto my-3 animate-spin" />;
  if (isError) return <p className="text-center text-red-500">Error: {error.message}</p>;
  if (!sections || sections.length === 0) return <p className="text-center">No profile sections available</p>;

  return (
    <div className="user-profile-sections p-4 bg-gray-900">
      {isOwner && (
        <div className="flex items-center mb-4">
          <Switch
            checked={isEditMode}
            onCheckedChange={setIsEditMode}
            className="mr-4"
          />
          <span className="text-gray-400">{isEditMode ? 'Edit Mode' : 'View Mode'}</span>
        </div>
      )}

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
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {sections.map((section) => (
              <SortableSection key={section.id} section={section} isEditMode={isEditMode} />
            ))}
          </div>
        </SortableContext>
        <DragOverlay>
          {activeId ? (
            <SortableSection 
              section={sections.find(s => s.id === activeId)!} 
              isEditMode={isEditMode} 
            />
          ) : null}
        </DragOverlay>
      </DndContext>
    </div>
  );
};

export default UserProfileSections;
