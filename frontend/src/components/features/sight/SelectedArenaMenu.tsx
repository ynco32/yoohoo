'use client';

interface SelectedArenaMenuProps {
  arenaId: number;
}

export const SelectedArenaMenu = ({ arenaId }: SelectedArenaMenuProps) => {
  const getMenuByArenaId = (arenaId: number) => {
    switch (arenaId) {
      case 1: // 올림픽체조경기장
        return [
          { id: 1, name: '1층 A구역' },
          { id: 2, name: '1층 B구역' },
          { id: 3, name: '2층 지정석' },
        ];
      case 2: // 고척스카이돔
        return [
          { id: 1, name: '내야 지정석' },
          { id: 2, name: '외야 자유석' },
        ];
      default:
        return [];
    }
  };

  const menuItems = getMenuByArenaId(arenaId);

  return (
    <div className="mt-4 px-4">
      <h2>Arena {arenaId} Menu</h2>
      <ul className="space-y-2">
        {menuItems.map((item) => (
          <li key={item.id} className="rounded border p-2">
            {item.name}
          </li>
        ))}
      </ul>
    </div>
  );
};
