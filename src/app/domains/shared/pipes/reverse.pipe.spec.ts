import { SpectatorPipe, createPipeFactory } from '@ngneat/spectator/jest';
import { ReversePipe } from './reverse.pipe';


describe('ReversePipe', () => {
    let spectator: SpectatorPipe<ReversePipe>;
    const createPipe = createPipeFactory(ReversePipe);

    it('should transform a string to its reverse', () => {
      spectator = createPipe(`{{ 'Hola' | reverse }}`);
      expect(spectator.element).toHaveText('aloH');
    });

    // edege cases
    
    it('should handle an empty string', () => {
      spectator = createPipe(`{{ '' | reverse }}`);
      expect(spectator.element).toHaveText('');
    });

    it('should handle a single character string', () => {
      spectator = createPipe(`{{ 'A' | reverse }}`);
      expect(spectator.element).toHaveText('A');
    });

    it('should handle a string with spaces', () => {
      spectator = createPipe(`{{ 'Hello World' | reverse }}`);
      expect(spectator.element).toHaveText('dlroW olleH');
    });

    it('should handle a string with special characters', () => {
      spectator = createPipe(`{{ '123!@#' | reverse }}`);
      expect(spectator.element).toHaveText('#@!321');
    });

    it('should handle a string with mixed case', () => {
      spectator = createPipe(`{{ 'AbCdEf' | reverse }}`);
      expect(spectator.element).toHaveText('fEdCbA');
    });

  });

  