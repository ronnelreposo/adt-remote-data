# Remote Data for Typescript

## Introduction

Remote Data is an Abstract Data Type (ADT) for respresenting data from remote sources.

This library is inspired by those that have come before, especially the [remotedata](https://github.com/krisajenkins/remotedata) project.

## Documentation

Full detailed documentation can be found [here](https://github.com/ronnelreposo/adt-remote-data/blob/master/README.md)

## Installation

### NPM

```bash
npm install adt-remote-data --save

# or to install a specific version
npm install adt-remote-data@1.0.0
```

## Contents

### RemoteData

#### Constructors

##### notAsked `deprecated` use `NotAsked` constant instead.
##### NotAsked
##### loading `deprecated` use `Loading` constant instead.
##### Loading
##### failure
##### success

#### Methods

##### fold
**Alias:** `cata`
`fold` takes four functions `onNotAsked`, `onLoading`, `onFailure`, `onSuccess` and `RemoteData` you want to reduce, This functions will be invoked upon the variant of the input `RemoteData`.

##### map
`map` takes a function and a `RemoteData`. The transformer function takes a value and returns a transformed value. The value to the function will be supplied on **success** variant in `RemoteData`.

##### bimap
`bimap` takes two function `onError` and `onSuccess` and performs dual transformation of `RemoteData`.

##### bind
**Alias:** `andThen`, `flatMap`

`bind` takes a function that takes a value and returns a `RemoteData`. The value to the function will be supplied on **success** variant in `RemoteData` your binding to.

##### isNotAsked
`isNotAsked` accepts a `RemoteData` and returns true if the variant is `notAsked`.

##### isLoading
`isLoading` accepts a `RemoteData` and returns true if the variant is `loading`.

##### isFailure
`isFailure` accepts a `RemoteData` and returns true if the variant is `failure`.

##### isSuccess
`isSuccess` accepts a `RemoteData` and returns true if the variant is `success`.

## Support
Let know what you think email me at ronnel.reposo@gmail.com

## Author
Written and maintained Ronnel Reposo [ronnelreposo](https://github.com/ronnelreposo)
