// section.d.ts

/**
 * Enum for section types (this should match the enum in your Prisma schema) and section props
 */

// Base interface for all section types
export interface BaseSectionProps {
  title: string;
  content?: string;
}

// Props for sections with champions
export interface ChampionsSectionProps extends BaseSectionProps {
  champions: string[];
  content?: never; // Ensure content is not present
}

// Props for sections with content
export interface ContentSectionProps extends BaseSectionProps {
  content: string[];
  champions?: never; // Ensure champions is not present
}

// Union type for all section props
export type SectionProps = ChampionsSectionProps | ContentSectionProps;
