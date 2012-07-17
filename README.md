# Mocap.js - motion capture for webpages

## Intro
So it's been 10 years since minority report came out, and I think the question that came to everyone's mind was "how close are we to being able to do that cool user interface in a browser?"...just me?...

Anyway, here's a basic direction capture library that's at least a start, check out the explainitory video here (need link)

## Spec (subject to change)
*   init object: ms = new motionSensor()
*   TODO: init w/ options: ms = new motionSensor({allowedActions: ['left','right'])
*   TODO: start calibration: ms.startCal()
*   register listener: document.addEventListener('motion', function(e){console.log(e.detail.dir);})

## Browser Support
### Gold standard
*    Chrome - full support for mocap.js
*    Opera - full support for mocap.js, but doesn't support the 3D transforms used in the demo
### Silver
*    Firefox - getUserMedia is in nightly (FF16) at the moment, but currently has a bug in writing to a canvas
### Bronze
*    IE - not on <10, not sure about 10 indications are good though
### Wooden Spoon
*    Safari - doesn't yet support getUserMedia

## License
Licensed under a MIT license, see http://pci.mit-license.org/