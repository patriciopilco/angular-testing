import { Category } from './category.model';
import { faker } from '@faker-js/faker';

export const generateFakeCategory = (data?: Partial<Category>): Category => ({
  id: faker.number.int(),
  name: faker.commerce.department(),
  image: faker.image.url(),
  slug: faker.lorem.slug(),
  ...data,
});
