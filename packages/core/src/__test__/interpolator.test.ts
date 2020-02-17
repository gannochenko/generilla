import { Interpolator } from '../interpolator';

describe('Interpolator', () => {
    it('should replace several placeholders', async () => {
        expect(
            Interpolator.apply('[one][two][three]', {
                one: '1',
                two: '2',
                three: '3',
            }),
        ).toEqual('123');
    });
    it('should remove conditional placeholder', async () => {
        expect(
            Interpolator.apply('[?one]two', { one: '1', two: '2', three: '3' }),
        ).toEqual('two');
        expect(
            Interpolator.apply('[?one]two', {
                one: false,
                two: '2',
                three: '3',
            }),
        ).toEqual('two');
        expect(
            Interpolator.apply('[?one][?two]three', {
                one: false,
                two: '2',
                three: '3',
            }),
        ).toEqual('three');
    });
    it('should keep conditional placeholder if the key is missing', async () => {
        expect(
            Interpolator.apply('[?one]two', { two: '2', three: '3' }),
        ).toEqual('[?one]two');
    });
    describe('should allow', () => {
        it('digits', async () => {
            expect(
                Interpolator.apply('[one]', {
                    one: '1234567890',
                    two: '2',
                    three: '3',
                }),
            ).toEqual('1234567890');
        });
        it('letters', async () => {
            const value = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
            expect(Interpolator.apply('[one]', { one: value })).toEqual(value);
            expect(
                Interpolator.apply('[one]', { one: value.toLowerCase() }),
            ).toEqual(value.toLowerCase());
        });
        it('some spec charaters', async () => {
            const value = '_-.';
            expect(Interpolator.apply('[one]', { one: value })).toEqual(value);
        });
    });
    describe('should not allow', () => {
        it('slashes', async () => {
            const value = 'lala/../../lolo';
            expect(Interpolator.apply('[one]', { one: value })).toEqual(
                'lala....lolo',
            );
        });
        it('backslashes', async () => {
            const value = 'lala\\..\\..\\lolo';
            expect(Interpolator.apply('[one]', { one: value })).toEqual(
                'lala....lolo',
            );
        });
    });
});
