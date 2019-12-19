
/**
 * Represents a variant for Remote Data.
 */
export type RemoteData<E, A> = { readonly type: "NotAsked"; }
    | { readonly type: "Loading"; }
    | { readonly type: "Failure"; readonly value: E; }
    | { readonly type: "Success"; readonly value: A; };

export const notAsked = <E, A>(): RemoteData<E, A> => ({ type: "NotAsked" });

export const loading = <E, A>(): RemoteData<E, A> => ({ type: "Loading" });

export const failure = <E, A>(value: E): RemoteData<E, A> => ({ type: "Failure", value })

export const success = <E, A>(value: A): RemoteData<E, A> => ({ type: "Success", value })

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
        ;
    }

export const map = <E, A, B>(f: (a: A) => B) =>
    fold<E, A, RemoteData<E, B>>({
        onNotAsked: notAsked,
        onLoading: loading,
        onFailure: failure,
        onSuccess: value => success(f(value))
    });

export const bind = <E, A, B>(f: (a: A) => RemoteData<E, B>) =>
    fold<E, A, RemoteData<E, B>>({
        onNotAsked: notAsked,
        onLoading: loading,
        onFailure: failure,
        onSuccess: f
    });

export const andThen = bind

export const isNotAsked = <E, A>(remoteData: RemoteData<E, A>) =>
    fold<E, A, boolean>({
        onNotAsked: () => true,
        onLoading: () => false,
        onFailure: _ => false,
        onSuccess: _ => false
    })(remoteData)

export const isLoading = <E, A>(remoteData: RemoteData<E, A>) =>
    fold<E, A, boolean>({
        onNotAsked: () => false,
        onLoading: () => true,
        onFailure: _ => false,
        onSuccess: _ => false
    })(remoteData)

export const isFailure = <E, A>(remoteData: RemoteData<E, A>) =>
    fold<E, A, boolean>({
        onNotAsked: () => false,
        onLoading: () => false,
        onFailure: _ => true,
        onSuccess: _ => false
    })(remoteData)

export const isSuccess = <E, A>(remoteData: RemoteData<E, A>) =>
    fold<E, A, boolean>({
        onNotAsked: () => false,
        onLoading: () => false,
        onFailure: _ => false,
        onSuccess: _ => true
    })(remoteData)
