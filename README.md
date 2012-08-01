# Mocap.js - motion capture for webpages

## Intro
So it's been 10 years since minority report came out, and I think the question that came to everyone's mind was "how close are we to being able to do that cool user interface in a browser?"...just me?...

Anyway, here's a basic direction capture library that's at least a start, check out the explainitory demo [here](http://pci.github.com/mocap_js/demo/).

## Usage: (subject to change)
    <!DOCTYPE html>
    <html>
    <head>
      <title>Demo</title>
    </head>
    <body>
      <div id='output'></div>
    
      <script src="./js/mocap.js"></script>
      <script>
        var ms = new motionSensor();
        
        document.addEventListener('motion', function(e){
          document.getElementById('output').innerHTML = e.detail.dir;
        });
      </script>
    </body>

## Browser Support
### Gold standard
*    Chrome - full support for mocap.js
*    Opera - full support for mocap.js, but doesn't support the 3D transforms used in the demo

### Silver
*    Firefox - currently works in nightly (FF17), but requires a [settings flag](http://hacks.mozilla.org/2012/07/getusermedia-is-ready-to-roll/)

### Bronze
*    IE - not on <10, not sure about 10 indications are good though

### Wooden Spoon
*    Safari - doesn't yet support getUserMedia

## License
Licensed under a MIT license, see http://pci.mit-license.org/