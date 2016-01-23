'use strict';

let chai = require('chai'),
    expect = chai.expect,
    sinon = require('sinon'),
    sinonChai = require('sinon-chai'),
    PostIL = require('./../src/postil.js');


chai.should();
chai.use(sinonChai);

describe('PostIL', () => {
    let postil,
        Logger,
        PackageModel;
    
    beforeEach(() => {
        Logger = {
            log: sinon.spy()
        };

        PackageModel = function() {};
        PackageModel.prototype = {
            
        };

        postil = new PostIL({language: 'EN'});
    });


    it('request', () => {
        postil.getStatus('CC').then(packageStatus => {
            console.log(packageStatus);
        });
    });
});