# Remote Data for TypeScript

[![Test](https://github.com/ronnelreposo/adt-remote-data/actions/workflows/test.yml/badge.svg?branch=test)](https://github.com/ronnelreposo/adt-remote-data/actions/workflows/test.yml)

A TypeScript implementation of the **RemoteData** pattern for representing data requested from a remote source.

A request can be in several distinct states: it may not have started, it may be loading, it may have failed, or it may have succeeded. `RemoteData` represents those states as a single type, making it easier to handle them explicitly in application code.

This library is inspired by projects that came before it, especially [krisajenkins/remotedata](https://github.com/krisajenkins/remotedata).

## Installation

Install from npm:

```sh
npm install adt-remote-data --save
```

To install a specific version:

```sh
npm install adt-remote-data@2.0.0
```

## RemoteData states

`RemoteData<E, A>` represents one of four states:

| State | Meaning |
| --- | --- |
| `NotAsked` | The request has not started. |
| `Loading` | The request is in progress. |
| `Failure<E>` | The request failed and contains an error value. |
| `Success<A>` | The request succeeded and contains a result value. |

The application is responsible for making requests and transitioning between states. The library provides the type and functions for working with those states.

## Example

```ts
import {
  fold,
  success,
  type RemoteData,
} from 'adt-remote-data';

type User = {
  name: string;
};

const user: RemoteData<string, User> = success({
  name: 'Ronnel',
});

const message = fold<string, User, string>({
  onNotAsked: () => 'Request not started',
  onLoading: () => 'Loading…',
  onFailure: error => `Could not load user: ${error}`,
  onSuccess: value => `Hello, ${value.name}`,
})(user);
```

`fold` handles each possible state and produces a single result.

## API

### Constructors

#### `NotAsked`

Represents data that has not been requested.

#### `Loading`

Represents a request that is in progress.

#### `failure`

Creates a failed result containing an error value.

#### `success`

Creates a successful result containing a value.

### Methods

#### `fold`

**Alias:** `cata`

Handles all four states by calling the corresponding handler: `onNotAsked`, `onLoading`, `onFailure`, or `onSuccess`.

#### `map`

Transforms the value inside a successful result. The other states are preserved.

#### `bimap`

Transforms either the error value in a failure or the value in a success. `NotAsked` and `Loading` are preserved.

#### `bind`

**Aliases:** `andThen`, `flatMap`

Chains an operation that returns another `RemoteData`. The operation runs for a successful value; the other states are preserved.

#### `isNotAsked`

Returns whether the value is `NotAsked`.

#### `isLoading`

Returns whether the value is `Loading`.

#### `isFailure`

Returns whether the value is a failure.

#### `isSuccess`

Returns whether the value is a success.

## Developing

The Node environment is described in `shell.nix`.

Install dependencies and build:

```sh
npm install
npm run build
```

## Testing

Run Jest in watch mode:

```sh
npm test
```

Run the test suite without watch mode:

```sh
npm run test:ci
```

The `prepare` script also builds the package and runs the non-watch test suite during installation.

## Releasing

Log in to npm:

```sh
npm login
```

Choose the appropriate version update:

```sh
npm version patch
# or
npm version minor
# or
npm version major
```

Then publish:

```sh
npm publish
```

When finished:

```sh
npm logout
```

The package's `postversion` script pushes commits and tags, so review the package scripts before running a release.

## Support

Feedback and suggestions are welcome. You can contact me at **00swampy.combs@icloud.com**.

## Author

Written and maintained by [Ronnel Reposo](https://github.com/ronnelreposo).

## License

The package metadata declares the ISC license.
