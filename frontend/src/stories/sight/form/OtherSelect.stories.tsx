// OtherSelect.stories.tsx
import type { Meta, StoryObj } from '@storybook/react';
import { OtherSelect } from '@/components/features/sight/form/OtherSelect';
import React from 'react';

const meta: Meta<typeof OtherSelect> = {
  title: 'Features/sight/Form/OtherSelect',
  component: OtherSelect,
  tags: ['autodocs'],
  parameters: {
    layout: 'centered',
  },
};

export default meta;
type Story = StoryObj<typeof OtherSelect>;

export const Default: Story = {
  args: {},
};

export const DefaultValue: Story = {
  args: {
    comfort: '평범해요',
    sightLevel: '좋아요',
  },
};

export const Interactive: Story = {
  render: function Controlled() {
    const [comfort, setComfort] = React.useState<string>('평범해요');
    const [sightLevel, setSightLevel] = React.useState<string>('좋아요');

    return (
      <OtherSelect
        comfort={comfort}
        sightLevel={sightLevel}
        onComfortChange={setComfort}
        onSightLevelChange={setSightLevel}
      />
    );
  },
};
