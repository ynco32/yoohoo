export const scrapSeat = async (
  seatId: number,
  stageType: number
): Promise<void> => {
  const response = await fetch(
    `/api/v1/view/scraps/${seatId}?stageType=${stageType}`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    }
  );

  if (!response.ok) {
    throw new Error('Failed to scrap seat');
  }
};

export const unscrapSeat = async (
  seatId: number,
  stageType: number
): Promise<void> => {
  const response = await fetch(
    `/api/v1/view/scraps/${seatId}?stageType=${stageType}`,
    {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    }
  );

  if (!response.ok) {
    throw new Error('Failed to unscrap seat');
  }
};
