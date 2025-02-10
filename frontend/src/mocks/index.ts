import { sightHandlers } from './handler/sight.handler';
import { sightReviewHandlers } from './handler/sightReview.handler';
import { concertHandlers } from './handler/concert.handler';
import { sharingHandlers } from './handler/sharing.handler';
import { concertSightHandlers } from './handler/concertSight.handler';
import { userHandlers } from './handler/user.handler';

export const handlers = [
  ...sightHandlers,
  ...concertHandlers,
  ...sharingHandlers,
  ...sightReviewHandlers,
  ...concertSightHandlers,
  ...userHandlers,
];
