import { Handler, PostAuthenticationTriggerEvent } from 'aws-lambda';

import { UserEntity } from '../entities/user';

export const main: Handler<PostAuthenticationTriggerEvent> = async (
  event: PostAuthenticationTriggerEvent,
) => {
  console.log(event);
  const { sub } = event.request.userAttributes;
  await UserEntity.update({ userId: sub })
    .set({ lastSignedInAt: new Date().toISOString() })
    .go();

  return event;
};
