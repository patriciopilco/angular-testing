import { byTestId, createRoutingFactory, SpectatorRouting } from '@ngneat/spectator/jest';
import { ProductComponent } from './product.component';
import { generateFakeProduct } from '@shared/models/product.mock';
import { get } from 'http';

describe('ProductComponent', () => {
  let spectator: SpectatorRouting<ProductComponent>;
  const createComponent = createRoutingFactory({
    component: ProductComponent,
  });

  const mockProduct = generateFakeProduct();

  beforeEach(() => {
    spectator = createComponent({
      detectChanges: false
    });
    spectator.setInput('product', mockProduct);
  });

  it('should create', () => {
    spectator.detectChanges();
    expect(spectator.component).toBeTruthy();
  });

  it('should display product title', () => {
    spectator.detectChanges();
    //const element = spectator.query('[data-testid="product-title"]');
    const element = spectator.query(byTestId('product-title'));
    expect(element).toHaveText(mockProduct.title);
  }
  );

  it('should emit a product when the button is clicked', () => {
    //Arrange
    spectator.detectChanges();

    //Act
    const emitSpy = jest.spyOn(spectator.component.addToCart, 'emit');
    //spectator.component.addToCartHandler();
    spectator.click(byTestId('add-to-cart-button'));
    
    //Assert
    expect(emitSpy).toHaveBeenCalledWith(mockProduct);
  });
});