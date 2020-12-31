'use strict';

/**
 * Package object.
 * 
 * Represents the model state of the package in POSTIL. Access should be done via getters
 */
class Package {
    /**
     * Constructor method being execute with the trackingID and the object recived from PostIL service.
     * 
     * @param {String} trackingID - package tracking id
     * @param {Object} packageData - contains the package data from post's server.
     */
    constructor(trackingID, packageData) {
        Object.assign(this, {
            trackingID: trackingID
        }, packageData);
    }
    

    /**
     * Is Response valid?
     * Verifies the return error code, 0 is ok.
     * 
     * @return {Boolean} for the response status
     */
    isValid() {
        return 0 !== this.ReturnCode;
    }

    
    /**
     * Get error code id
     * 
     * @return {Number} of the error code
     */
    getErrorCode() {
        return this.ReturnCode;
    }


    /**
     * Get error description text
     * 
     * @return {String} of the error code
     */
    getErrorDescription() {
        return this.ErrorDescription;
    }


    /**
     * Getter for tracking ID
     * 
     * @return {String} of the trackingID representing this object.
     */
    getTrackingID() {
        return this.trackingID;
    }
    
    
    /**
     * Getter of the package type, returned raw from posts' response.
     * Examples of types: 'rashum'
     * 
     * @return {String} lowercase of the type
     */
    getType() {
        return this.Result.data_type.toLowerCase();
    }
    
    
    /**
     * Getter for the type name, used to construct meaning full response line.
     * Responded in the active language.
     * 
     * @return {String} of the package type
     */
    getTypeName() {
        return this.Result.typeName;
    }
    
    
    /**
     * Getter for the status of the package.
     * Responded in the active language.
     * 
     * @return {Object} of the latest status containing internals of the package.
     */
    getStatusLast() {
        let lastStatus = this.getStatusDetailed()[0];

        return lastStatus;
    }
    

    /**
     * Get full package steps, in an ordered array
     * 
     * @return {Array} 
     */
    getStatusDetailed() {
        let info = this.Result.itemcodeinfo.InfoLines,
            destructed = [];
        
        // 4 columns structure response - usually ok.
        if (4 === this.Result.itemcodeinfo.ColCount) {
            destructed = info.map(
                ([date,
                    action,
                    branch,
                    city
                ]) => ({ date, action, branch, city })
            );
        }

        // 1 columns structure response - usually error.
        if (1 === this.Result.itemcodeinfo.ColCount) {
            destructed = info.map(
                ([error,
                ]) => ({ error })
            );
        }

        return destructed;
    }


    /**
     * Getter for the complete sentence of the status of the package.
     * 
     * Example response:
     *   Registered mail, EE12345679890PL, The item is being held by customs. A notification was sent to the addressee on 01/01/2016
     * 
     * @return {String} of the status.
     */
    getDescription() {
        if (this.isValid()) {
            return [
                this.getTrackingID(),
                'Invalid ID input'
            ].join(', ');
        }

        if (this.getStatusLast().error) {
            return [
                this.getStatusLast().error
            ].join(', ');
        }

        // valid
        return [
            this.getTypeName(),
            this.getTrackingID(),
            `${this.getStatusLast().action} (${this.getStatusLast().branch}, ${this.getStatusLast().city})`
        ].join(', ');
    }
}

module.exports = Package;