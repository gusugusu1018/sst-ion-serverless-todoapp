import { Handler, PostConfirmationTriggerEvent } from 'aws-lambda';

import { UserEntity, UserEntityType } from '../entities/user';

export const main: Handler<PostConfirmationTriggerEvent> = async (
  event: PostConfirmationTriggerEvent,
) => {
  const { email, sub } = event.request.userAttributes;

  const newUser: UserEntityType = {
    userId: sub,
    email: email,
    name: email,
    createdAt: new Date().toISOString(),
  };
  await UserEntity.create(newUser).go();

  return event;
};
