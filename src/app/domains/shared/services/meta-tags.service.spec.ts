import { MetaTagsService } from '@shared/services/meta-tags.service';
import { Meta, Title } from '@angular/platform-browser';
import { createServiceFactory, SpectatorService } from '@ngneat/spectator';
import { environment } from '@env/environment';

describe('MetaTagsService', () => {
    let spectator: SpectatorService<MetaTagsService>;
    let metaPlatform: Meta;
    let titlePlatform: Title;
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
        metaPlatform = spectator.inject(Meta);
        titlePlatform = spectator.inject(Title);
    });

    it('should be created', () => {
        expect(spectator.service).toBeTruthy();
    });

    it('should set the title correctly', () => {
        const testTitle = 'New Test Title';
        spectator.service.updateMetaTags({ title: testTitle });
        expect(titlePlatform.setTitle).toHaveBeenCalledWith(testTitle);
    });

    it('should update meta tags with provided metadata', () => {
        const testMetaData = {
            title: 'Test Title',
            description: 'Test Description',
            image: 'test-image.jpg',
            url: 'https://test-url.com',
        };
        spectator.service.updateMetaTags(testMetaData);

        expect(metaPlatform.updateTag).toHaveBeenCalledWith({ name: 'title', content: testMetaData.title });
        expect(metaPlatform.updateTag).toHaveBeenCalledWith({ name: 'description', content: testMetaData.description });
        expect(metaPlatform.updateTag).toHaveBeenCalledWith({ property: 'og:title', content: testMetaData.title });
        expect(metaPlatform.updateTag).toHaveBeenCalledWith({ property: 'og:description', content: testMetaData.description });
        expect(metaPlatform.updateTag).toHaveBeenCalledWith({ property: 'og:image', content: testMetaData.image });
        expect(metaPlatform.updateTag).toHaveBeenCalledWith({ property: 'og:url', content: testMetaData.url });
    });

    it('should use default metadata when partial metadata is provided', () => {
        const partialMetaData = { title: 'Partial Title' };
        spectator.service.updateMetaTags(partialMetaData);

        expect(metaPlatform.updateTag).toHaveBeenCalledWith({ name: 'title', content: partialMetaData.title });
        expect(metaPlatform.updateTag).toHaveBeenCalledWith({ name: 'description', content: 'Ng Store is a store for Ng products' });
        expect(metaPlatform.updateTag).toHaveBeenCalledWith({ property: 'og:title', content: partialMetaData.title });
        expect(metaPlatform.updateTag).toHaveBeenCalledWith({ property: 'og:description', content: 'Ng Store is a store for Ng products' });
        expect(metaPlatform.updateTag).toHaveBeenCalledWith({ property: 'og:image', content: '' });
        expect(metaPlatform.updateTag).toHaveBeenCalledWith({ property: 'og:url', content: environment.domain });
    });

    it('should handle empty metadata gracefully', () => {
        spectator.service.updateMetaTags({});
        expect(metaPlatform.updateTag).toHaveBeenCalledWith({ name: 'title', content: 'Ng Store' });
        expect(metaPlatform.updateTag).toHaveBeenCalledWith({ name: 'description', content: 'Ng Store is a store for Ng products' });
        expect(metaPlatform.updateTag).toHaveBeenCalledWith({ property: 'og:title', content: 'Ng Store' });
        expect(metaPlatform.updateTag).toHaveBeenCalledWith({ property: 'og:description', content: 'Ng Store is a store for Ng products' });
        expect(metaPlatform.updateTag).toHaveBeenCalledWith({ property: 'og:image', content: '' });
        expect(metaPlatform.updateTag).toHaveBeenCalledWith({ property: 'og:url', content: environment.domain });
    });

    it('should not throw an error when metadata is undefined', () => {
        expect(() => spectator.service.updateMetaTags(undefined as any)).not.toThrow();
        expect(metaPlatform.updateTag).toHaveBeenCalledWith({ name: 'title', content: 'Ng Store' });
        expect(metaPlatform.updateTag).toHaveBeenCalledWith({ name: 'description', content: 'Ng Store is a store for Ng products' });
    });
});