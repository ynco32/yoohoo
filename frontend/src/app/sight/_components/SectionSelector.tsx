// app/arena/components/SectionsSelector.tsx
import { use } from 'react';
import SmallDropdown from '@/components/common/Dropdown/SmallDropdown';
// import { fetchSections } from '../api';

export default function SectionsSelector() {
  //   const sections = use(fetchSections());

  // TODO: api로 연결
  const sections = [
    { label: '1층', value: '1F' },
    { label: '2층', value: '2F' },
    { label: '3층', value: '3F' },
    { label: '4층', value: '4F' },
  ];

  return <SmallDropdown options={sections} placeholder='구역' />;
}
