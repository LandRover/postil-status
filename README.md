# Israel Post Package Status Checker

## What is it?

### About the package

`postil-status` is a node module, distributed via NPM and allows you to retrieve data from PostIL (http://www.postil.com) about you packages, supporting both registered mail and EMS. API is supporting all languages by 4 languages: EN, HE, AR and RU. (Default: EN)
Responses are returned as a Promise and make it easy to chain and track.

## Usage

Add `postil-status` you your package.json file and install it via npm install.

```console
$ npm install postil-status --save-dev
```

### Example code


```js
const PostILStatus = require('postil-status');

let PostIL = new PostILStatus(),
    trackingID = 'EE12345679890PL';

PostIL.getStatus(trackingID).then(packageModel => {
    console.log(packageModel);
    console.log(packageModel.getDescription());
});
```


### Language override

To specify for the API a specific specific response language, it should passed as the first property for the constructor.
```js
let PostIL = new PostILStatus({language: 'HE'});
```


## Building
Clone this repo (or fork it)
```console
$ git clone git@github.com:landrover/postil-status.git
```
Install deps
```console
$ npm install
```

### Todo
 * fix tests
 * coverage missing at the model, package.js.
 * comments
