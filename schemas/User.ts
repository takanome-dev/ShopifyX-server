import { list } from '@keystone-6/core';
import { password, text, relationship } from '@keystone-6/core/fields';

export const User = list({
  fields: {
    username: text({ validation: { isRequired: true } }),
    email: text({ validation: { isRequired: true }, isIndexed: 'unique' }),
    password: password({ validation: { isRequired: true } }),
    cart: relationship({
      ref: 'CartItem.user',
      many: true,
      ui: {
        listView: { fieldMode: 'hidden' },
        itemView: { fieldMode: 'read' },
      },
    }),
  },
  ui: {
    listView: {
      initialColumns: ['id', 'username', 'email', 'cart'],
    },
  },
});
