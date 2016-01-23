'use strict';

const _ = require('lodash'),
      languageDefault = 'EN',
      requestInfo = {
          postil: {
              url: 'http://www.israelpost.co.il/itemtrace.nsf/trackandtraceJSON'
          },
          userAgent: 'Mozilla/5.0 (Linux; Android 4.2.2; GT-I9505 Build/JDQ39) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/31.0.1650.59 Mobile Safari/537.36'
      };


/**
 * 
 */
class PostIL {
    /**
     * 
     */
    constructor(options, Logger, PackageModel, Request) {
        _.extend(this, {
            Logger: Logger || require('./utils/logger'), // logger can be passed externally.
            PackageModel: PackageModel || require('./model/package'), // can be mocked in testing.
            Request: Request || require('request-promise') // can be mocked in testing.
        }, options);
    }
    
    
    /**
     * Getter for the active language of the API to be accessed. Defaults to the value of languageDefault if not set.
     * 
     * @return {String} of the language, iso2, EN, HE.. etc.
     */
    getLanguage() {
        return this.language || languageDefault;
    }
    
    
    /**
     * Getter for the status of the package
     * If successful, returns a PackageModel via fulfill()
     * 
     * @param {String} trackingID
     * 
     * @return {Promise} of the request.
     */
    getStatus(trackingID) {
        this.Logger.log('debug', 'Sending out tracking request for item', trackingID);
        
        return new Promise((fulfill, reject) => {
            let request = this._getRequest(trackingID);
            
            this.Logger.log('silly', 'Request for itemID:', trackingID, request, 'sent, returning promise...');
            
            this.Request(request).then(response => {
                    this.Logger.log('debug', 'Request for itemID:', trackingID, request, 'returned:', response);
                    
                    fulfill(new this.PackageModel(trackingID, response));
                })
                .catch(err => {
                    this.Logger.log('error', 'Request Failed', request, 'returned with an error', err);
                    reject(err);
                });
        });
    }
    
    
    /**
     * Getter for the constructed request to be sent.
     * Contains the language and the tracking number is concatinated at the end.
     * 
     * @param {String} trackingID - The item that needs to be checked.
     * @return {Object} constructed request, with params language and everything set for Request to be sent.
     */
    _getRequest(trackingID) {
        return {
            uri: requestInfo.postil.url,
            qs: {
                'openagent': '',
                'sKod2': '',
                'lang': this.getLanguage(),
                'itemcode': trackingID
            },
            headers: {
                'User-Agent': requestInfo.userAgent
            },
                json: true
            };
    }
}

module.exports = PostIL;