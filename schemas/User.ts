import { list } from '@keystone-6/core';
import { password, text } from '@keystone-6/core/fields';

export const User = list({
  fields: {
    username: text({ validation: { isRequired: true } }),
    email: text({ validation: { isRequired: true }, isIndexed: 'unique' }),
    password: password({ validation: { isRequired: true } }),
  },
  ui: {
    listView: {
      initialColumns: ['id', 'username', 'email'],
    },
  },
});
