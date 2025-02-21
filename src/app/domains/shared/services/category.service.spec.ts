import {
  createHttpFactory,
  HttpMethod,
  SpectatorHttp,
} from '@ngneat/spectator/jest';
import { CategoryService } from './category.service';
import { environment } from '@env/environment';
import { generateFakeCategory } from '../models/category.mock';
import { Category } from '../models/category.model';

import fetchMock, { enableFetchMocks } from 'jest-fetch-mock';
enableFetchMocks();

describe('CategoryService', () => {
  let spectator: SpectatorHttp<CategoryService>;
  const createHttp = createHttpFactory(CategoryService);

  beforeEach(() => {
    spectator = createHttp();
    fetchMock.resetMocks();
  });

  describe('getAll', () => {
    const url = `${environment.apiUrl}/api/v1/categories`;

    it('should get all categories', () => {
      const mockCategories: Category[] = [
        generateFakeCategory(),
        generateFakeCategory(),
      ];

      spectator.service.getAll().subscribe(categories => {
        expect(categories).toEqual(mockCategories);
      });

      const req = spectator.expectOne(url, HttpMethod.GET);
      req.flush(mockCategories);
    });

    it('should handle empty categories list', () => {
      const mockCategories: Category[] = [];

      spectator.service.getAll().subscribe(categories => {
        expect(categories).toEqual([]);
      });

      const req = spectator.expectOne(url, HttpMethod.GET);
      req.flush(mockCategories);
    });

    it('should handle error when API fails', () => {
      const errorMessage = 'API Error';

      spectator.service.getAll().subscribe({
        error: error => {
          expect(error.statusText).toBe(errorMessage);
        },
      });

      const req = spectator.expectOne(url, HttpMethod.GET);
      req.flush(null, { status: 500, statusText: errorMessage });
    });
  });

  describe('getAllPromise', () => {
    const url = `${environment.apiUrl}/api/v1/categories`;

    it('should get all categories using Promise', async () => {
      const mockCategories: Category[] = [
        generateFakeCategory(),
        generateFakeCategory(),
      ];

      // Mock global fetch
      fetchMock.mockResponseOnce(JSON.stringify(mockCategories));

      const result = await spectator.service.getAllPromise();
      expect(result).toEqual(mockCategories);
      expect(fetch).toHaveBeenCalledWith(url);
    });

    it('should handle empty categories list with Promise', async () => {
      const mockCategories: Category[] = [];

      // Mock global fetch
      fetchMock.mockResponseOnce(JSON.stringify(mockCategories));

      const result = await spectator.service.getAllPromise();
      expect(result).toEqual([]);
      expect(fetch).toHaveBeenCalledWith(url);
    });

    it('should handle network error in Promise', async () => {
      const errorMessage = 'Network Error';

      // Mock global fetch to throw error
      fetchMock.mockRejectOnce(new Error(errorMessage));

      await expect(spectator.service.getAllPromise()).rejects.toThrow(
        errorMessage
      );
      expect(fetch).toHaveBeenCalledWith(url);
    });

    it('should handle JSON parsing error in Promise', async () => {
      // Mock global fetch with invalid JSON
      fetchMock.mockResponseOnce('Invalid JSON');

      await expect(spectator.service.getAllPromise()).rejects.toThrow(
        'Invalid JSON'
      );
      expect(fetch).toHaveBeenCalledWith(url);
    });
  });
});
