# Minority.js - motion control for webpages

Spec:

init object: mr = new minorityCont()
init w/ options: mr = new minorityCont({allowedActions: ['left','right'])
start calibration: mr.startCal()
register listener: mr.addEventListener('action', function(e){console.log(e.action);})