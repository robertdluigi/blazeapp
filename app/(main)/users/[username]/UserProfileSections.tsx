"use client";

import React from 'react';
import { useQuery, UseQueryResult, useQueryClient, QueryFilters } from '@tanstack/react-query';
import ky from '@/lib/ky'; // Ensure ky is properly configured
import { Loader2 } from 'lucide-react'; // Or another spinner component
import { SectionType } from '@/lib/sections';
import { $Enums } from '@prisma/client';
import UserProfileSection from './UserProfileSection';
import SectionAddCard from './SectionAddCard';
import { Switch } from '@/components/ui/switch';
import SectionAddDialog from './SectionAddDialog';

// Define type for profile sections
type ProfileSection = {
  id: string;
  createdAt: Date;
  title: string;
  type: SectionType;
  content: any; // Use 'any' for JSON content; adjust as needed
  order: number;
  updatedAt: Date;
};

// Fetch function
const fetchProfileSections = async (userId: string): Promise<ProfileSection[]> => {
  try {
    const response = await ky.get(`/api/users/${userId}/sections`).json<ProfileSection[]>();
    return response;
  } catch (err) {
    console.error('Error fetching profile sections:', err);
    throw new Error('Failed to fetch profile sections');
  }
};

// Map Prisma enum to custom enum
const mapSectionType = (prismaSectionType: $Enums.SectionType): SectionType => {
  switch (prismaSectionType) {
    case $Enums.SectionType.USER_LEAGUE_FAV_CHAMPIONS:
      return SectionType.USER_LEAGUE_FAV_CHAMPIONS;
    // Add other mappings here...
    default:
      throw new Error('Unknown section type');
  }
};

// UserProfileSections component
const UserProfileSections: React.FC<{ userId: string; isOwner: boolean }> = ({ userId, isOwner }) => {
  const queryClient = useQueryClient(); // Initialize useQueryClient
  const { data, isFetching, isError, error }: UseQueryResult<ProfileSection[], Error> = useQuery({
    queryKey: ['profileSections', userId],
    queryFn: () => fetchProfileSections(userId),
    staleTime: 1000 * 60 * 5, // Cache for 5 minutes
  });

  const [isEditMode, setIsEditMode] = React.useState(false);

  const handleSwitchChange = (checked: boolean) => {
    setIsEditMode(checked);
  };

  const handleAddSection = (section: ProfileSection) => {

    const queryFilter: QueryFilters = {
      queryKey: ['profileSections', userId],
      // Optionally, add other filter criteria here if needed
    };
    // Cancel ongoing queries and invalidate specific query to refetch
    queryClient.cancelQueries(queryFilter);
    queryClient.invalidateQueries(queryFilter);
  };

  if (isFetching) {
    return <Loader2 className="mx-auto my-3 animate-spin" />;
  }

  if (isError) {
    console.error('Error fetching profile sections:', error);
    return <p className="text-center text-destructive">Error: {error.message}</p>;
  }

  if (!data || data.length === 0) {
    return <p className="text-center">No profile sections available</p>;
  }

  return (
    <div className="user-profile-sections p-4">
      {isOwner && (
        <div className="flex items-center mb-4">
          <Switch
            checked={isEditMode}
            onCheckedChange={handleSwitchChange}
            className="mr-4"
          />
          <span className="text-gray-700">{isEditMode ? 'Edit Mode' : 'View Mode'}</span>
        </div>
      )}

      {isOwner && isEditMode && (
        <SectionAddDialog userId={userId} onAddSection={handleAddSection} />
      )}

      <div className="space-y-4">
        {data.map((section) => (
          <UserProfileSection
            key={section.id}
            type={mapSectionType(section.type)}
            data={{
              title: section.title,
              content: section.content, // Use content directly
            }}
          />
        ))}
      </div>
    </div>
  );
};

export default UserProfileSections;
