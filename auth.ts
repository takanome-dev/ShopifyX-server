/*
Welcome to the auth file! Here we have put a config to do basic auth in Keystone.

`createAuth` is an implementation for an email-password login out of the box.
`statelessSessions` is a base implementation of session logic.

For more on auth, check out: https://keystonejs.com/docs/apis/auth#authentication-api
*/

import { createAuth } from '@keystone-6/auth';

// See https://keystonejs.com/docs/apis/session#session-api for the session docs
import { statelessSessions } from '@keystone-6/core/session';
import sendMail from './lib/mail';
import { User } from './types';

let sessionSecret = process.env.SESSION_SECRET;

// Here is a best practice! It's fine to not have provided a session secret in dev,
// however it should always be there in production.
if (!sessionSecret) {
  if (process.env.NODE_ENV === 'production') {
    throw new Error(
      'The SESSION_SECRET environment variable must be set in production'
    );
  } else {
    sessionSecret = '-- DEV COOKIE SECRET; CHANGE ME --';
  }
}

// Here we define how auth relates to our schemas.
// What we are saying here is that we want to use the list `User`, and to log in
// we will need their email and password.
const { withAuth } = createAuth({
  listKey: 'User',
  identityField: 'email',
  sessionData: 'username',
  secretField: 'password',
  initFirstItem: {
    fields: ['username', 'email', 'password'],
    // TODO: add initial roles...
  },
  passwordResetLink: {
    sendToken: async ({ itemId, token, context }) => {
      // console.log({itemId, token, identity,context})
      const user = (await context.prisma.user.findUnique({
        where: { id: itemId },
      })) as User;

      // if (!user.email)
      //   throw new Error(
      //     'The user is not found, please enter a valid email address.'
      //   );

      console.log({ user });

      sendMail(user, token);
    },
  },
});

// This defines how long people will remain logged in for.
// This will get refreshed when they log back in.
let sessionMaxAge = 60 * 60 * 24 * 30; // 30 days

// This defines how sessions should work. For more details, check out: https://keystonejs.com/docs/apis/session#session-api
const session = statelessSessions({
  maxAge: sessionMaxAge,
  secret: sessionSecret!,
});

export { withAuth, session };
