// section.d.ts

/**
 * Enum for section types (this should match the enum in your Prisma schema) and section props
 */

// Base interface for all section types
export interface BaseSectionProps {
  title: string;
  content?: string; // Can still be optional for general sections
}

// Define Champion object
export interface Champion {
  name: string;
  championId: string; // Adjust this if championId is a number
}

// Props for sections with champions
export interface ChampionsSectionProps extends BaseSectionProps {
  champions: Champion[]; // Change to an array of Champion objects
  content?: never; // Ensure content is not present
}

// Props for sections with content
export interface ContentSectionProps extends BaseSectionProps {
  content: string[]; // Assuming this is still correct
  champions?: never; // Ensure champions is not present
}

// Union type for all section props
export type SectionProps = ChampionsSectionProps | ContentSectionProps;
