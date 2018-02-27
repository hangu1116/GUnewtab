
function locale_text(key, default_value) {
  var value = chrome.i18n.getMessage(key);
  if(!value)
    return default_value;
  return value;
}

function locale_text_node(textNode) {
  var value = textNode.nodeValue;
  value = value.replace(/__MSG_(\w+)__/g, 
    function(w,w2,w3,w4) {
      return locale_text(w2);
    }  
  );

  textNode.nodeValue = value;
}

function extract_document(e) {
  var childNodes = e.childNodes;
  for (var i = 0; i < childNodes.length; i ++) {
    var c = childNodes[i];
    switch(c.nodeType) {
    case 1:
      extract_document(c);
      break;
    case 3:
      locale_text_node(c);
      break;
    }
  }
}

function addEvent(obj, evtName, fnHandler, useCapture) {
    if(obj.addEventListener) {
      obj.addEventListener(evtName, fnHandler, !!useCapture);
    } else if(obj.attachEvent) {
      obj.attachEvent('on'+evtName, fnHandler);
    } else {
      oTarget["on" + evtName] = fnHandler;
    }
};

addEvent(window, 'load', function() {
  extract_document(document.getElementsByTagName('html')[0]);
});
var mul_table = [
        512,512,456,512,328,456,335,512,405,328,271,456,388,335,292,512,
        454,405,364,328,298,271,496,456,420,388,360,335,312,292,273,512,
        482,454,428,405,383,364,345,328,312,298,284,271,259,496,475,456,
        437,420,404,388,374,360,347,335,323,312,302,292,282,273,265,512,
        497,482,468,454,441,428,417,405,394,383,373,364,354,345,337,328,
        320,312,305,298,291,284,278,271,265,259,507,496,485,475,465,456,
        446,437,428,420,412,404,396,388,381,374,367,360,354,347,341,335,
        329,323,318,312,307,302,297,292,287,282,278,273,269,265,261,512,
        505,497,489,482,475,468,461,454,447,441,435,428,422,417,411,405,
        399,394,389,383,378,373,368,364,359,354,350,345,341,337,332,328,
        324,320,316,312,309,305,301,298,294,291,287,284,281,278,274,271,
        268,265,262,259,257,507,501,496,491,485,480,475,470,465,460,456,
        451,446,442,437,433,428,424,420,416,412,408,404,400,396,392,388,
        385,381,377,374,370,367,363,360,357,354,350,347,344,341,338,335,
        332,329,326,323,320,318,315,312,310,307,304,302,299,297,294,292,
        289,287,285,282,280,278,275,273,271,269,267,265,263,261,259];
        
   
var shg_table = [
	     9, 11, 12, 13, 13, 14, 14, 15, 15, 15, 15, 16, 16, 16, 16, 17, 
		17, 17, 17, 17, 17, 17, 18, 18, 18, 18, 18, 18, 18, 18, 18, 19, 
		19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 19, 20, 20, 20,
		20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 20, 21,
		21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 21,
		21, 21, 21, 21, 21, 21, 21, 21, 21, 21, 22, 22, 22, 22, 22, 22, 
		22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22,
		22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 22, 23, 
		23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23,
		23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23,
		23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 23, 
		23, 23, 23, 23, 23, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 
		24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24,
		24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24,
		24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24,
		24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24, 24 ];

function stackBlurImage( imageID, canvasID, radius, blurAlphaChannel )
{
			
 	var img = document.getElementById( imageID );
	var w = img.naturalWidth;
    var h = img.naturalHeight;
       
	var canvas = document.getElementById( canvasID );
      
    canvas.style.width  = w + "px";
    canvas.style.height = h + "px";
    canvas.width = w;
    canvas.height = h;
    
    var context = canvas.getContext("2d");
    context.clearRect( 0, 0, w, h );
    context.drawImage( img, 0, 0 );

	if ( isNaN(radius) || radius < 1 ) return;
	
	if ( blurAlphaChannel )
		stackBlurCanvasRGBA( canvasID, 0, 0, w, h, radius );
	else 
		stackBlurCanvasRGB( canvasID, 0, 0, w, h, radius );
}


function stackBlurCanvasRGBA( id, top_x, top_y, width, height, radius )
{
	if ( isNaN(radius) || radius < 1 ) return;
	radius |= 0;
	
	var canvas  = document.getElementById( id );
	var context = canvas.getContext("2d");
	var imageData;
	
	try {
	  try {
		imageData = context.getImageData( top_x, top_y, width, height );
	  } catch(e) {
	  
		// NOTE: this part is supposedly only needed if you want to work with local files
		// so it might be okay to remove the whole try/catch block and just use
		// imageData = context.getImageData( top_x, top_y, width, height );
		try {
			netscape.security.PrivilegeManager.enablePrivilege("UniversalBrowserRead");
			imageData = context.getImageData( top_x, top_y, width, height );
		} catch(e) {
			alert("Cannot access local image");
			throw new Error("unable to access local image data: " + e);
			return;
		}
	  }
	} catch(e) {
	  alert("Cannot access image");
	  throw new Error("unable to access image data: " + e);
	}
			
	var pixels = imageData.data;
			
	var x, y, i, p, yp, yi, yw, r_sum, g_sum, b_sum, a_sum, 
	r_out_sum, g_out_sum, b_out_sum, a_out_sum,
	r_in_sum, g_in_sum, b_in_sum, a_in_sum, 
	pr, pg, pb, pa, rbs;
			
	var div = radius + radius + 1;
	var w4 = width << 2;
	var widthMinus1  = width - 1;
	var heightMinus1 = height - 1;
	var radiusPlus1  = radius + 1;
	var sumFactor = radiusPlus1 * ( radiusPlus1 + 1 ) / 2;
	
	var stackStart = new BlurStack();
	var stack = stackStart;
	for ( i = 1; i < div; i++ )
	{
		stack = stack.next = new BlurStack();
		if ( i == radiusPlus1 ) var stackEnd = stack;
	}
	stack.next = stackStart;
	var stackIn = null;
	var stackOut = null;
	
	yw = yi = 0;
	
	var mul_sum = mul_table[radius];
	var shg_sum = shg_table[radius];
	
	for ( y = 0; y < height; y++ )
	{
		r_in_sum = g_in_sum = b_in_sum = a_in_sum = r_sum = g_sum = b_sum = a_sum = 0;
		
		r_out_sum = radiusPlus1 * ( pr = pixels[yi] );
		g_out_sum = radiusPlus1 * ( pg = pixels[yi+1] );
		b_out_sum = radiusPlus1 * ( pb = pixels[yi+2] );
		a_out_sum = radiusPlus1 * ( pa = pixels[yi+3] );
		
		r_sum += sumFactor * pr;
		g_sum += sumFactor * pg;
		b_sum += sumFactor * pb;
		a_sum += sumFactor * pa;
		
		stack = stackStart;
		
		for( i = 0; i < radiusPlus1; i++ )
		{
			stack.r = pr;
			stack.g = pg;
			stack.b = pb;
			stack.a = pa;
			stack = stack.next;
		}
		
		for( i = 1; i < radiusPlus1; i++ )
		{
			p = yi + (( widthMinus1 < i ? widthMinus1 : i ) << 2 );
			r_sum += ( stack.r = ( pr = pixels[p])) * ( rbs = radiusPlus1 - i );
			g_sum += ( stack.g = ( pg = pixels[p+1])) * rbs;
			b_sum += ( stack.b = ( pb = pixels[p+2])) * rbs;
			a_sum += ( stack.a = ( pa = pixels[p+3])) * rbs;
			
			r_in_sum += pr;
			g_in_sum += pg;
			b_in_sum += pb;
			a_in_sum += pa;
			
			stack = stack.next;
		}
		
		
		stackIn = stackStart;
		stackOut = stackEnd;
		for ( x = 0; x < width; x++ )
		{
			pixels[yi+3] = pa = (a_sum * mul_sum) >> shg_sum;
			if ( pa != 0 )
			{
				pa = 255 / pa;
				pixels[yi]   = ((r_sum * mul_sum) >> shg_sum) * pa;
				pixels[yi+1] = ((g_sum * mul_sum) >> shg_sum) * pa;
				pixels[yi+2] = ((b_sum * mul_sum) >> shg_sum) * pa;
			} else {
				pixels[yi] = pixels[yi+1] = pixels[yi+2] = 0;
			}
			
			r_sum -= r_out_sum;
			g_sum -= g_out_sum;
			b_sum -= b_out_sum;
			a_sum -= a_out_sum;
			
			r_out_sum -= stackIn.r;
			g_out_sum -= stackIn.g;
			b_out_sum -= stackIn.b;
			a_out_sum -= stackIn.a;
			
			p =  ( yw + ( ( p = x + radius + 1 ) < widthMinus1 ? p : widthMinus1 ) ) << 2;
			
			r_in_sum += ( stackIn.r = pixels[p]);
			g_in_sum += ( stackIn.g = pixels[p+1]);
			b_in_sum += ( stackIn.b = pixels[p+2]);
			a_in_sum += ( stackIn.a = pixels[p+3]);
			
			r_sum += r_in_sum;
			g_sum += g_in_sum;
			b_sum += b_in_sum;
			a_sum += a_in_sum;
			
			stackIn = stackIn.next;
			
			r_out_sum += ( pr = stackOut.r );
			g_out_sum += ( pg = stackOut.g );
			b_out_sum += ( pb = stackOut.b );
			a_out_sum += ( pa = stackOut.a );
			
			r_in_sum -= pr;
			g_in_sum -= pg;
			b_in_sum -= pb;
			a_in_sum -= pa;
			
			stackOut = stackOut.next;

			yi += 4;
		}
		yw += width;
	}

	
	for ( x = 0; x < width; x++ )
	{
		g_in_sum = b_in_sum = a_in_sum = r_in_sum = g_sum = b_sum = a_sum = r_sum = 0;
		
		yi = x << 2;
		r_out_sum = radiusPlus1 * ( pr = pixels[yi]);
		g_out_sum = radiusPlus1 * ( pg = pixels[yi+1]);
		b_out_sum = radiusPlus1 * ( pb = pixels[yi+2]);
		a_out_sum = radiusPlus1 * ( pa = pixels[yi+3]);
		
		r_sum += sumFactor * pr;
		g_sum += sumFactor * pg;
		b_sum += sumFactor * pb;
		a_sum += sumFactor * pa;
		
		stack = stackStart;
		
		for( i = 0; i < radiusPlus1; i++ )
		{
			stack.r = pr;
			stack.g = pg;
			stack.b = pb;
			stack.a = pa;
			stack = stack.next;
		}
		
		yp = width;
		
		for( i = 1; i <= radius; i++ )
		{
			yi = ( yp + x ) << 2;
			
			r_sum += ( stack.r = ( pr = pixels[yi])) * ( rbs = radiusPlus1 - i );
			g_sum += ( stack.g = ( pg = pixels[yi+1])) * rbs;
			b_sum += ( stack.b = ( pb = pixels[yi+2])) * rbs;
			a_sum += ( stack.a = ( pa = pixels[yi+3])) * rbs;
		   
			r_in_sum += pr;
			g_in_sum += pg;
			b_in_sum += pb;
			a_in_sum += pa;
			
			stack = stack.next;
		
			if( i < heightMinus1 )
			{
				yp += width;
			}
		}
		
		yi = x;
		stackIn = stackStart;
		stackOut = stackEnd;
		for ( y = 0; y < height; y++ )
		{
			p = yi << 2;
			pixels[p+3] = pa = (a_sum * mul_sum) >> shg_sum;
			if ( pa > 0 )
			{
				pa = 255 / pa;
				pixels[p]   = ((r_sum * mul_sum) >> shg_sum ) * pa;
				pixels[p+1] = ((g_sum * mul_sum) >> shg_sum ) * pa;
				pixels[p+2] = ((b_sum * mul_sum) >> shg_sum ) * pa;
			} else {
				pixels[p] = pixels[p+1] = pixels[p+2] = 0;
			}
			
			r_sum -= r_out_sum;
			g_sum -= g_out_sum;
			b_sum -= b_out_sum;
			a_sum -= a_out_sum;
		   
			r_out_sum -= stackIn.r;
			g_out_sum -= stackIn.g;
			b_out_sum -= stackIn.b;
			a_out_sum -= stackIn.a;
			
			p = ( x + (( ( p = y + radiusPlus1) < heightMinus1 ? p : heightMinus1 ) * width )) << 2;
			
			r_sum += ( r_in_sum += ( stackIn.r = pixels[p]));
			g_sum += ( g_in_sum += ( stackIn.g = pixels[p+1]));
			b_sum += ( b_in_sum += ( stackIn.b = pixels[p+2]));
			a_sum += ( a_in_sum += ( stackIn.a = pixels[p+3]));
		   
			stackIn = stackIn.next;
			
			r_out_sum += ( pr = stackOut.r );
			g_out_sum += ( pg = stackOut.g );
			b_out_sum += ( pb = stackOut.b );
			a_out_sum += ( pa = stackOut.a );
			
			r_in_sum -= pr;
			g_in_sum -= pg;
			b_in_sum -= pb;
			a_in_sum -= pa;
			
			stackOut = stackOut.next;
			
			yi += width;
		}
	}
	
	context.putImageData( imageData, top_x, top_y );
	
}


function stackBlurCanvasRGB( id, top_x, top_y, width, height, radius )
{
	if ( isNaN(radius) || radius < 1 ) return;
	radius |= 0;
	
	var canvas  = document.getElementById( id );
	var context = canvas.getContext("2d");
	var imageData;
	
	try {
	  try {
		imageData = context.getImageData( top_x, top_y, width, height );
	  } catch(e) {
	  
		// NOTE: this part is supposedly only needed if you want to work with local files
		// so it might be okay to remove the whole try/catch block and just use
		// imageData = context.getImageData( top_x, top_y, width, height );
		try {
			netscape.security.PrivilegeManager.enablePrivilege("UniversalBrowserRead");
			imageData = context.getImageData( top_x, top_y, width, height );
		} catch(e) {
			alert("Cannot access local image");
			throw new Error("unable to access local image data: " + e);
			return;
		}
	  }
	} catch(e) {
	  alert("Cannot access image");
	  throw new Error("unable to access image data: " + e);
	}
			
	var pixels = imageData.data;
			
	var x, y, i, p, yp, yi, yw, r_sum, g_sum, b_sum,
	r_out_sum, g_out_sum, b_out_sum,
	r_in_sum, g_in_sum, b_in_sum,
	pr, pg, pb, rbs;
			
	var div = radius + radius + 1;
	var w4 = width << 2;
	var widthMinus1  = width - 1;
	var heightMinus1 = height - 1;
	var radiusPlus1  = radius + 1;
	var sumFactor = radiusPlus1 * ( radiusPlus1 + 1 ) / 2;
	
	var stackStart = new BlurStack();
	var stack = stackStart;
	for ( i = 1; i < div; i++ )
	{
		stack = stack.next = new BlurStack();
		if ( i == radiusPlus1 ) var stackEnd = stack;
	}
	stack.next = stackStart;
	var stackIn = null;
	var stackOut = null;
	
	yw = yi = 0;
	
	var mul_sum = mul_table[radius];
	var shg_sum = shg_table[radius];
	
	for ( y = 0; y < height; y++ )
	{
		r_in_sum = g_in_sum = b_in_sum = r_sum = g_sum = b_sum = 0;
		
		r_out_sum = radiusPlus1 * ( pr = pixels[yi] );
		g_out_sum = radiusPlus1 * ( pg = pixels[yi+1] );
		b_out_sum = radiusPlus1 * ( pb = pixels[yi+2] );
		
		r_sum += sumFactor * pr;
		g_sum += sumFactor * pg;
		b_sum += sumFactor * pb;
		
		stack = stackStart;
		
		for( i = 0; i < radiusPlus1; i++ )
		{
			stack.r = pr;
			stack.g = pg;
			stack.b = pb;
			stack = stack.next;
		}
		
		for( i = 1; i < radiusPlus1; i++ )
		{
			p = yi + (( widthMinus1 < i ? widthMinus1 : i ) << 2 );
			r_sum += ( stack.r = ( pr = pixels[p])) * ( rbs = radiusPlus1 - i );
			g_sum += ( stack.g = ( pg = pixels[p+1])) * rbs;
			b_sum += ( stack.b = ( pb = pixels[p+2])) * rbs;
			
			r_in_sum += pr;
			g_in_sum += pg;
			b_in_sum += pb;
			
			stack = stack.next;
		}
		
		
		stackIn = stackStart;
		stackOut = stackEnd;
		for ( x = 0; x < width; x++ )
		{
			pixels[yi]   = (r_sum * mul_sum) >> shg_sum;
			pixels[yi+1] = (g_sum * mul_sum) >> shg_sum;
			pixels[yi+2] = (b_sum * mul_sum) >> shg_sum;
			
			r_sum -= r_out_sum;
			g_sum -= g_out_sum;
			b_sum -= b_out_sum;
			
			r_out_sum -= stackIn.r;
			g_out_sum -= stackIn.g;
			b_out_sum -= stackIn.b;
			
			p =  ( yw + ( ( p = x + radius + 1 ) < widthMinus1 ? p : widthMinus1 ) ) << 2;
			
			r_in_sum += ( stackIn.r = pixels[p]);
			g_in_sum += ( stackIn.g = pixels[p+1]);
			b_in_sum += ( stackIn.b = pixels[p+2]);
			
			r_sum += r_in_sum;
			g_sum += g_in_sum;
			b_sum += b_in_sum;
			
			stackIn = stackIn.next;
			
			r_out_sum += ( pr = stackOut.r );
			g_out_sum += ( pg = stackOut.g );
			b_out_sum += ( pb = stackOut.b );
			
			r_in_sum -= pr;
			g_in_sum -= pg;
			b_in_sum -= pb;
			
			stackOut = stackOut.next;

			yi += 4;
		}
		yw += width;
	}

	
	for ( x = 0; x < width; x++ )
	{
		g_in_sum = b_in_sum = r_in_sum = g_sum = b_sum = r_sum = 0;
		
		yi = x << 2;
		r_out_sum = radiusPlus1 * ( pr = pixels[yi]);
		g_out_sum = radiusPlus1 * ( pg = pixels[yi+1]);
		b_out_sum = radiusPlus1 * ( pb = pixels[yi+2]);
		
		r_sum += sumFactor * pr;
		g_sum += sumFactor * pg;
		b_sum += sumFactor * pb;
		
		stack = stackStart;
		
		for( i = 0; i < radiusPlus1; i++ )
		{
			stack.r = pr;
			stack.g = pg;
			stack.b = pb;
			stack = stack.next;
		}
		
		yp = width;
		
		for( i = 1; i <= radius; i++ )
		{
			yi = ( yp + x ) << 2;
			
			r_sum += ( stack.r = ( pr = pixels[yi])) * ( rbs = radiusPlus1 - i );
			g_sum += ( stack.g = ( pg = pixels[yi+1])) * rbs;
			b_sum += ( stack.b = ( pb = pixels[yi+2])) * rbs;
			
			r_in_sum += pr;
			g_in_sum += pg;
			b_in_sum += pb;
			
			stack = stack.next;
		
			if( i < heightMinus1 )
			{
				yp += width;
			}
		}
		
		yi = x;
		stackIn = stackStart;
		stackOut = stackEnd;
		for ( y = 0; y < height; y++ )
		{
			p = yi << 2;
			pixels[p]   = (r_sum * mul_sum) >> shg_sum;
			pixels[p+1] = (g_sum * mul_sum) >> shg_sum;
			pixels[p+2] = (b_sum * mul_sum) >> shg_sum;
			
			r_sum -= r_out_sum;
			g_sum -= g_out_sum;
			b_sum -= b_out_sum;
			
			r_out_sum -= stackIn.r;
			g_out_sum -= stackIn.g;
			b_out_sum -= stackIn.b;
			
			p = ( x + (( ( p = y + radiusPlus1) < heightMinus1 ? p : heightMinus1 ) * width )) << 2;
			
			r_sum += ( r_in_sum += ( stackIn.r = pixels[p]));
			g_sum += ( g_in_sum += ( stackIn.g = pixels[p+1]));
			b_sum += ( b_in_sum += ( stackIn.b = pixels[p+2]));
			
			stackIn = stackIn.next;
			
			r_out_sum += ( pr = stackOut.r );
			g_out_sum += ( pg = stackOut.g );
			b_out_sum += ( pb = stackOut.b );
			
			r_in_sum -= pr;
			g_in_sum -= pg;
			b_in_sum -= pb;
			
			stackOut = stackOut.next;
			
			yi += width;
		}
	}
	
	context.putImageData( imageData, top_x, top_y );
	
}

function BlurStack()
{
	this.r = 0;
	this.g = 0;
	this.b = 0;
	this.a = 0;
	this.next = null;
}
;
(function($, window, document, undefined) {
	'use strict';

	var jRange = function() {
		return this.init.apply(this, arguments);
	};
	var a;
	if(window.innerWidth<540){
		a=window.innerWidth*0.52;
	}else if(window.innerWidth<1000){
		a=window.innerWidth*0.24;
	}else{
		a=window.innerWidth*0.17;
	}
	jRange.prototype = {
		defaults: {
			onstatechange: function() {},
			isRange: false,
			showLabels: true,
			showScale: true,
			step: 1,
			format: '%s',
			theme: 'theme-green',
			width: a,
			disable: false
		},
		template: '<div class="slider-container">\
			<div class="back-bar">\
                <div class="selected-bar"></div>\
                <div class="pointer low"></div><div class="pointer-label">123456</div>\
                <div class="pointer high"></div><div class="pointer-label">456789</div>\
                <div class="clickable-dummy"></div>\
            </div>\
            <div class="scale"></div>\
		</div>',
		init: function(node, options) {
			this.options       = $.extend({}, this.defaults, options);
			this.inputNode     = $(node);
			this.options.value = this.inputNode.val() || (this.options.isRange ? this.options.from + ',' + this.options.from : this.options.from);
			this.domNode       = $(this.template);
			this.domNode.addClass(this.options.theme);
			this.inputNode.after(this.domNode);
			this.domNode.on('change', this.onChange);
			this.pointers      = $('.pointer', this.domNode);
			this.lowPointer    = this.pointers.first();
			this.highPointer   = this.pointers.last();
			this.labels        = $('.pointer-label', this.domNode);
			this.lowLabel      = this.labels.first();
			this.highLabel     = this.labels.last();
			this.scale         = $('.scale', this.domNode);
			this.bar           = $('.selected-bar', this.domNode);
			this.clickableBar  = this.domNode.find('.clickable-dummy');
			this.interval      = this.options.to - this.options.from;
			this.render();
		},
		render: function() {
			
				this.domNode.width(this.options.width || this.inputNode.width());
				this.inputNode.hide();

			if (this.isSingle()) {
				this.lowPointer.hide();
				this.lowLabel.hide();
			}
			if (!this.options.showLabels) {
				this.labels.hide();
			}
			this.attachEvents();
			if (this.options.showScale) {
				this.renderScale();
			}
			this.setValue(this.options.value);
		},
		isSingle: function() {
			if (typeof(this.options.value) === 'number') {
				return true;
			}
			return (this.options.value.indexOf(',') !== -1 || this.options.isRange) ?
				false : true;
		},
		attachEvents: function() {
			this.clickableBar.click($.proxy(this.barClicked, this));
			this.pointers.on('mousedown touchstart', $.proxy(this.onDragStart, this));
			this.pointers.bind('dragstart', function(event) {
				event.preventDefault();
			});
		},
		onDragStart: function(e) {
			if ( this.options.disable || (e.type === 'mousedown' && e.which !== 1)) {
				return;
			}
			e.stopPropagation();
			e.preventDefault();
			var pointer = $(e.target);
			this.pointers.removeClass('last-active');
			pointer.addClass('focused last-active');
			this[(pointer.hasClass('low') ? 'low' : 'high') + 'Label'].addClass('focused');
			$(document).on('mousemove.slider touchmove.slider', $.proxy(this.onDrag, this, pointer));
			$(document).on('mouseup.slider touchend.slider touchcancel.slider', $.proxy(this.onDragEnd, this));
		},
		onDrag: function(pointer, e) {
			e.stopPropagation();
			e.preventDefault();

			if (e.originalEvent.touches && e.originalEvent.touches.length) {
				e = e.originalEvent.touches[0];
			} else if (e.originalEvent.changedTouches && e.originalEvent.changedTouches.length) {
				e = e.originalEvent.changedTouches[0];
			}

			var position = e.clientX - this.domNode.offset().left;
			this.domNode.trigger('change', [this, pointer, position]);
		},
		onDragEnd: function(e) {
			this.pointers.removeClass('focused');
			this.labels.removeClass('focused');
			$(document).off('.slider');
		},
		barClicked: function(e) {
			if(this.options.disable) return;
			var x = e.pageX - this.clickableBar.offset().left;
			if (this.isSingle())
				this.setPosition(this.pointers.last(), x, true, true);
			else {
				var pointer = Math.abs(parseInt(this.pointers.first().css('left'), 10) - x + this.pointers.first().width() / 2) < Math.abs(parseInt(this.pointers.last().css('left'), 10) - x + this.pointers.first().width() / 2) ?
					this.pointers.first() : this.pointers.last();
				this.setPosition(pointer, x, true, true);
			}
		},
		onChange: function(e, self, pointer, position) {
			var min, max;
			if (self.isSingle()) {
				min = 0;
				max = self.domNode.width();
			} else {
				min = pointer.hasClass('high') ? self.lowPointer.position().left + self.lowPointer.width() / 2 : 0;
				max = pointer.hasClass('low') ? self.highPointer.position().left + self.highPointer.width() / 2 : self.domNode.width();
			}
			var value = Math.min(Math.max(position, min), max);
			self.setPosition(pointer, value, true);
		},
		setPosition: function(pointer, position, isPx, animate) {
			var leftPos,
				lowPos = this.lowPointer.position().left,
				highPos = this.highPointer.position().left,
				circleWidth = this.highPointer.width() / 2;
			if (!isPx) {
				position = this.prcToPx(position);
			}
			if (pointer[0] === this.highPointer[0]) {
				highPos = Math.round(position - circleWidth);
			} else {
				lowPos = Math.round(position - circleWidth);
			}
			pointer[animate ? 'animate' : 'css']({
				'left': Math.round(position - circleWidth)
			});
			if (this.isSingle()) {
				leftPos = 0;
			} else {
				leftPos = lowPos + circleWidth;
			}
			this.bar[animate ? 'animate' : 'css']({
				'width': Math.round(highPos + circleWidth - leftPos),
				'left': leftPos
			});
			this.showPointerValue(pointer, position, animate);
			this.isReadonly();
		},
		// will be called from outside
		setValue: function(value) {
			var values = value.toString().split(',');
			this.options.value = value;
			var prc = this.valuesToPrc(values.length === 2 ? values : [0, values[0]]);
			if (this.isSingle()) {
				this.setPosition(this.highPointer, prc[1]);
			} else {
				this.setPosition(this.lowPointer, prc[0]);
				this.setPosition(this.highPointer, prc[1]);
			}
		},
		renderScale: function() {
			var s = this.options.scale || [this.options.from, this.options.to];
			var prc = Math.round((100 / (s.length - 1)) * 10) / 10;
			var str = '';
			for (var i = 0; i < s.length; i++) {
				str += '<span style="left: ' + i * prc + '%">' + (s[i] != '|' ? '<ins>' + s[i] + '</ins>' : '') + '</span>';
			}
			this.scale.html(str);

			$('ins', this.scale).each(function() {
				$(this).css({
					marginLeft: -$(this).outerWidth() / 2
				});
			});
		},
		getBarWidth: function() {
			var values = this.options.value.split(',');
			if (values.length > 1) {
				return parseInt(values[1], 10) - parseInt(values[0], 10);
			} else {
				return parseInt(values[0], 10);
			}
		},
		showPointerValue: function(pointer, position, animate) {
			var label = $('.pointer-label', this.domNode)[pointer.hasClass('low') ? 'first' : 'last']();
			var text;
			var value = this.positionToValue(position);
			if ($.isFunction(this.options.format)) {
				var type = this.isSingle() ? undefined : (pointer.hasClass('low') ? 'low' : 'high');
				text = this.options.format(value, type);
			} else {
				text = this.options.format.replace('%s', value);
			}

			var width = label.html(text).width(),
				left = position - width / 2;
			left = Math.min(Math.max(left, 0), this.options.width - width);
			label[animate ? 'animate' : 'css']({
				left: left
			});
			this.setInputValue(pointer, value);
		},
		valuesToPrc: function(values) {
			var lowPrc = ((values[0] - this.options.from) * 100 / this.interval),
				highPrc = ((values[1] - this.options.from) * 100 / this.interval);
			return [lowPrc, highPrc];
		},
		prcToPx: function(prc) {
			return (this.domNode.width() * prc) / 100;
		},
		positionToValue: function(pos) {
			var value = (pos / this.domNode.width()) * this.interval;
			value = value + this.options.from;
			return Math.round(value / this.options.step) * this.options.step;
		},
		setInputValue: function(pointer, v) {
			// if(!isChanged) return;
			if (this.isSingle()) {
				this.options.value = v.toString();
			} else {
				var values = this.options.value.split(',');
				if (pointer.hasClass('low')) {
					this.options.value = v + ',' + values[1];
				} else {
					this.options.value = values[0] + ',' + v;
				}
			}
			if (this.inputNode.val() !== this.options.value) {
				this.inputNode.val(this.options.value);
				this.options.onstatechange.call(this, this.options.value);
			}
		},
		getValue: function() {
			return this.options.value;
		},
		isReadonly: function(){
			this.domNode.toggleClass('slider-readonly', this.options.disable);
		},
		disable: function(){
			this.options.disable = true;
			this.isReadonly();
		},
		enable: function(){
			this.options.disable = false;
			this.isReadonly();
		},
		toggleDisable: function(){
			this.options.disable = !this.options.disable;
			this.isReadonly();
		}
	};


	var pluginName = 'jRange';
	// A really lightweight plugin wrapper around the constructor,
	// preventing against multiple instantiations
	$.fn[pluginName] = function(option) {
		var args = arguments,
			result;

		this.each(function() {
			var $this = $(this),
				data = $.data(this, 'plugin_' + pluginName),
				options = typeof option === 'object' && option;
			if (!data) {
				$this.data('plugin_' + pluginName, (data = new jRange(this, options)));
				$(window).resize(function() {
					data.setValue(data.getValue());
				}); // Update slider position when window is resized to keep it in sync with scale
			}
			if (typeof option === 'string') {
				result = data[option].apply(data, Array.prototype.slice.call(args, 1));
			}
		});
		return result || this;
	};

})(jQuery, window, document);

var Detector = function() {
    // a font will be compared against all the three default fonts.
    // and if it doesn't match all 3 then that font is not available.
    var baseFonts = ['monospace', 'sans-serif', 'serif'];

    //we use m or w because these two characters take up the maximum width.
    // And we use a LLi so that the same matching fonts can get separated
    var testString = "mmmmmmmmmmlli";

    //we test using 72px font size, we may use any size. I guess larger the better.
    var testSize = '72px';

    var h = document.getElementsByTagName("body")[0];

    // create a SPAN in the document to get the width of the text we use to test
    var s = document.createElement("span");
    s.style.fontSize = testSize;
    s.innerHTML = testString;
    var defaultWidth = {};
    var defaultHeight = {};
    for (var index in baseFonts) {
        //get the default width for the three base fonts
        s.style.fontFamily = baseFonts[index];
        h.appendChild(s);
        defaultWidth[baseFonts[index]] = s.offsetWidth; //width for the default font
        defaultHeight[baseFonts[index]] = s.offsetHeight; //height for the defualt font
        h.removeChild(s);
    }

    function detect(font) {
        var detected = false;
        for (var index in baseFonts) {
            s.style.fontFamily = font + ',' + baseFonts[index]; // name of the font along with the base font for fallback.
            h.appendChild(s);
            var matched = (s.offsetWidth != defaultWidth[baseFonts[index]] || s.offsetHeight != defaultHeight[baseFonts[index]]);
            h.removeChild(s);
            detected = detected || matched;
        }
        return detected;
    }

    this.detect = detect;
};

var spinner = document.querySelector('.spinner')
var background = document.querySelector('.background')
var line = document.querySelector('.line')
var tick = document.querySelector('.tick')
var arrows = document.querySelectorAll('.arrow')

function start() {
  // Show the spinner
  dynamics.animate(spinner, {
    opacity: 1
  }, {
    duration: 250,
    complete: animateLine
  })

  // Fake the syncing success after 2.5s for this demo
  dynamics.setTimeout(animateSuccess, 2600)
}

// This rotate the background (circle+arrows) indefinitely
function rotate() {
  dynamics.animate(background, {
    rotateZ: 180,
    rotateC: 60
  }, {
    type: dynamics.linear,
    duration: 500,
    complete: function() {
      dynamics.css(background, { rotateZ: 0 })
      rotate()
    }
  })
}

// Animate the line
function animateLine() {
  dynamics.animate(line, {
    strokeDasharray: "40, 117"
  }, {
    type: dynamics.easeInOut,
    duration: 400,
    friction: 700,
    complete: function() {
      dynamics.animate(line, {
        strokeDasharray: "120, 37"
      }, {
        type: dynamics.easeInOut,
        duration: 800,
        complete: animateLine
      })
    }
  })
}

// Animate the success state
function animateSuccess() {
  // First, we animate the line to form a whole circle
  dynamics.animate(line, {
    strokeDasharray: "157, 0",
  }, {
    type: dynamics.easeIn,
    duration: 500,
    friction: 200,
    complete: function() {
      // Then we change the line color and make it a full circle
      // by increasing the strokeWidth
      dynamics.animate(line, {
        strokeWidth: 100,
        stroke: "#000"
      }, {
        friction: 200,
        duration: 300
      })

      // // We hide the arrows
      dynamics.animate(arrows, {
        fill: "#000",
        translate: 5.5,
        scale: 0.5
      }, {
        friction: 200,
        duration: 300
      })

      // Animate the tick icon
      dynamics.animate(tick, {
        opacity: 1,
        rotateZ: 0,
        rotateC: 60
      }, {
        type: dynamics.spring,
        friction: 300,
        duration: 1000,
        delay: 300
      })

      // Restart the whole animation for this demo
      dynamics.setTimeout(restart, 1500)
    }
  })
}

// Restart the whole animation
function restart() {
  dynamics.animate(spinner, {
    opacity: 0
  }, {
    duration: 250,
    complete: function() {
      // Reset css properties to originals
      dynamics.css(tick, {
        opacity: 0,
        rotateZ: -45,
        rotateC: 60
      })
      dynamics.css(line, {
        strokeDasharray: "120, 37",
        stroke: "#000",
        strokeWidth: 10
      })
      dynamics.css(arrows, {
        opacity: 1,
        fill: "#000",
        scale: 1
      })

      // Start!
      // dynamics.setTimeout(start, 500)
    }
  })
}

function clearCanvas()
{  
	var nWidth = document.getElementById('img1').naturalWidth,
        nHeight = document.getElementById('img1').naturalHeight;
    var x=parseInt($('#img1').css('width')),
        y=parseInt($('#img1').css('height'));
   
    $('#myCanvas').attr('width',$('#img1').css('width'));
    $('#myCanvas').attr('height',y*0.5+'px');

    var canvas=document.getElementById('myCanvas');
    var ctx=canvas.getContext('2d'); 
    canvas.height=canvas.height; 
    ctx.beginPath();
    ctx.moveTo(0,0);
    ctx.lineTo(x,0);
    ctx.lineTo(x,y);
    ctx.lineTo(0,y);
    ctx.lineTo(0,0);
    ctx.fillStyle = "#fff";
    ctx.fill();
    var img=document.getElementById("img1");
    ctx.drawImage(img,0,0.5*nHeight,nWidth,0.5*nHeight,0,0,x,0.5*y); 

	stackBlurCanvasRGBA('myCanvas',0,0,x,y,$('.single-slider3').val());
}

function placeholderPic(){
    var w=window.innerWidth;
    // $('.tmttime').css('font-size',w/13+'px');
    // $('.tmtbtn').css('height',w/16+'px');
    // $('.tmtbtn').css('width',w/16+'px');
     var nWidth = document.getElementById('img1').naturalWidth,
        nHeight = document.getElementById('img1').naturalHeight;

    if(w<540){
		$('.content').css('width','90%');
		// nWidth=nWidth*0.6;
		// nHeight = nHeight*0.3;
	}else if(w<1000){
		$('.content').css('width','45%');
		// nWidth = nWidth*0.56;
		// nHeight = nHeight*0.28;
	}else{
		$('.content').css('width','28%');
		// nWidth = nWidth*0.56;
		// nHeight = nHeight*0.28;
	}
	

	var x=parseInt($('#img1').css('width'));
    var y=parseInt($('#img1').css('height'));

    $('#myCanvasBg').attr('width',$('#img1').css('width'));
    $('#myCanvasBg').attr('height',y*0.5+'px');

    $('.preview').css('width',$('#img1').css('width'));
    $('.preview').css('line-height',y+'px');

    var canvas=document.getElementById('myCanvasBg');
    var ctx=canvas.getContext('2d');
    ctx.beginPath();
    ctx.moveTo(0,0);
    ctx.lineTo(x,0);
    ctx.lineTo(x,y);
    ctx.lineTo(0,y);
    ctx.lineTo(0,0);
    ctx.fillStyle = "#fff";
    ctx.fill();
    
    clearCanvas();
}
window.onresize=function(){
  placeholderPic();
}

// 数据初始化函数
function getInfor(){
	placeholderPic();

    var infoA=window.localStorage.getItem('user');
    var blur=infoA[0]+infoA[1];
    var infoN=parseInt(blur);
    $('.single-slider3').val(infoN);
	$('.single-slider3').jRange({
		from: 0,
		to: 60,
		step: 2,
		scale: [0,10,20,30,40,50,60],
		format: '%s',
		showLabels: true,
		showScale: true
	});
    var userName='';
    for(var i=2;i<infoA.length;i++){
        userName = userName+infoA[i];
    }
    $('#userName').val(userName);

    infoA=window.localStorage.getItem('bgstyle');
    if(infoA[0]==='0'){
		$('#tf1').attr('class','chooseYes');
		$('#tf2').attr('class','chooseNo');
		$('#tf1').val(0);
	}else{
		$('#tf2').attr('class','chooseYes');
		$('#tf1').attr('class','chooseNo');
		$('#tf1').val(1);
	}
    var colorModel='';
    for(var i=1;i<7;i++){
        colorModel = colorModel+infoA[i];
    }
    $('#colorModel').val(colorModel);
    var picModel='';
    for(var i=7;i<infoA.length;i++){
        picModel  = picModel+infoA[i];
    }
	for(var i=2;i<7;i++){
		$('#picModel'+i).val(picModel[(i-2)]);
		if($('#picModel'+i).val()==='1'){
		$('#picModel'+i).attr('class','chooseYes');
	    }else{
		$('#picModel'+i).attr('class','chooseNo');
	    }
	}
    
    infoA=window.localStorage.getItem('fontstyle');
    fontColor='';
    for(var i=0;i<6;i++){
        fontColor = fontColor+infoA[i];
    }
    $('#fontColor').val(fontColor);
    $('.preview').css('color','#'+fontColor);
    var fontWeight=infoA[6];
    infoN=parseInt(fontWeight);
    $('.single-slider2').val(infoN);
	$('.single-slider2').jRange({
		from: 1,
		to: 9,
		step: 1,
		scale: [1,2,3,4,5,6,7,8,9],
		format: '%s',
		showLabels: true,
		showScale: true
	});
	$('.preview').css('font-weight',infoN+"00");

	$('option:eq('+infoA[7]+')').attr('selected','selected');
	var opfm="";
	switch (infoA[7]){
		case '0':
			opfm="Microsoft YaHei";
			break;
		case '1':
			opfm="'Bungee', cursive";
			break;
		case '2':
			opfm="'Playfair Display', serif";
			break;
		case '3':
			opfm="'Lobster', cursive";
			break;
		case '4':
			opfm="'Indie Flower', cursive";
			break;
		case '5':
			opfm="Pacifico', cursive;";
			break;
	}
	$('.preview').css('font-family',opfm);

    fontSize='';
    for(var i=8;i<infoA.length;i++){
        fontSize = fontSize+infoA[i];
    }
    $('.single-slider').val(fontSize);
	$('.single-slider').jRange({
		from: 0,
		to: 100,
		step: 1,
		scale: [0,25,50,75,100],
		format: '%s',
		showLabels: true,
		showScale: true
	});
	$('.preview').css('font-size',fontSize+"px");

    if(window.localStorage.getItem('bepMain')){
    	$('#bepMain').val(window.localStorage.getItem('bepMain').replace("<br>","\n"));	
    }
    clearCanvas();
	saveInfor();
}
function clickFtfh(object){
	if($(object).val()==='1'){
		$(object).attr('class','chooseNo');
		$(object).val('0');
	}else{
		$(object).attr('class','chooseYes');
		$(object).val('1');
	}
}
function saveInfor(){

	$('#tf1').on('click',function(){
		$('#tf1').attr('class','chooseYes');
		$('#tf2').attr('class','chooseNo');
		$('#tf1').val(0);
	});
	$('#tf2').on('click',function(){
		$('#tf2').attr('class','chooseYes');
		$('#tf1').attr('class','chooseNo');
		$('#tf1').val(1);
	});
	
    // $('#picModel1').on('click',function(){clickFtfh('#picModel1');});
    $('#picModel2').on('click',function(){clickFtfh('#picModel2');});
    $('#picModel3').on('click',function(){clickFtfh('#picModel3');});
    $('#picModel4').on('click',function(){clickFtfh('#picModel4');});
    $('#picModel5').on('click',function(){clickFtfh('#picModel5');});
    $('#picModel6').on('click',function(){clickFtfh('#picModel6');});

    $('.back-bar').on('click',function(){
		$('.preview').css('font-size',$('.single-slider').val()+"px");
		$('.preview').css('font-weight',$('.single-slider2').val()+"00");
		clearCanvas();
    });
    $('#fontColor').on('change',function(){
		$('.preview').css('color',"#"+$('#fontColor').val());
    });
    
	
    $('#fontType').on("change",function(){
    	var opfm="";
    	switch ($('#fontType').val()){
		case '0':
			opfm="Microsoft YaHei";
			break;
		case '1':
			opfm="'Bungee', cursive";
			break;
		case '2':
			opfm="'Playfair Display', serif";
			break;
		case '3':
			opfm="'Lobster', cursive";
			break;
		case '4':
			opfm="'Indie Flower', cursive";
			break;
		case '5':
			opfm="Pacifico', cursive;";
			break;
	}
		$('.preview').css('font-family',opfm);
    });

	$('#btn1').on('click',function(){
    	var blur=$('.single-slider3').val();
    	if(blur.length===1){
    		blur='0'+blur;
    	}
        window.localStorage.setItem('user',blur+$('#userName').val());
        
		var w='';
		for(var i=2;i<7;i++){
			w+=$('#picModel'+i).val();
		}
		window.localStorage.setItem('bgstyle',$('#tf1').val()+$('#colorModel').val()+w);
		var val=$('#bepMain').val().replace("\n","<br>");
        window.localStorage.setItem('bepMain',val);
        window.localStorage.setItem('fontstyle',$('#fontColor').val()+$('.single-slider2').val()+$('#fontType').val()+$('.single-slider').val());
		start();
    	rotate();
		// alert('success!🚀');
	});
}
$('document').ready(getInfor());