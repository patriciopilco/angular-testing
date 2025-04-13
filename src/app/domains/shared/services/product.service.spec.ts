import { createHttpFactory, HttpMethod, SpectatorHttp } from '@ngneat/spectator/jest';
import { ProductService } from './product.service';
import { environment } from '@env/environment';


describe('ProductService', () => {
    let spectator: SpectatorHttp<ProductService>;
    const createHttp = createHttpFactory(ProductService);
  
    beforeEach(() => {
      spectator = createHttp();
    });
  
    it('cant test HttpClient.get',()=>{
        spectator.service.getOne('1').subscribe();
        const url = `${environment.apiUrl}/api/v1/products/1`;
        spectator.expectOne(url, HttpMethod.GET);    

    });

    
    
  });