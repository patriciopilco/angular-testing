import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HeaderComponent } from './header.component';
import { createRoutingFactory, SpectatorRouting } from '@ngneat/spectator';
import { CartService } from '@shared/services/cart.service';

describe('HeaderComponent', () => {
  let spectator: SpectatorRouting<HeaderComponent>;
  const createComponent = createRoutingFactory({
    component: HeaderComponent,
    providers: [CartService]
  });

  beforeEach(() => {
    spectator = createComponent();
  });

  it('should create', () => {
    expect(spectator.component).toBeTruthy();
  });
});