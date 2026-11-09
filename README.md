# The mixing sink

Open `index.html` in your browser. No installation or server is needed. Keep all three code files in the same folder.

## 1. Store the settings

In `script.js`, `hotWater` and `coldWater` are whole numbers from 0 to 5. These are the model's inputs. We calculate the other values instead of storing more settings that could get out of sync.

## 2. Calculate flow and mix

`calculateWater()` adds the inputs to get total flow. If total flow is zero, the state is Off. Otherwise, a hot share from 40% through 60% means Warm (including both endpoints). Above 60% means Hot; below 40% means Cold. For example, hot 3 and cold 2 is 3 / 5 = 60%, so it is Warm. These labels describe the balance, not measured degrees. The color still uses the exact proportions, so a Warm stream can be slightly redder or bluer than purple.

The hot share is `hot / totalFlow`. For 3 hot and 1 cold, this is 3 / 4, or 75%. The color gets 75% of the red channel and 25% of the blue channel. Equal flowing settings always give the same purple because their ratio is always one half.

## 3. Show the result

`index.html` supplies the sink parts, controls, and readouts. `style.css` draws the basin, central faucet, and knobs. `updateSink()` connects the calculation to those elements: it changes text, stream color, and width. Zero total flow hides the stream. `updateKnob()` rotates each handle and updates its accessible value.

## 4. Handle user actions

`connectKnob()` attaches event handlers. Drag around a knob clockwise to increase its setting or counterclockwise to decrease it. `pointerAngle()` uses `Math.atan2()` to find your pointer's angle around the knob's center. Each move compares the new angle with the previous angle; every 54 degrees changes the setting by one. Small turns accumulate before rounding, and the setting stops at 0 or 5. Starting a drag does not jump the setting. Crossing the angle boundary is handled as a small turn. Moving through the center pauses angle tracking to avoid sudden jumps.

You can also scroll over a knob, or focus it using Tab and press arrow keys. Home closes a knob and End opens it fully. `setKnob()` rounds and limits every setting to 0–5.

## 5. Reset

The Turn both off button sets both variables to zero, then calls `updateSink()` so the handles, stream, and labels all agree.

## Try these checks

| Hot | Cold | Expected state | Total flow | Expected stream |
| --- | --- | --- | --- | --- |
| 0 | 0 | Off | 0 | Hidden |
| 5 | 0 | Hot | 5 | Red |
| 0 | 5 | Cold | 5 | Blue |
| 1 | 1 | Warm | 2 | Purple, narrow |
| 3 | 3 | Warm | 6 | Same purple, wider |
| 5 | 5 | Warm | 10 | Same purple, widest |
| 3 | 2 | Warm | 5 | Slightly redder |
| 2 | 3 | Warm | 5 | Slightly bluer |
| 3 | 1 | Hot | 4 | More red |
| 1 | 3 | Cold | 4 | More blue |

Finally press Turn both off. Both handles and readouts should return to zero and the stream should disappear.

The JavaScript calculations were checked for all 36 combinations using a simulated page, along with reset, keyboard limits, and pointer dragging. Browser layout and real-device input still need a visual check.
