import { ProductImage } from './ProductImage';
import { Product } from './Product';
import { User } from './User';

// We are using Typescript, and we want our types experience to be as strict as it can be.
// By providing the Keystone generated `Lists` type to our lists object, we refine
// our types to a stricter subset that is type-aware of other lists in our schema
// that Typescript cannot easily infer.
// import { Lists } from '.keystone/types';

export const lists = {
  User,
  Product,
  ProductImage,
};
