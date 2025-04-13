import { ComponentFixture, TestBed } from '@angular/core/testing';
import  ProductDetailComponent  from './product-detail.component';
import { ProductService } from '@shared/services/product.service';
import { createRoutingFactory, mockProvider, Spectator } from '@ngneat/spectator';
import { generateFakeProduct } from '@shared/models/product.mock';

describe('ProductDetailComponent', () => {
  let spectator: Spectator<ProductDetailComponent>;

  const mockProduct = generateFakeProduct();

  const createComponent = createRoutingFactory({
    component: ProductDetailComponent,
    providers: [mockProvider(ProductService)],
  });
  

  beforeEach(async () => {
    spectator = createComponent({
      props: {
        slug: mockProduct.slug,
      }
    });
  });

  it('should create', () => {
    // Configuración adicional necesaria
    expect(spectator.component).toBeTruthy();
  });
});