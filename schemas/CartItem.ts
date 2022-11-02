import { integer, relationship } from '@keystone-6/core/fields';
import { list } from '@keystone-6/core';

export const CartItem = list({
  // access
  fields: {
    product: relationship({
      ref: 'Product',
    }),
    user: relationship({
      ref: 'User.cart',
      many: false,
    }),
    quantity: integer({ validation: { min: 1, isRequired: true } }),
  },
  ui: {
    listView: {
      initialColumns: ['id', 'product', 'quantity', 'user'],
    },
  },
});
