const PostILStatus = require('../src/postil');

let PostIL = new PostILStatus(),
    trackingID = '1111111111111';

PostIL.getStatus(trackingID).then(packageModel => {
    console.log(packageModel.getDescription());
    //console.log(packageModel);
    //console.log(packageModel.getDescription());
});