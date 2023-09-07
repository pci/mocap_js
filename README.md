# Mocap.js - motion capture for webpages

## Intro

So it's been ~10~ 20 years since minority report came out, and I think the question that came to everyone's mind was "how close are we to being able to do that cool user interface in a browser?"...just me?...

Anyway, here's a basic direction capture library that's at least a start, check out the explanatory demo [here](http://pci.github.com/mocap_js/demo/).

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

[Pretty much everywhere](https://caniuse.com/?search=getUserMedia), except if you like to roll with IE, Opera Mini, or Lynx web browsers.

## License

Licensed under a MIT license, see http://pci.mit-license.org/
