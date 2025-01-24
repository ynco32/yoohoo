import type { Meta, StoryObj } from '@storybook/react';
import { SectionList } from './SectionList';

const sampleSections = [
  { sectionId: 1, arenaId: 'arena1', sectionName: '001', isScraped: false },
  { sectionId: 2, arenaId: 'arena1', sectionName: '002', isScraped: true },
  { sectionId: 3, arenaId: 'arena1', sectionName: '003', isScraped: false },
  { sectionId: 4, arenaId: 'arena1', sectionName: '004', isScraped: false },
  { sectionId: 5, arenaId: 'arena1', sectionName: '005', isScraped: true },
  { sectionId: 6, arenaId: 'arena1', sectionName: '111', isScraped: false },
  { sectionId: 7, arenaId: 'arena1', sectionName: '110', isScraped: true },
  { sectionId: 8, arenaId: 'arena1', sectionName: '109', isScraped: false },
  { sectionId: 9, arenaId: 'arena1', sectionName: '108', isScraped: false },
  { sectionId: 10, arenaId: 'arena1', sectionName: '107', isScraped: true },
  { sectionId: 11, arenaId: 'arena1', sectionName: '106', isScraped: false },
  { sectionId: 12, arenaId: 'arena1', sectionName: '105', isScraped: false },
  { sectionId: 13, arenaId: 'arena1', sectionName: '235', isScraped: true },
  { sectionId: 14, arenaId: 'arena1', sectionName: '234', isScraped: false },
  { sectionId: 15, arenaId: 'arena1', sectionName: '233', isScraped: false },
  { sectionId: 16, arenaId: 'arena1', sectionName: '232', isScraped: true },
  { sectionId: 17, arenaId: 'arena1', sectionName: '231', isScraped: false },
];

const meta: Meta<typeof SectionList> = {
  title: 'Components/SectionList',
  component: SectionList,
  parameters: {
    layout: 'fullscreen',
  },
};

export default meta;
type Story = StoryObj<typeof SectionList>;

export const Default: Story = {
  args: {
    sections: sampleSections,
    onSectionClick: (id) => console.log('Clicked:', id),
  },
};

export const WithoutClickHandler: Story = {
  args: {
    sections: sampleSections,
  },
};
