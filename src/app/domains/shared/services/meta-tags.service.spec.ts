import { createServiceFactory, SpectatorService } from '@ngneat/spectator/jest';
import { MetaTagsService } from './meta-tags.service';
import { Meta, Title } from '@angular/platform-browser';
import { environment } from '@env/environment';

describe('MetaTagsService', () => {
  let spectator: SpectatorService<MetaTagsService>;
  let metaService: Meta;
  let titleService: Title;

  const createService = createServiceFactory({
    service: MetaTagsService,
    providers: [
      {
        provide: Title,
        useValue: {
          setTitle: jest.fn(),
        },
      },
      {
        provide: Meta,
        useValue: {
          updateTag: jest.fn(),
        },
      },
    ],
  });

  beforeEach(() => {
    spectator = createService();
    metaService = spectator.inject(Meta);
    titleService = spectator.inject(Title);
    jest.clearAllMocks();
  });

  it('should be created', () => {
    expect(spectator.service).toBeTruthy();
  });

  it('should update all meta tags with complete metadata', () => {
    const metadata = {
      title: 'Test Title',
      description: 'Test Description',
      image: 'Test Image',
      url: 'Test Url',
    };

    spectator.service.updateMetaTags(metadata);

    expect(titleService.setTitle).toHaveBeenCalledWith('Test Title');
    expect(metaService.updateTag).toHaveBeenCalledTimes(6);
    expect(metaService.updateTag).toHaveBeenCalledWith({
      name: 'title',
      content: 'Test Title',
    });
    expect(metaService.updateTag).toHaveBeenCalledWith({
      name: 'description',
      content: 'Test Description',
    });
    expect(metaService.updateTag).toHaveBeenCalledWith({
      property: 'og:title',
      content: 'Test Title',
    });
    expect(metaService.updateTag).toHaveBeenCalledWith({
      property: 'og:description',
      content: 'Test Description',
    });
    expect(metaService.updateTag).toHaveBeenCalledWith({
      property: 'og:image',
      content: 'Test Image',
    });
    expect(metaService.updateTag).toHaveBeenCalledWith({
      property: 'og:url',
      content: 'Test Url',
    });
  });

  it('should use default values when partial metadata is provided', () => {
    const partialMetadata = {
      title: 'Custom Title',
    };

    spectator.service.updateMetaTags(partialMetadata);

    expect(titleService.setTitle).toHaveBeenCalledWith('Custom Title');
    expect(metaService.updateTag).toHaveBeenCalledWith({
      name: 'description',
      content: 'Ng Store is a store for Ng products',
    });
    expect(metaService.updateTag).toHaveBeenCalledWith({
      property: 'og:url',
      content: environment.domain,
    });
  });

  it('should handle empty metadata object', () => {
    spectator.service.updateMetaTags({});

    expect(titleService.setTitle).toHaveBeenCalledWith('Ng Store');
    expect(metaService.updateTag).toHaveBeenCalledTimes(6);
    expect(metaService.updateTag).toHaveBeenCalledWith({
      name: 'description',
      content: 'Ng Store is a store for Ng products',
    });
  });

  it('should handle undefined values in metadata', () => {
    const metadata = {
      title: undefined,
      description: undefined,
      image: undefined,
      url: undefined,
    };

    spectator.service.updateMetaTags(metadata);

    expect(titleService.setTitle).toHaveBeenCalledWith('Ng Store');
    expect(metaService.updateTag).toHaveBeenCalledWith({
      name: 'description',
      content: 'Ng Store is a store for Ng products',
    });
    expect(metaService.updateTag).toHaveBeenCalledWith({
      property: 'og:url',
      content: environment.domain,
    });
  });

  it('should handle empty string values', () => {
    const metadata = {
      title: '',
      description: '',
      image: '',
      url: '',
    };

    spectator.service.updateMetaTags(metadata);

    expect(titleService.setTitle).toHaveBeenCalledWith('');
    expect(metaService.updateTag).toHaveBeenCalledWith({
      name: 'description',
      content: '',
    });
    expect(metaService.updateTag).toHaveBeenCalledWith({
      property: 'og:url',
      content: '',
    });
  });
});
