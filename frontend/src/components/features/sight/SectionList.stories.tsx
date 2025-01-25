import type { Meta, StoryObj } from '@storybook/react';
import { SectionList } from './SectionList';

const sampleSections = [
  { sectionId: 1, arenaId: 1, sectionName: '001', isScraped: false },
  { sectionId: 2, arenaId: 1, sectionName: '002', isScraped: true },
  { sectionId: 3, arenaId: 1, sectionName: '003', isScraped: false },
  { sectionId: 4, arenaId: 1, sectionName: '004', isScraped: false },
  { sectionId: 5, arenaId: 1, sectionName: '005', isScraped: true },
  { sectionId: 6, arenaId: 1, sectionName: '111', isScraped: false },
  { sectionId: 7, arenaId: 1, sectionName: '110', isScraped: true },
  { sectionId: 8, arenaId: 1, sectionName: '109', isScraped: false },
  { sectionId: 9, arenaId: 1, sectionName: '108', isScraped: true },
  { sectionId: 10, arenaId: 1, sectionName: '107', isScraped: false },
  { sectionId: 11, arenaId: 1, sectionName: '106', isScraped: false },
  { sectionId: 12, arenaId: 1, sectionName: '105', isScraped: true },
  { sectionId: 13, arenaId: 1, sectionName: '235', isScraped: false },
  { sectionId: 14, arenaId: 1, sectionName: '234', isScraped: true },
  { sectionId: 15, arenaId: 1, sectionName: '233', isScraped: false },
  { sectionId: 16, arenaId: 1, sectionName: '232', isScraped: true },
];

const meta = {
  title: 'Components/SectionList',
  component: SectionList,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
} satisfies Meta<typeof SectionList>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Default: Story = {
  args: {
    sections: sampleSections,
    arenaId: 1,
    onSectionClick: (id) => console.log('Clicked:', id),
  },
};

export const NoInteraction: Story = {
  args: {
    sections: sampleSections,
    arenaId: 1,
  },
};
