import {
  Spectator,
  byTestId,
  createRoutingFactory,
} from '@ngneat/spectator/jest';
import { HeaderComponent } from './header.component';
import { CartService } from '@shared/services/cart.service';
import { Product } from '@shared/models/product.model';
import { SearchComponent } from '../search/search.component';
import { generateFakeProduct } from '@shared/models/product.mock';

describe('HeaderComponent', () => {
  let spectator: Spectator<HeaderComponent>;
  let component: HeaderComponent;
  let cartService: CartService;
  let mockProduct: Product;

  const createComponent = createRoutingFactory({
    component: HeaderComponent,
    providers: [CartService],
    imports: [SearchComponent],
    declarations: [],
  });

  beforeEach(() => {
    mockProduct = generateFakeProduct({
      price: 100, // Fixed price for predictable total calculations in tests
    });
    spectator = createComponent();
    component = spectator.component;
    cartService = spectator.inject(CartService);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('Menu functionality', () => {
    it('should have menu hidden by default', () => {
      expect(component.showMenu()).toBeFalsy();
      const menu = spectator.query('.flex-col.items-center');
      expect(menu).toHaveClass('hidden');
    });

    it('should toggle menu visibility when clicking menu button', () => {
      const menuButton = spectator.query(
        'button[data-collapse-toggle="navbar-default"]'
      );
      expect(menuButton).toBeTruthy();

      spectator.click(menuButton!);
      spectator.detectChanges();
      expect(component.showMenu()).toBeTruthy();

      spectator.click(menuButton!);
      spectator.detectChanges();
      expect(component.showMenu()).toBeFalsy();
    });
  });

  describe('Cart functionality', () => {
    it('should have side menu hidden by default', () => {
      expect(component.hideSideMenu()).toBeTruthy();
      const sideMenu = spectator.query('.fixed.border-l-4');
      expect(sideMenu).toHaveClass('translate-x-full');
    });

    it('should toggle cart side menu when clicking cart button', () => {
      const cartButton = spectator.query('button.p-2.border');
      expect(cartButton).toBeTruthy();

      spectator.click(cartButton!);
      spectator.detectChanges();
      expect(component.hideSideMenu()).toBeFalsy();

      spectator.click(cartButton!);
      spectator.detectChanges();
      expect(component.hideSideMenu()).toBeTruthy();
    });

    it('should display correct cart count', () => {
      // Empty cart initially
      const cartCount = spectator.query('.absolute.-top-2.-left-2');
      expect(cartCount?.textContent?.trim()).toBe('0');

      // Add item to cart
      cartService.addToCart(mockProduct);
      spectator.detectChanges();
      expect(cartCount?.textContent?.trim()).toBe('1');
    });

    it('should display cart items and total', () => {
      cartService.addToCart(mockProduct);
      cartService.addToCart(mockProduct);
      spectator.detectChanges();

      const cartItems = spectator.queryAll(
        '.flex.justify-between.items-center.space-y-2'
      );
      expect(cartItems.length).toBe(2);

      const total = spectator.query(byTestId('total'));
      expect(total).toHaveText('Total: 200'); // 2 items * $100
    });
  });

  describe('Navigation', () => {
    it('should have all required navigation links', () => {
      const links = spectator.queryAll('a[routerLink]');
      const routerLinks = links.map(link => link.getAttribute('routerLink'));

      expect(routerLinks).toContain('/');
      expect(routerLinks).toContain('/about');
      expect(routerLinks).toContain('/locations');
      expect(routerLinks).toContain('/services');
    });

    it('should have active link styling', () => {
      const homeLink = spectator.query('a[routerLink="/"]');
      expect(homeLink).toHaveAttribute('routerLinkActive', 'underline');
    });
  });

  describe('Search component', () => {
    it('should render search component', () => {
      const searchComponent = spectator.query('app-search');
      expect(searchComponent).toBeTruthy();
    });
  });
});
