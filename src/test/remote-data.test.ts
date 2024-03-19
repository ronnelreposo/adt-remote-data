
import { identity } from 'lodash';
import { NotAsked, Loading, success, failure
       , fold, map, bimap, bind
       , isNotAsked, isLoading, isFailure, isSuccess
       } from '../index';

const successRd = success(1);
const failureRd = failure(1);
const successRd2 = success<string, number>(1);
const failureRd2 = failure<string, number>('failed');

const inc = (x: number): number => x + 1
const toString = (x: number): string => x.toString()
const incToString = (x: number): string => toString(inc(x))
const toString_ = (x: string): string => x.toString() + '_'

const id1 = (x: string) => identity(x);
const id2 = (x: number) => identity(x);

describe('Not Asked', () => {
    it('should be `not asked`', () => expect(isNotAsked(NotAsked)).toEqual(true))
    it('should return not asked variant.', () => {
        expect(NotAsked.type).toEqual('NotAsked ');
    })
})

describe('Loading', () => {
    it('should be `loading`', () => expect(isLoading(Loading)).toEqual(true))
    it('should return loading variant.', () => {
        expect(Loading.type).toEqual('Loading');
    })
})

describe('Success', () => {
    it('should be `success`', () => expect(isSuccess(successRd)).toEqual(true))
    it('should return success variant.', () => {
        expect(successRd.type).toEqual('Success');
    })
})

describe('Failure', () => {
    it('should be `failure`', () => expect(isFailure(failureRd)).toEqual(true))
    it('should return failure variant.', () => {
        expect(failureRd.type).toEqual('Failure');
    })
})

describe('fold operator', () => {

    const fFold = fold({ onNotAsked: () => 'not asked'
             , onLoading: () => 'loading'
             , onFailure: _ => 'failed'
             , onSuccess: _ => 'success'
            });

    it('should fold on not asked.', () => {
        const notAskedFoldedValue = fFold(NotAsked);
        expect(notAskedFoldedValue).toEqual('not asked');
    })

    it('should fold on loading.', () => {
        const loadingFoldedValue = fFold(Loading);
        expect(loadingFoldedValue).toEqual('loading');
    })

    it('should fold on failed.', () => {
        const failedFoldedValue = fFold(failureRd);
        expect(failedFoldedValue).toEqual('failed');
    })
    
    it('should fold on success.', () => {
        const successFoldedValue = fFold(successRd);
        expect(successFoldedValue).toEqual('success');
    })
})

describe('map operator', () => {

    it('must preserve identity.', () => {
        const mappedRd = map((x: number) => identity(x))(successRd)
        expect(mappedRd.type).toEqual('Success');
        expect(
            fold({ onNotAsked: () => undefined
                 , onLoading: () => undefined
                 , onFailure: x => identity(x)
                 , onSuccess: x => identity(x) 
            })(mappedRd)
        ).toEqual(1)
    })
    it('must preserve composition.', () => {
        const mappedRd = map(incToString)(successRd)
        const incRd = map((x: number) => inc(x))(successRd)
        const incToStringRd = map((x: number) => toString(x))(incRd)
        expect(mappedRd.type).toEqual(incToStringRd.type);
        expect(
            fold({ onNotAsked: () => undefined
                 , onLoading: () => undefined
                 , onFailure: _ => undefined
                 , onSuccess: x => identity(x)
            })(mappedRd)
        ).toEqual(
            fold({ onNotAsked: () => undefined
                 , onLoading: () => undefined
                 , onFailure: _ => undefined
                 , onSuccess: x => identity(x)
            })(incToStringRd)
        )
    })

})

describe('bimap operator', () => {
    it('must preserve identity.', () => {
        const bimapOnFailureRd = bimap(id1, id2)(failureRd2);
        const bimapOnSuccessRd = bimap(id1, id2)(successRd2);
        expect(bimapOnFailureRd.type).toEqual('Failure');
        expect(bimapOnSuccessRd.type).toEqual('Success');
        expect(
            fold({ onNotAsked: () => undefined
                 , onLoading: () => undefined
                 , onFailure: x => identity(x)
                 , onSuccess: x => identity(x)
            })(bimapOnFailureRd)
        ).toEqual('failed')
        expect(
            fold({ onNotAsked: () => undefined
                 , onLoading: () => undefined
                 , onFailure: x => identity(x)
                 , onSuccess: x => identity(x) 
            })(bimapOnSuccessRd)
        ).toEqual(1)
    })
    it('must preserve composition.', () => {
        const bimapOnFailureRd = bimap((x: string) => toString_(toString_(x)), incToString)(failureRd2);
        const bimapOnSuccessRd = bimap((x: string) => toString_(toString_(x)), incToString)(successRd2);
        expect(
            fold({ onNotAsked: () => undefined
                 , onLoading: () => undefined
                 , onFailure: x => identity(x)
                 , onSuccess: x => identity(x)
            })(bimapOnFailureRd)
        ).toEqual(toString_(toString_('failed')))
        expect(
            fold({ onNotAsked: () => undefined
                 , onLoading: () => undefined
                 , onFailure: x => identity(x)
                 , onSuccess: x => identity(x)
            })(bimapOnSuccessRd)
        )
    })
})

describe('bind operator', () => {

    /**
     * Serves as a return in monadic composition.
     */
    const of = success;

    const sumRd = bind((x: number) =>
                    bind((y: number) =>
                        of(x + y))
                    (successRd2))
                  (successRd)
    
    it('should have an effect', () => {

        const expectedResult = 2;
        expect(
            fold({ onNotAsked: () => undefined
                , onLoading: () => undefined
                , onFailure: _ => undefined
                , onSuccess: x => identity(x)
            })(sumRd)
        ).toEqual(expectedResult)
    })

    it('monad laws: left identity', () => {
        const f = identity
        const m = bind((x: number) => of(f(x)))(successRd)
        expect(
            fold({ onNotAsked: () => undefined
                , onLoading: () => undefined
                , onFailure: _ => undefined
                , onSuccess: x => identity(x)
            })(m)
        ).toEqual(1)
    })

    it('monad laws: right identity', () => {
        const m = bind(of)(successRd)
        expect(
            fold({ onNotAsked: () => undefined
                , onLoading: () => undefined
                , onFailure: _ => undefined
                , onSuccess: x => identity(x)
            })(m)
        ).toEqual(1)
    })

    it('monad laws: associativity', () => {
        const m = bind((x: number) => of(incToString(x)))(successRd)
        const m1 = bind((x: number) => of(inc(x)))(successRd)
        const m2 = bind((y: number) => of(toString(y)))(m1)
        const expectedResult = '2'
        expect(
            fold({ onNotAsked: () => undefined
                , onLoading: () => undefined
                , onFailure: _ => undefined
                , onSuccess: x => identity(x)
            })(m2)
        ).toEqual(expectedResult)
        expect(
            fold({ onNotAsked: () => undefined
                , onLoading: () => undefined
                , onFailure: _ => undefined
                , onSuccess: x => identity(x)
            })(m)
        ).toEqual(expectedResult)
    })
})
