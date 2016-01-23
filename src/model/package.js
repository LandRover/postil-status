'use strict';

const _ = require('lodash');


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
        _.extend(this, {
            trackingID: trackingID
        }, packageData);
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
        return this.data_type.toLowerCase();
    }
    
    
    /**
     * Getter for the type name, used to construct meaning full response line.
     * Responded in the active language.
     * 
     * @return {String} of the package type
     */
    getTypeName() {
        return this.typename;
    }
    
    
    /**
     * Getter for the status of the package.
     * Usually contains some odd javascript remarketing tag, probably to notify via Google Adwards the the package is ready for pickup - removed via regex.
     * Responded in the active language.
     * 
     * @return {String} of the status from posts' server.
     */
    getStatus() {
        return this.itemcodeinfo.match(/^(.*)<br>/)[1];
    }
    
    
    /**
     * Getter for the complete sentance of the status of the package.
     * 
     * Example response:
     *   Registered mail, EE12345679890PL, The item is being held by customs. A notification was sent to the addressee on 01/01/2016
     * 
     * @return {String} of the status.
     */
    getDescription() {
        return [
            this.getTypeName(),
            ', ',
            this.getTrackingID(),
            ', ',
            this.getStatus()
        ].join('');
    }
}

module.exports = Package;