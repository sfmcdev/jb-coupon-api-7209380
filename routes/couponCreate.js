'use strict';
var https = require( 'https' );
var activityUtils = require('./activityUtils');


/*
 * POST Handler for / route of Activity (this is the edit route).
 */
exports.edit = function( req, res ) {
    // Data from the req and put it in an array accessible to the main app.
    //console.log( req.body );
    activityUtils.logData( req );
    res.send( 200, 'Edit' );
};

/*
 * POST Handler for /save/ route of Activity.
 */
exports.save = function( req, res ) {
    // Data from the req and put it in an array accessible to the main app.
    //console.log( req.body );
    activityUtils.logData( req );
    res.send( 200, 'Save' );
};

/*
 * POST Handler for /publish/ route of Activity.
 */
exports.publish = function( req, res ) {
    // Data from the req and put it in an array accessible to the main app.
    //console.log( req.body );
    activityUtils.logData( req );
    res.send( 200, 'Publish' );
};

/*
 * POST Handler for /validate/ route of Activity.
 */
exports.validate = function( req, res ) {
    // Data from the req and put it in an array accessible to the main app.
    //console.log( req.body );
    activityUtils.logData( req );
    res.send( 200, 'Validate' );
};

/*
 * POST Handler for /execute/ route of Activity.
 */
exports.execute = function( req, res ) {
    // Data from the req and put it in an array accessible to the main app.
    //console.log( req.body );
    activityUtils.logData( req );

	//initCase(req,res);
	createCoupon(req,res);
};


function createCoupon(req, res)
{
	//merge the array of objects for easy access in code.
	var aArgs = req.body.inArguments;
	console.log( "aArgs:" + aArgs );
	var oArgs = {};
	
	var iLen = 0;
	if(aArgs != undefined)
	{
		iLen = aArgs.length;
	}
	for (var i=0; i<iLen; i++) 
	{ 
		for (var key in aArgs[i]) { 
			oArgs[key] = aArgs[i][key]; 
		}
	}
	
	var contactKey = req.body.keyValue;
	if(!contactKey)
	{
		oArgs = {
			"couponType": "73",
			"couponCount": "1",
			"apiUrl": "UAT"
		};
		contactKey = "927746965857";
	}
	
	// these values come from the custom activity form inputs
	var couponType = oArgs.couponType;
	var couponCount = oArgs.couponCount;	
	var apiUrl = oArgs.apiUrl;
	
	var post_url = "http://uat.storellet.com/storellet/api/pizzahut/coupon";
	// TODO - add PROD url
	if(apiUrl == "PROD")
	{
		
	}
		
	console.log('COUPON for ', contactKey);
	var post_body = '<soapenv:Envelope xmlns:soapenv="http://schemas.xmlsoap.org/soap/envelope/" xmlns:fbp="http://www.pointsoft.com/FBPosOnlineMember/"><soapenv:Header/><soapenv:Body>';
	post_body += '<fbp:eCouponCreate>';
	post_body += '<fbp:memberCode>' + contactKey + '</fbp:memberCode>';
	post_body += '<fbp:eCouponType>' + couponType + '</fbp:eCouponType>';
	post_body += '<fbp:count>' + couponCount + '</fbp:count>';
	post_body += '</fbp:eCouponCreate></soapenv:Body></soapenv:Envelope>';
		
	console.log('post body:', post_body);

	var request = require('request');
	/*
	request.post(		
		post_url,
		{
			form: post_body
		},
		function (error, response, body) 
		{
			if (!error && response.statusCode == 200) {				
				console.log('onEND Coupon Create:', response.statusCode);
				res.send( 200, {"status": 0} );
			} else {
				console.log('onEND fail:', response.statusCode);
				res.send(response.statusCode);
			}		
		}
	);
	*/
	
	request(
		{
			url: post_url,
			method: "POST",
			headers: {
			"content-type": "text/xml",  // <--Very important!!!
			}
		}, function (error, response, body)
		{
			if (!error && response.statusCode == 200) {				
				console.log('onEND Coupon Create:', response.statusCode);
				res.send( 200, {"status": 0} );
			} else {
				console.log('onEND fail:', response.statusCode);
				res.send(response.statusCode);
			}		
		}
	);
	
	request.write(post_body);
	request.end();
}

