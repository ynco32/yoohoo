import { sightHandlers } from './handler/sight.handler';
import { concertHandlers } from './handler/concert.handler';

export const handlers = [...sightHandlers, ...concertHandlers];
