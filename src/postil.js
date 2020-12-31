'use strict';

const languageDefault = 'EN',
      postil = {

        urls: {
            page: Buffer.from('aHR0cHM6Ly9teXBvc3QuaXNyYWVscG9zdC5jby5pbC8lRDclOUUlRDclQTIlRDclQTclRDclOTEtJUQ3JTlFJUQ3JUE5JUQ3JTlDJUQ3JTk1JUQ3JTk3JUQ3JTk5JUQ3JTlE', 'base64'),
            traceAPI: Buffer.from('aHR0cHM6Ly9teXBvc3QuaXNyYWVscG9zdC5jby5pbC91bWJyYWNvL1N1cmZhY2UvSXRlbVRyYWNlL0dldEl0ZW1UcmFjZQ==', 'base64'),
        },

        languagesList: {
            EN: 1033,
            HE: 1037,
        },

      },

    userAgent = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/87.0.4280.88 Safari/537.36';



/**
 * 
 */
class PostIL {
    /**
     * 
     */
    constructor(options, Logger, PackageModel, Fetch) {
        Object.assign(this, {
            Logger: Logger || require('./utils/logger'), // logger can be passed externally.
            PackageModel: PackageModel || require('./model/package'), // can be mocked in testing.
            Fetch: Fetch || require('node-fetch') // can be mocked in testing.
        }, options);
    }
    
    
    /**
     * Getter for the active language of the API to be accessed. Defaults to the value of languageDefault if not set.
     * 
     * @return {String} of the language, iso2, EN, HE.. etc.
     */
    getLanguage() {
        let iso2LangCode = this.language || languageDefault;

        return postil.languagesList[iso2LangCode];
    }
    
    
    /**
     * Getter for CSRF Token and cookies
     * 
     * @return {Promise} of the request.
     */
    async getSecurityTokens() {
        this.Logger.log('debug', 'Getting CSRF token and cookies...');

        let headers = {
            'User-Agent': userAgent
        };

        return await this.Fetch(postil.urls.page, { headers })
            .then(async res => {
                let text = await res.text();

                let reg = new RegExp(/<form.*?frmLogoff.*?Token.*?value="(.*)" \/>/, 'g');
                let token = reg.exec(text);

                return {
                    cookies: res.headers.raw()['set-cookie'].map((cookie => cookie.split(';')[0])).join('; '),
                    csrf: token[1]
                };
            })
            .catch(err => console.error(err));
    }

    /**
     * Getter for the status of the package
     * If successful, returns a PackageModel via fulfill()
     * 
     * @param {String} trackingID
     * 
     * @return {Promise} of the request.
     */
    async getStatus(trackingID) {
        this.Logger.log('debug', ['Sending out tracking request for item', trackingID]);
        
        let tokens = await this.getSecurityTokens();

        let headers = {
            "content-type": "application/x-www-form-urlencoded; charset=UTF-8",
            "x-requested-with": "XMLHttpRequest",
            'user-agent': userAgent,
            "referer": postil.urls.page,
            'cookie': tokens['cookies']
        };
        
        let props = {
            itemCode: trackingID,
            lcid: this.getLanguage(),
            [Buffer.from('X19SZXF1ZXN0VmVyaWZpY2F0aW9uVG9rZW4=', 'base64')]: tokens['csrf']
        };

        return await this.Fetch(postil.urls.traceAPI, {
            body: Object
                .entries(props)
                .map(([key, val]) => `${encodeURIComponent(key)}=${encodeURIComponent(val)}`)
                .join('&'),
            method: 'POST',
            headers,
            })
            .then(async res => {
                this.Logger.log('debug', ['Request for itemID', trackingID]);

                let body = await res.json();

                return new this.PackageModel(trackingID, body);
            })
            .catch(err => {
                this.Logger.log('error', [err, trackingID]);

                return err;
            });
    }

}

module.exports = PostIL;