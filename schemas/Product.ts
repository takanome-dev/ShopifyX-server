import {
  integer,
  text,
  relationship,
  select,
  timestamp,
} from '@keystone-6/core/fields';
import { list } from '@keystone-6/core';
export const Product = list({
  // access
  fields: {
    name: text({ validation: { isRequired: true } }),
    description: text({
      validation: { isRequired: true },
      ui: {
        displayMode: 'textarea',
      },
    }),
    price: integer({ validation: { min: 1 } }),
    stock: integer(),
    // createdBy: relationship({
    //   ref: 'User.id',
    //   many: true,
    // }),
    createdAt: timestamp({
      defaultValue: {
        kind: 'now',
      },
    }),
    updatedAt: timestamp(),
    status: select({
      options: [
        { label: 'Available', value: 'AVAILABLE' },
        { label: 'Unavailable', value: 'UNAVAILABLE' },
        { label: 'Draft', value: 'DRAFT' },
      ],
      defaultValue: 'DRAFT',
      ui: {
        displayMode: 'segmented-control',
        createView: { fieldMode: 'hidden' },
      },
    }),
    photo: relationship({
      ref: 'ProductImage.product',
      // many: true,
      ui: {
        displayMode: 'cards',
        cardFields: ['image', 'altText'],
        inlineCreate: {
          fields: ['image', 'altText'],
        },
        inlineEdit: { fields: ['image', 'altText'] },
      },
    }),
  },
});
