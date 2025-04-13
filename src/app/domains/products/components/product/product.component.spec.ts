import { createRoutingFactory, SpectatorRouting } from '@ngneat/spectator/jest';
import { ProductComponent } from './product.component';
import { generateFakeProduct } from '@shared/models/product.mock';

describe('ProductComponent', () => {
  let spectator: SpectatorRouting<ProductComponent>;
  const createComponent = createRoutingFactory({
    component: ProductComponent,
    detectChanges: false
  });

  beforeEach(() => {
    spectator = createComponent({
        props: {
            product: generateFakeProduct(),
        }

    });
  });

  it('should create', () => {
    expect(spectator.component).toBeTruthy();
  });
});