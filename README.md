# Mocap.js - motion capture for webpages

## Intro
So it's been 10 years since minority report came out, and I think the question that came to everyone's mind was "how close are we to being able to do that cool user interface in a browser?"...just me?...

Anyway, here's a basic direction capture library that's at least a start, check out the explainitory video here (need link)

## Spec (subject to change)
init object: mr = new minorityCont()
init w/ options: mr = new minorityCont({allowedActions: ['left','right'])
start calibration: mr.startCal()
register listener: document.addEventListener('motion', function(e){console.log(e.detail.dir);})

## License
Licensed under a MIT license, see http://pci.mit-license.org/