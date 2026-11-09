# Modeling a Sink

A sink model made with HTML, CSS, and JavaScript. It has separate hot and cold knobs with settings from 0 to 5.

## How to use it

Download the files and open `index.html` in a browser. Keep `style.css` and `script.js` in the same folder.

Turn a knob clockwise to increase flow or counterclockwise to decrease it. You can also use the arrow keys after selecting a knob. Click **Turn both off** to reset the sink.

## How it works

The total of the hot and cold settings controls the stream width. Their proportions control the color: hot is red, cold is blue, and an equal mix is purple.

The label is Warm when hot water makes up 40% to 60% of the flow. Above that range is Hot; below it is Cold. Both knobs at 0 means Off. These labels represent a simplified mix rather than temperatures in degrees.

## Files

- `index.html`: page structure and controls
- `style.css`: sink appearance and layout
- `script.js`: knob interactions, flow, color, and reset
