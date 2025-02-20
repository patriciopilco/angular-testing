import { SpectatorPipe, createPipeFactory } from '@ngneat/spectator/jest';

import { ReversePipe } from './reverse.pipe';

describe('ReversePipe', () => {
  let spectator: SpectatorPipe<ReversePipe>;
  const createPipe = createPipeFactory(ReversePipe);

  it('should reverse a simple string', () => {
    spectator = createPipe(`{{ 'Hello' | reverse }}`);
    expect(spectator.element).toHaveText('olleH');
  });

  it('should handle empty string', () => {
    spectator = createPipe(`{{ '' | reverse }}`);
    expect(spectator.element).toHaveText('');
  });

  it('should reverse string with spaces', () => {
    spectator = createPipe(`{{ 'Hello World' | reverse }}`);
    expect(spectator.element).toHaveText('dlroW olleH');
  });

  it('should reverse string with special characters', () => {
    spectator = createPipe(`{{ 'Hello@World!' | reverse }}`);
    expect(spectator.element).toHaveText('!dlroW@olleH');
  });

  it('should reverse numbers as strings', () => {
    spectator = createPipe(`{{ '12345' | reverse }}`);
    expect(spectator.element).toHaveText('54321');
  });
});
