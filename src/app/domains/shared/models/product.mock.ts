import { generateFakeCategory } from './category.mock';
import { Product } from './product.model';
import { faker } from '@faker-js/faker';

export const generateFakeProduct = (data?: Partial<Product>): Product => ({
  id: faker.number.int(),
  title: faker.commerce.productName(),
  price: parseFloat(faker.commerce.price()),
  description: faker.commerce.productDescription(),
  images: [faker.image.url(), faker.image.url()],
  category: generateFakeCategory(data?.category),
  creationAt: faker.date.past().toISOString(),
  slug: faker.lorem.slug(),
  ...data,
});
