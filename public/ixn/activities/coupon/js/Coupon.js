define( function( require ) {

    'use strict';
    
	var Postmonger = require( 'postmonger' );
	var $ = require( 'vendor/jquery.min' );

    var connection = new Postmonger.Session();
    var toJbPayload = {};
    var step = 1; 
	var tokens;
	var endpoints;
	
    $(window).ready(onRender);

    connection.on('initActivity', function(payload) {
        var couponType;
		var couponCount;

        if (payload) {
            toJbPayload = payload;
            console.log('payload',payload);
            
			//merge the array of objects.
			var aArgs = toJbPayload['arguments'].execute.inArguments;
			var oArgs = {};
			for (var i=0; i<aArgs.length; i++) {  
				for (var key in aArgs[i]) { 
					oArgs[key] = aArgs[i][key]; 
				}
			}
			//oArgs.priority will contain a value if this activity has already been configured:
			couponType = oArgs.couponType || toJbPayload['configurationArguments'].defaults.couponType;
			couponCount = oArgs.couponCount || toJbPayload['configurationArguments'].defaults.couponCount;
        }
        
		$.get( "/version", function( data ) {
			$('#version').html('Version: ' + data.version);
		});                

        $('#couponType').val(couponType);
		$('#couponCount').val(couponCount);
		
		connection.trigger('updateButton', { button: 'next', enabled: false });
		gotoStep(step);
        
    });

    connection.on('requestedTokens', function(data) {
		if( data.error ) {
			console.error( data.error );
		} else {
			tokens = data;
		}        
    });

    connection.on('requestedEndpoints', function(data) {
		if( data.error ) {
			console.error( data.error );
		} else {
			endpoints = data;
		}        
    });

    connection.on('clickedNext', function() {
        step++;
        gotoStep(step);
        connection.trigger('ready');
    });

    connection.on('clickedBack', function() {
        step--;
        gotoStep(step);
        connection.trigger('ready');
    });

    function onRender() {
        connection.trigger('ready');
		connection.trigger('requestTokens');
        connection.trigger('requestEndpoints');
    };

    function gotoStep(step) {
        $('.step').hide();
        switch(step) {
            case 1:
                $('#step1').show();
                connection.trigger('updateButton', { button: 'next', text: 'done', visible: true });
                connection.trigger('updateButton', { button: 'back', visible: false });
				
				connection.trigger( 'updateStep', step ); 
            break;
			default:
                save();
            break;
        }
    };

    function getCouponType()
	{
		var str = $('#couponType').val();
		if(str)
			return str.trim();
		return "";
	};
	
	function getCouponCount()
	{
		var str = $('#couponCount').val();
		if(str)
			return Number(str);
		return "";
	};
	

    function save() {

        var couponType = getCouponType();
        var couponCount = getCouponCount();
		
        toJbPayload['arguments'].execute.inArguments.push({"couponType": couponType});
		toJbPayload['arguments'].execute.inArguments.push({"couponCount": couponCount});
		
		toJbPayload['configurationArguments'].couponType = couponType;
		toJbPayload['configurationArguments'].couponCount = couponCount;
		
		toJbPayload.metaData.isConfigured = true;  //this is required by JB to set the activity as Configured.
        connection.trigger('updateActivity', toJbPayload);
    }; 
    	 
});
			
