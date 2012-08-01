
// Polyfill - requestAnimationFrame - only basic shim as very old browsers don't support getUserMedia anyway (from http://paulirish.com/2011/requestanimationframe-for-smart-animating/)
window.requestAnimationFrame = (function(){
  return  window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame || 
          function( callback ){
            window.setTimeout(callback, 1000 / 60);
          };
})();
    
navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia;
window.URL = window.URL || window.webkitURL || window.mozURL || window.msURL;

// Mocap.js copyright Philip Ingrey 2012
// Licensed under an MIT license, see http://pci.mit-license.org/

function motionSensor(options){
    "use strict";

    // Externally accessable
    this.fps = 60;

    // Global constants (though some are set once video size is known!)
    var PAINTWIDTH = 0;
    var PAINTHEIGHT = 0;

    // Global variables
    // TODO - can you remove some of these?
    var v,
        c,
        ctx,
        diff,
        difftx,
        dbout,
        dboutx,
        lastimg = null,
        cfps=0,
        noblocks=16,
        mstore = new Array(120),
        mp = 0,
        timeout = 0,
        that = this;

    // normalise diff data
    // mindist - the minimum distance the motion has to cover (in under actiontimeout) to be registered
    // action timeout - number of seconds gap needed before the next action is allowed
    var dave = 30,
        dmax = 10000,
        mindist = 0.25,
        actiontimeout = 0.5;


    this.init = function() {
        v = document.createElement('video');
        c = document.createElement('canvas');
        ctx = c.getContext('2d');
        diff = document.createElement('canvas');
        difftx = diff.getContext('2d');

        // resize c once we know the size of the video
        v.addEventListener("play", function() {  
            PAINTWIDTH = c.width = v.videoWidth;  
            PAINTHEIGHT = c.height = v.videoHeight; 
        }, false);

        // Otherwise these get read as good results!
        for(var i in mstore) mstore[i] = -1;

        // Setup styles on video and canvas
        diff.style.position = "fixed";
        diff.style.right = 0;
        diff.style.bottom = 0;
        diff.width = 128;
        diff.height = 128;
        diff.style.oTransform = "scale(-1, 1)";
        diff.style.mozTransform = "scale(-1, 1)";
        diff.style.webkitTransform = "scale(-1, 1)";
        diff.style.msTransform = "scale(-1, 1)";
        diff.style.transform = "scale(-1, 1)";
        c.style.position = "fixed";
        c.style.right = "128px";
        c.style.bottom = 0;
        c.style.mozTransform = "scale(-0.25, 0.25)";
        c.style.mozTransformOrigin = "80% 100%";
        c.style.oTransform = "scale(-0.25, 0.25)";
        c.style.oTransformOrigin = "80% 100%";
        c.style.webkitTransform = "scale(-0.25, 0.25)";
        c.style.webkitTransformOrigin = "80% 100%";
        c.style.msTransform = "scale(-0.25, 0.25)";
        c.style.msTransformOrigin = "80% 100%";
        c.style.transform = "scale(-0.25, 0.25)";
        c.style.transformOrigin = "80% 100%";

        // attach
        document.querySelector("body").appendChild(diff);
        document.querySelector("body").appendChild(c);

        // Get the stream from the camera using getUserMedia
        // basic getUserMedia code fom http://dev.opera.com/articles/view/playing-with-html5-video-and-getusermedia-support/
        if (navigator.getUserMedia) {
            // This beautiful hack for the options is from @kanasansoft:
            // http://www.kanasansoft.com/weblab/2012/06/arguments_of_getusermedia.html
            var gumOptions = {video: true, toString: function(){return 'video';}};
            
            that.successCallback = function(stream) {
                // Replace the source of the video element with the stream from the camera
                if(navigator.getUserMedia==navigator.mozGetUserMedia) {
                    v.src = stream;
                } else{
                    v.src = window.URL.createObjectURL(stream) || stream;
                }
                v.play();
            }
            
            that.errorCallback = function(error) {
                console.error('An error occurred: [CODE ' + error.code + ']');
                v.play();
            }

            navigator.getUserMedia(gumOptions, that.successCallback, that.errorCallback);
        } else {
            var errorMsg = '<p class="error">Uh oh, it appears your browser doesn\'t support this feature.<br>Please try with a browser that has camera support. <br/> e.g. <a href=\'http://www.opera.com/\'>opera</a>, <a href=\'http://www.google.co.uk/chrome\'>chrome</a> or <a href=\'http://nightly.mozilla.org/\'>firefox nightly</a></p>';
            document.querySelector('[role=main]').innerHTML = errorMsg;
            console.log('Native web camera streaming (getUserMedia) is not supported in this browser.');
            v.play();
        }
        
        window.setInterval(that.fpsf,2000);
        that.animLoop();
    }


    this.fpsf = function(){
        // Frames per (2) second(s) 
        // TODO - dynamic resizing of noblocks for low-end devices
        that.fps = cfps/2;
        cfps = 0;
    }

    // useful functions:
    this.abs = function(x){
        return (x<0) ? -x : x;
    }

    this.animLoop = function(){
        var current,
            blocks = new Uint8ClampedArray(noblocks*noblocks),
            dw = parseInt(PAINTWIDTH/noblocks),
            dh = parseInt(PAINTHEIGHT/noblocks),
            dbw = parseInt(diff.width/noblocks),
            dbh = parseInt(diff.height/noblocks);
        cfps++;

        // looping goodness
        window.requestAnimationFrame(that.animLoop);

        // draw the webcam video
        ctx.drawImage(v, 0, 0);

        if(lastimg && PAINTWIDTH != 0){

            // Firstly create the difference blocks
            // TODO - remove the double reduce (once as current, once as lastimg)
            current = ctx.getImageData(0,0,PAINTWIDTH,PAINTHEIGHT);
            for(var i=0;i<noblocks;i++){
                for(var j=0;j<noblocks;j++){
                    var sum = 0;
                    for(var ii=dw*i;ii<dw*(i+1);ii++){
                        for(var jj=dh*j;jj<dh*(j+1);jj++){
                            // Euclidien distance nomalised to [0,255]
                            sum += that.abs(lastimg.data[4*(PAINTWIDTH*jj+ii)] - current.data[4*(PAINTWIDTH*jj+ii)]) + that.abs(lastimg.data[4*(PAINTWIDTH*jj+ii)+1] - current.data[4*(PAINTWIDTH*jj+ii)+1]) + that.abs(lastimg.data[4*(PAINTWIDTH*jj+ii)+2] - current.data[4*(PAINTWIDTH*jj+ii)+2]);
                        }
                    }

                    // max of sum = 256*noblocks^2
                    blocks[noblocks*i+j] = Math.min(255,(2*sum)/(3*noblocks*noblocks));
                }
            }

            // Print the debug
            for(var i=0;i<noblocks;i++){
                for(var j=0;j<noblocks;j++){
                    difftx.fillStyle = "rgb("+blocks[noblocks*i+j]+","+blocks[noblocks*i+j]+","+blocks[noblocks*i+j]+")";
                    difftx.fillRect(dbw*i,dbh*j,dbw,dbh);
                }
            }

            // Attempt 3 - very dumb: center of mass
            var mx=0.0, my=0.0, msum=0, store;
            for(var i=0;i<noblocks;i++){
                for(var j=0;j<noblocks;j++){
                    store = Math.max(blocks[noblocks*i+j]-dave,0);
                    mx += store*dbw*(i+0.5);
                    my += store*dbh*(j+0.5);
                    msum += store;
                }
            }
            if(msum){
                mx /= msum;
                my /= msum;

                if(timeout > 0) timeout--;
                if((1.0*msum)/dmax > 1 && timeout == 0){
                    // Ok - so need to check
                    // distance traveled over time, but time between measurements is varied!
                    // 60fps is definite max (is it?)
                    // can use the last fps as that gives a good estimate

                    // TODO: as horz and vert size different need to times vert changes by aspectRatio?

                    // ok so movment of [mindist]*width is needed in [actiontimeout]*cfps frames
                    var ls,rs,us,ds,cx,cy,pos,deltaw,deltah;
                    ls=rs=us=ds=0;
                    deltaw = mindist*diff.width;
                    deltah = mindist*diff.height;
                    for(var i=0;i<parseInt(actiontimeout*that.fps);i++){
                        pos = mp-2*i-2;
                        if(pos < 0) pos = pos+120;
                        cx = mstore[pos]; cy = mstore[pos+1];
                        if(cx >= 0 && cy >= 0){
                            if(cx > mx+deltaw) rs++;
                            if(cx < mx-deltaw) ls++;
                            if(cy > my+deltah) us++;
                            if(cy < my-deltah) ds++;
                        }
                    }

                    // print results:
                    var biggest=0, bval;
                    // set the result
                    if(rs>biggest) {biggest = rs; bval = "right";}
                    if(ls>biggest) {biggest = ls; bval = "left";}
                    if(us>biggest) {biggest = us; bval = "up";}
                    if(ds>biggest) {biggest = ds; bval = "down";}
                    if(biggest>0){
                        // send the event
                        var event = new CustomEvent("motion", {"detail":{"dir":bval}});
                        document.dispatchEvent(event);
                        // and the timeout
                        timeout = parseInt(actiontimeout*that.fps);
                    }
                    // cyclic store
                    mstore[mp++] = mx; mstore[mp++] = my;
                } else {
                    // cyclic store - not a good enough confidence
                    mstore[mp++] = -1; mstore[mp++] = -1;
                }
                mp = mp%120;

                difftx.fillStyle = (1.0*msum)/dmax > 1 ?  "rgb(0,255,0)" : "rgb("+parseInt(Math.min(255.0*msum/dmax,255))+",0,0)";
                difftx.fillRect(mx,my,10,10);
            }

            // and setup for next time
            lastimg = current;
        }else{
            // loop till it works: make sure resizing has been done
            PAINTWIDTH = c.width = v.videoWidth;  
            PAINTHEIGHT = c.height = v.videoHeight;  
            if(PAINTWIDTH > 0) lastimg = ctx.getImageData(0,0,PAINTWIDTH,PAINTHEIGHT);
        }
    }

    window.addEventListener('load',that.init);
}