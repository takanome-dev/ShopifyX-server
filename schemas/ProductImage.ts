import { text, relationship } from '@keystone-6/core/fields';
import { cloudinaryImage } from '@keystone-6/cloudinary';
import { list } from '@keystone-6/core';

export const ProductImage = list({
  fields: {
    image: cloudinaryImage({
      cloudinary: {
        apiKey: process.env.CLOUDINARY_API_KEY as string,
        apiSecret: process.env.CLOUDINARY_API_SECRET as string,
        cloudName: process.env.CLOUDINARY_CLOUD_NAME as string,
        folder: 'takanome_sickfits',
      },
      label: 'Source',
    }),
    altText: text(),
    product: relationship({
      ref: 'Product.photo',
      many: false,
    }),
  },
  ui: {
    listView: {
      initialColumns: ['altText', 'image', 'product'],
    },
  },
});
