import { sightHandlers } from './handler/sight.handler';
import { concertHandlers } from './handler/concert.handler';
import { sharingHandlers } from './handler/sharing.handler';

export const handlers = [
  ...sightHandlers,
  ...concertHandlers,
  ...sharingHandlers,
];
