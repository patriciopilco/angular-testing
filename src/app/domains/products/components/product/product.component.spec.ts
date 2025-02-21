import { createRoutingFactory, Spectator } from '@ngneat/spectator/jest';

import { ProductComponent } from './product.component';
import { generateFakeProduct } from '@shared/models/product.mock';

describe('ProductComponent', () => {
  let spectator: Spectator<ProductComponent>;

  const createComponent = createRoutingFactory({
    component: ProductComponent,
  });

  beforeEach(() => {
    spectator = createComponent({
      detectChanges: false,
    });
    spectator.setInput('product', generateFakeProduct());
  });

  it('should create', () => {
    spectator.detectChanges();
    expect(spectator.component).toBeTruthy();
  });
});
