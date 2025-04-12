import { Product } from './product.model';
import { faker } from '@faker-js/faker';

export const generateFakeProduct = (data?: Partial<Product>): Product => ({
  id: faker.number.int(),
  title: faker.commerce.productName(),
  price: parseFloat(faker.commerce.price()),
  description: faker.commerce.productDescription(),
  images: [faker.image.url(), faker.image.url()],
    category: {
        id: faker.number.int(),
        name: faker.commerce.department(),
        image: faker.image.url(),
        slug: faker.lorem.slug()
    },
    creationAt: new Date().toISOString(),
    slug: faker.lorem.slug(),
    ...data,
});
