// app/arena/components/StairsSelector.tsx
import { use } from 'react';
import SmallDropdown from '@/components/common/Dropdown/SmallDropdown';
// import { fetchStairs } from '../api';

export default function StairsSelector() {
  //   const stairs = use(fetchStairs());
  // TODO: api로 연결
  const stairs = [
    { label: '1층', value: '1F' },
    { label: '2층', value: '2F' },
    { label: '3층', value: '3F' },
    { label: '4층', value: '4F' },
  ];

  return <SmallDropdown options={stairs} placeholder='층' />;
}
