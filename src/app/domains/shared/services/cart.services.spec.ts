import { createServiceFactory, SpectatorService } from '@ngneat/spectator/jest';
import { CartService } from './cart.service';
import { Product } from '@shared/models/product.model';
import { generateFakeProduct } from '@shared/models/product.mock';

describe('CartService', () => {
  let spectator: SpectatorService<CartService>;
  const createService = createServiceFactory(CartService);

  // Mock product para reutilizar en las pruebas
  const mockProduct: Product = {
    id: 1,
    title: 'Test Product',
    price: 10,
    description: 'Test Description',
    images: ['image1', 'image2'],
    category: {
      id: 1,
      name: 'Category1',
      image: 'image1',
      slug: 'category-1'
    },
    creationAt: new Date().toISOString(),
    slug: 'product-1'
  };

  // Mock de la función de generación de productos
  const mockProduct2 = generateFakeProduct();

  beforeEach(() => {
    spectator = createService();
  });

  it('should be created', () => {
    expect(spectator.service).toBeDefined();
  });

  describe('Initial state', () => {
    it('should start with an empty cart', () => {
      expect(spectator.service.cart()).toEqual([]);
    });

    it('should start with total 0', () => {
      expect(spectator.service.total()).toBe(0);
    });
  });

  describe('addToCart', () => {
    it('should add an item to the cart', () => {
      spectator.service.addToCart(mockProduct);
      expect(spectator.service.cart()).toEqual([mockProduct]);
      expect(spectator.service.total()).toBe(10);
    });

    it('should add multiple items to the cart', () => {
      spectator.service.addToCart(mockProduct);
      spectator.service.addToCart(mockProduct);
      expect(spectator.service.cart()).toHaveLength(2);
      expect(spectator.service.total()).toBe(20);
    });

    it('should maintain product order in cart', () => {
      const product2 = { ...mockProduct, id: 2, price: 20 };
      const product3 = { ...mockProduct, id: 3, price: 30 };
      
      spectator.service.addToCart(mockProduct);
      spectator.service.addToCart(product2);
      spectator.service.addToCart(product3);

      const cart = spectator.service.cart();
      expect(cart[0]).toEqual(mockProduct);
      expect(cart[1]).toEqual(product2);
      expect(cart[2]).toEqual(product3);
      expect(spectator.service.total()).toBe(60);
    });
  });

  describe('Edge cases', () => {
    it('should handle product with zero price', () => {
      //const zeroProduct = { ...mockProduct, price: 0 };
      const zeroProduct = generateFakeProduct({ price: 0 });
      spectator.service.addToCart(zeroProduct);
      expect(spectator.service.total()).toBe(0);
    });

    it('should handle product with decimal price', () => {
      const decimalProduct = { ...mockProduct, price: 10.99 };
      spectator.service.addToCart(decimalProduct);
      expect(spectator.service.total()).toBe(10.99);
    });

    it('should handle product with negative price', () => {
      const negativeProduct = { ...mockProduct, price: -10 };
      spectator.service.addToCart(negativeProduct);
      expect(spectator.service.total()).toBe(-10);
    });

    it('should handle adding large number of products', () => {
      const products = Array(100).fill(mockProduct);
      products.forEach(product => spectator.service.addToCart(product));
      expect(spectator.service.cart()).toHaveLength(100);
      expect(spectator.service.total()).toBe(1000);
    });
  });
});