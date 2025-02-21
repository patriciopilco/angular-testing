import {
  createHttpFactory,
  HttpMethod,
  SpectatorHttp,
} from '@ngneat/spectator/jest';
import { ProductService } from './product.service';
import { environment } from '@env/environment';
import { generateFakeProduct } from '../models/product.mock';
import { Product } from '../models/product.model';

describe('ProductService', () => {
  let spectator: SpectatorHttp<ProductService>;
  const createHttp = createHttpFactory(ProductService);

  beforeEach(() => {
    spectator = createHttp();
  });

  describe('getProducts', () => {
    const url = `${environment.apiUrl}/api/v1/products`;

    it('should get all products without params', () => {
      const mockProducts: Product[] = [
        generateFakeProduct(),
        generateFakeProduct(),
      ];

      spectator.service.getProducts().subscribe(products => {
        expect(products).toEqual(mockProducts);
      });

      const req = spectator.expectOne(url, HttpMethod.GET);
      req.flush(mockProducts);
    });

    it('should get products filtered by category_id', () => {
      const categoryId = '1';
      const mockProducts: Product[] = [
        generateFakeProduct(),
        generateFakeProduct(),
      ];

      spectator.service
        .getProducts({ category_id: categoryId })
        .subscribe(products => {
          expect(products).toEqual(mockProducts);
        });

      const req = spectator.expectOne(
        `${url}?categoryId=${categoryId}`,
        HttpMethod.GET
      );
      req.flush(mockProducts);
    });

    it('should get products filtered by category_slug', () => {
      const categorySlug = 'electronics';
      const mockProducts: Product[] = [
        generateFakeProduct(),
        generateFakeProduct(),
      ];

      spectator.service
        .getProducts({ category_slug: categorySlug })
        .subscribe(products => {
          expect(products).toEqual(mockProducts);
        });

      const req = spectator.expectOne(
        `${url}?categorySlug=${categorySlug}`,
        HttpMethod.GET
      );
      req.flush(mockProducts);
    });

    it('should handle error when API fails', () => {
      const errorMessage = 'API Error';

      spectator.service.getProducts().subscribe({
        error: error => {
          expect(error.statusText).toBe(errorMessage);
        },
      });

      const req = spectator.expectOne(url, HttpMethod.GET);
      req.flush(null, { status: 500, statusText: errorMessage });
    });
  });

  describe('getOne', () => {
    it('should get one product by id', () => {
      const productId = '1';
      const mockProduct = generateFakeProduct({ id: parseInt(productId) });

      spectator.service.getOne(productId).subscribe(product => {
        expect(product).toEqual(mockProduct);
      });

      const url = `${environment.apiUrl}/api/v1/products/${productId}`;
      const req = spectator.expectOne(url, HttpMethod.GET);
      req.flush(mockProduct);
    });

    it('should handle error when product is not found', () => {
      const productId = '999';
      const errorMessage = 'Product not found';

      spectator.service.getOne(productId).subscribe({
        error: error => {
          expect(error.statusText).toBe(errorMessage);
        },
      });

      const url = `${environment.apiUrl}/api/v1/products/${productId}`;
      const req = spectator.expectOne(url, HttpMethod.GET);
      req.flush(null, { status: 404, statusText: errorMessage });
    });
  });

  describe('getOneBySlug', () => {
    it('should get one product by slug', () => {
      const slug = 'test-product';
      const mockProduct = generateFakeProduct({ slug });

      spectator.service.getOneBySlug(slug).subscribe(product => {
        expect(product).toEqual(mockProduct);
      });

      const url = `${environment.apiUrl}/api/v1/products/slug/${slug}`;
      const req = spectator.expectOne(url, HttpMethod.GET);
      req.flush(mockProduct);
    });

    it('should handle error when product slug is not found', () => {
      const slug = 'non-existent';
      const errorMessage = 'Product not found';

      spectator.service.getOneBySlug(slug).subscribe({
        error: error => {
          expect(error.statusText).toBe(errorMessage);
        },
      });

      const url = `${environment.apiUrl}/api/v1/products/slug/${slug}`;
      const req = spectator.expectOne(url, HttpMethod.GET);
      req.flush(null, { status: 404, statusText: errorMessage });
    });
  });

  describe('getRelatedProducts', () => {
    it('should get related products by slug', () => {
      const slug = 'test-product';
      const mockProducts: Product[] = [
        generateFakeProduct(),
        generateFakeProduct(),
      ];

      spectator.service.getRelatedProducts(slug).subscribe(products => {
        expect(products).toEqual(mockProducts);
      });

      const url = `${environment.apiUrl}/api/v1/products/slug/${slug}/related`;
      const req = spectator.expectOne(url, HttpMethod.GET);
      req.flush(mockProducts);
    });

    it('should handle empty related products', () => {
      const slug = 'test-product';
      const mockProducts: Product[] = [];

      spectator.service.getRelatedProducts(slug).subscribe(products => {
        expect(products).toEqual([]);
      });

      const url = `${environment.apiUrl}/api/v1/products/slug/${slug}/related`;
      const req = spectator.expectOne(url, HttpMethod.GET);
      req.flush(mockProducts);
    });

    it('should handle error when fetching related products fails', () => {
      const slug = 'test-product';
      const errorMessage = 'Failed to fetch related products';

      spectator.service.getRelatedProducts(slug).subscribe({
        error: error => {
          expect(error.statusText).toBe(errorMessage);
        },
      });

      const url = `${environment.apiUrl}/api/v1/products/slug/${slug}/related`;
      const req = spectator.expectOne(url, HttpMethod.GET);
      req.flush(null, { status: 500, statusText: errorMessage });
    });
  });
});
