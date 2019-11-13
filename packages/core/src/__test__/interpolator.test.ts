import { Interpolator } from '../interpolator';

describe('Interpolator', () => {
    it('should replace several placeholders', async () => {
        expect(Interpolator.apply('[one][two][three]', { one: '1', two: '2', three: '3'})).toEqual('123');
    });
});
