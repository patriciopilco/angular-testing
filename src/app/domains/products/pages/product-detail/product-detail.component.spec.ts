import {
  Spectator,
  createRoutingFactory,
  mockProvider,
  SpyObject,
  byTestId,
} from '@ngneat/spectator/jest';
import { faker } from '@faker-js/faker';
import ProductDetailComponent from './product-detail.component';
import { ProductService } from '@shared/services/product.service';
import { generateFakeProduct } from '@shared/models/product.mock';
import { of } from 'rxjs';
import { DeferBlockBehavior } from '@angular/core/testing';
import { RelatedComponent } from '../../components/related/related.component';
import { CartService } from '@shared/services/cart.service';
import { MetaTagsService } from '@shared/services/meta-tags.service';

window.IntersectionObserver = jest.fn(() => ({
  observe: jest.fn(),
  unobserve: jest.fn(),
  disconnect: jest.fn(),
  takeRecords: jest.fn(),
  root: null,
  rootMargin: '',
  thresholds: [],
}));

describe('ProductDetailComponent', () => {
  let spectator: Spectator<ProductDetailComponent>;
  let productService: SpyObject<ProductService>;
  let cartService: SpyObject<CartService>;
  const mockProduct = generateFakeProduct({
    images: [
      faker.image.url(),
      faker.image.url(),
      faker.image.url(),
      faker.image.url(),
    ],
  });

  const createComponent = createRoutingFactory({
    component: ProductDetailComponent,
    deferBlockBehavior: DeferBlockBehavior.Manual,
    providers: [
      mockProvider(ProductService, {
        getOneBySlug: jest.fn().mockReturnValue(of(mockProduct)),
      }),
      mockProvider(CartService),
      mockProvider(MetaTagsService),
    ],
  });

  beforeEach(() => {
    spectator = createComponent({
      detectChanges: false,
    });
    spectator.setInput('slug', mockProduct.slug);
    productService = spectator.inject(ProductService);
    cartService = spectator.inject(CartService);
  });

  it('should create', () => {
    spectator.detectChanges();
    expect(spectator.component).toBeTruthy();
  });

  it('should getOneBySlug be called', () => {
    spectator.detectChanges();
    expect(productService.getOneBySlug).toHaveBeenCalledWith(mockProduct.slug);
  });

  it('should display the product cover', () => {
    // Act
    spectator.detectChanges();

    // Assert
    const cover = spectator.query<HTMLImageElement>(byTestId('cover'));
    expect(cover).toBeTruthy();
    expect(cover?.src).toBe(mockProduct.images[0]);
  });

  it('should load related products', async () => {
    spectator.detectChanges();
    await spectator.deferBlock().renderComplete();
    const related = spectator.query(RelatedComponent);
    expect(related).toBeTruthy();
  });

  it('should change the cover when the image is clicked', () => {
    spectator.detectChanges();
    const gallery = spectator.query(byTestId('gallery'));
    const images = gallery?.querySelectorAll('img');

    expect(images).toHaveLength(mockProduct.images.length);

    if (images && images.length > 0) {
      spectator.click(images[1]);
      const cover = spectator.query<HTMLImageElement>(byTestId('cover'));
      expect(cover?.src).toBe(mockProduct.images[1]);
    }
  });

  it('should add the product to the cart when the button is clicked', () => {
    spectator.detectChanges();
    spectator.click(byTestId('add-to-cart'));
    expect(cartService.addToCart).toHaveBeenCalledWith(mockProduct);
  });
});
