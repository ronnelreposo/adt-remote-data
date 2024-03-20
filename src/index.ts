
// Brand type. https://egghead.io/blog/using-branded-types-in-typescript
declare const __brand: unique symbol;
type Brand<B> = { readonly [__brand]: B };
type Branded<T, B> = T & Brand<B>;


type NotAsked = Branded<Readonly<{ type: "NotAsked"; }>, "remote-data">;
type Loading = Branded<Readonly<{ type: "Loading"; }>, "remote-data">;
type Failure<E> = Branded<Readonly<{ type: "Failure"; value: E; }>, "remote-data">;
type Success<A> = Branded<Readonly<{ type: "Success"; value: A; }>, "remote-data">;
/**
 * Represents a variant for Remote Data.
 */
export type RemoteData<E, A> = NotAsked | Loading | Failure<E> | Success<A>;

// Type Constructors.

export const NotAsked: RemoteData<never, never> = { type: "NotAsked" } as NotAsked;

export const Loading: RemoteData<never, never> = ({ type: "Loading" }) as Loading;

export const failure = <E, A>(value: E): RemoteData<E, A> => ({ type: "Failure", value }) as Failure<E>;

export const success = <E, A>(value: A): RemoteData<E, A> => ({ type: "Success", value }) as Success<A>;

/**
 * fold takes four functions `onNotAsked`, `onLoading`, `onFailure`, `onSuccess` and `RemoteData` you want to reduce, This functions will be invoked upon the variant of the input `RemoteData`.
 * @param handlers 
 */
export const fold = <E, A, R>(handlers: {
    onNotAsked: () => R;
    onLoading: () => R;
    onFailure: (value: E) => R;
    onSuccess: (value: A) => R;
}): (remoteData: RemoteData<E, A>) => R =>
    remoteData => {
        switch (remoteData.type) {
            case "NotAsked": return handlers.onNotAsked();
            case "Loading": return handlers.onLoading();
            case "Failure": return handlers.onFailure(remoteData.value);
            case "Success": return handlers.onSuccess(remoteData.value);
        }
    }

/**
 * Function alias of fold.
 */
export const cata = fold;

/**
 * map takes a function and a `RemoteData`. The transformer function takes a value and returns a transformed value. The value to the function will be supplied on **success** variant in `RemoteData`.
 * @param f - transformer function.
 */
export const map = <E, A, B>(f: (a: A) => B) =>
    fold<E, A, RemoteData<E, B>>({
        onNotAsked: () => NotAsked,
        onLoading: () => Loading,
        onFailure: failure,
        onSuccess: value => success(f(value))
    });

/**
 * bimap takes two function `onError` and `onSuccess` and performs dual transformation of `RemoteData`.
 * @param onError 
 * @param onSuccess 
 */
export const bimap = <E, F, A, B>(
    onError: (e: E) => F,
    onSuccess: (a: A) => B) =>
    fold<E, A, RemoteData<F, B>>({
        onNotAsked: () => NotAsked,
        onLoading: () => Loading,
        onFailure: value => failure(onError(value)),
        onSuccess: value => success(onSuccess(value))
    });

/**
 * bind takes a function that takes a value and returns a `RemoteData`. The value to the function will be supplied on **success** variant in `RemoteData` your binding to.
 * @param f - bind function. 
 */
export const bind = <E, A, B>(f: (a: A) => RemoteData<E, B>) =>
    fold<E, A, RemoteData<E, B>>({
        onNotAsked: () => NotAsked,
        onLoading: () => Loading,
        onFailure: failure,
        onSuccess: f
    });

/**
 * Function Alias of bind.
 */
export const andThen = bind
/**
 * Function Alias of bind.
 */
export const flatMap = bind

/**
 * isNotAsked accepts a `RemoteData` and returns true if the variant is `notAsked`.
 * @param remoteData 
 */
export const isNotAsked = <E, A>(remoteData: RemoteData<E, A>) =>
    fold<E, A, boolean>({
        onNotAsked: () => true,
        onLoading: () => false,
        onFailure: _ => false,
        onSuccess: _ => false
    })(remoteData)

/**
 * isLoading accepts a `RemoteData` and returns true if the variant is `loading`.
 * @param remoteData 
 */
export const isLoading = <E, A>(remoteData: RemoteData<E, A>) =>
    fold<E, A, boolean>({
        onNotAsked: () => false,
        onLoading: () => true,
        onFailure: _ => false,
        onSuccess: _ => false
    })(remoteData)

/**
 * isFailure accepts a `RemoteData` and returns true if the variant is `failure`.
 * @param remoteData 
 */
export const isFailure = <E, A>(remoteData: RemoteData<E, A>) =>
    fold<E, A, boolean>({
        onNotAsked: () => false,
        onLoading: () => false,
        onFailure: _ => true,
        onSuccess: _ => false
    })(remoteData)

/**
 * isSuccess accepts a `RemoteData` and returns true if the variant is `success`.
 * @param remoteData 
 */
export const isSuccess = <E, A>(remoteData: RemoteData<E, A>) =>
    fold<E, A, boolean>({
        onNotAsked: () => false,
        onLoading: () => false,
        onFailure: _ => false,
        onSuccess: _ => true
    })(remoteData)
