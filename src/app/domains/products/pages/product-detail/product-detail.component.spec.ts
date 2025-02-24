import {
  Spectator,
  createRoutingFactory,
  mockProvider,
  SpyObject,
  byTestId,
} from '@ngneat/spectator/jest';
import ProductDetailComponent from './product-detail.component';
import { ProductService } from '@shared/services/product.service';
import { generateFakeProduct } from '@shared/models/product.mock';
import { of } from 'rxjs';

describe('ProductDetailComponent', () => {
  let spectator: Spectator<ProductDetailComponent>;
  let productService: SpyObject<ProductService>;
  const mockProduct = generateFakeProduct();

  const createComponent = createRoutingFactory({
    component: ProductDetailComponent,
    providers: [
      mockProvider(ProductService, {
        getOneBySlug: jest.fn().mockReturnValue(of(mockProduct)),
      }),
    ],
  });

  beforeEach(() => {
    spectator = createComponent({
      detectChanges: false,
    });
    spectator.setInput('slug', mockProduct.slug);
    productService = spectator.inject(ProductService);
  });

  it('should create', () => {
    spectator.detectChanges();
    expect(spectator.component).toBeTruthy();
  });

  it('should display the product cover', () => {
    // Act
    spectator.detectChanges();

    // Assert
    const cover = spectator.query<HTMLImageElement>(byTestId('cover'));
    expect(cover).toBeTruthy();
    expect(cover?.src).toBe(mockProduct.images[0]);
  });
});
