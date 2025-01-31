// components/features/sharing/SharingDetailHeader.tsx
import Image from 'next/image';
import { BookmarkIcon } from '@heroicons/react/24/outline';
import { SharingStatus } from '@/types/sharing';

interface SharingDetailHeaderProps {
 title: string;
 nickname: string;
 status: SharingStatus;
 profileImage?: string;
}

export const SharingDetailHeader = ({
 title,
 nickname,
 status,
 profileImage = '/images/profile.png',
}: SharingDetailHeaderProps) => {

 const getStatusText = (status: SharingStatus) => {
   switch (status) {
     case 'ONGOING':
       return '진행중';
     case 'UPCOMING':
       return '준비중';
     case 'CLOSED':
       return '마감';
     default:
       return '';
   }
 };

 const getStatusColor = (status: SharingStatus) => {
   switch (status) {
     case 'ONGOING':
       return 'bg-status-success';
     case 'UPCOMING':
       return 'bg-status-caution';
     case 'CLOSED':
       return 'bg-gray-400';
     default:
       return 'bg-gray-400';
   }
 };

 return (
   <div className="flex items-center justify-between p-4">
     <div className="flex items-center gap-2">
       <Image
         src={profileImage}
         alt="프로필"
         width={40}
         height={40}
         className="rounded-full"
       />
       <div>
         <h1 className="font-medium">{title}</h1>
         <p className="text-sm text-gray-600">{nickname}</p>
       </div>
     </div>
     <div className="flex items-center gap-2">
       <span className={`rounded-md px-2 py-1 text-xs text-white ${getStatusColor(status)}`}>
         {getStatusText(status)}
       </span>
       <BookmarkIcon className="h-6 w-6 text-gray-400" />
     </div>
   </div>
 );
};