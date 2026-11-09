// STEP 1: These are the only two settings we store. Both start at 0.
let hotWater = 0;
let coldWater = 0;

// STEP 2: Calculate the results from the settings.
// A separate function makes the rules easy to read and test.
function calculateWater(hot, cold) {
  const totalFlow = hot + cold;
  let state;
  let hotShare = 0;

  // Check for no water FIRST so we never divide by zero.
  if (totalFlow === 0) {
    state = 'Off';
  } else {
    hotShare = hot / totalFlow;
    // A nearly balanced mix (40% through 60% hot) counts as Warm.
    if (hotShare >= 0.4 && hotShare <= 0.6) {
      state = 'Warm';
    } else if (hotShare > 0.6) {
      state = 'Hot';
    } else {
      state = 'Cold';
    }
  }

  // Pure red and blue blend to rgb(128, 0, 128) at equal settings.
  const red = Math.round(255 * hotShare);
  const blue = Math.round(255 * (1 - hotShare));
  const color = `rgb(${red}, 0, ${blue})`;
  return { totalFlow, state, hotShare, color };
}

// STEP 3: Update the page whenever either knob changes.
function updateSink() {
  const water = calculateWater(hotWater, coldWater);
  const stream = document.getElementById('stream');

  if (water.totalFlow === 0) {
    stream.style.display = 'none';
    document.getElementById('mix').textContent = '—';
  } else {
    stream.style.display = 'block';
    stream.style.width = `${6 + water.totalFlow * 3}px`;
    stream.style.backgroundColor = water.color;
    const hotPercent = Math.round(water.hotShare * 100);
    document.getElementById('mix').textContent = `${hotPercent}% / ${100 - hotPercent}%`;
  }

  document.getElementById('water-state').textContent = water.state;
  document.getElementById('total-flow').textContent = water.totalFlow;
  updateKnob('hot', hotWater);
  updateKnob('cold', coldWater);
}

function updateKnob(name, value) {
  const knob = document.getElementById(`${name}-knob`);
  // Six settings span 270 degrees: 54 degrees per step.
  knob.querySelector('.handle').style.transform = `rotate(${-135 + value * 54}deg)`;
  knob.setAttribute('aria-valuenow', value);
  knob.setAttribute('aria-valuetext', `${value} of 5${value === 0 ? ', off' : ''}`);
  document.getElementById(`${name}-value`).textContent = value;
}

// Keep every change inside the allowed whole-number range.
function setKnob(name, value) {
  const setting = Math.max(0, Math.min(5, Math.round(value)));
  if (name === 'hot') {
    hotWater = setting;
  } else {
    coldWater = setting;
  }
  updateSink();
}

// STEP 4: Event handlers turn dragging, scrolling, and keys into settings.
function connectKnob(name) {
  const knob = document.getElementById(`${name}-knob`);
  let previousAngle = null;
  let turningValue = 0;
  let activePointer = null;

  function pointerAngle(event) {
    const bounds = knob.getBoundingClientRect();
    const x = event.clientX - (bounds.left + bounds.width / 2);
    const y = event.clientY - (bounds.top + bounds.height / 2);
    // At the very center there is no useful turning direction.
    if (Math.hypot(x, y) < 10) return null;
    // atan2 finds the angle around the center; convert radians to degrees.
    return Math.atan2(y, x) * 180 / Math.PI;
  }

  knob.addEventListener('pointerdown', function (event) {
    if (activePointer !== null || event.button !== 0) return;
    activePointer = event.pointerId;
    previousAngle = pointerAngle(event);
    turningValue = name === 'hot' ? hotWater : coldWater;
    knob.setPointerCapture(event.pointerId);
    knob.focus();
  });

  knob.addEventListener('pointermove', function (event) {
    if (event.pointerId !== activePointer) return;
    const angle = pointerAngle(event);
    if (angle !== null && previousAngle !== null) {
      let change = angle - previousAngle;
      // Crossing from 179 to -179 degrees is a small turn, not a full spin.
      if (change > 180) change -= 360;
      if (change < -180) change += 360;
      // Clockwise increases the setting. Each step covers 54 degrees.
      turningValue = Math.max(0, Math.min(5, turningValue + change / 54));
      setKnob(name, turningValue);
    }
    previousAngle = angle;
  });

  function finishDrag(event) {
    if (event.pointerId === activePointer) {
      activePointer = null;
      previousAngle = null;
    }
  }
  knob.addEventListener('pointerup', finishDrag);
  knob.addEventListener('pointercancel', finishDrag);
  knob.addEventListener('lostpointercapture', finishDrag);

  knob.addEventListener('keydown', function (event) {
    const value = name === 'hot' ? hotWater : coldWater;
    if (event.key === 'ArrowUp' || event.key === 'ArrowRight') {
      event.preventDefault();
      setKnob(name, value + 1);
    } else if (event.key === 'ArrowDown' || event.key === 'ArrowLeft') {
      event.preventDefault();
      setKnob(name, value - 1);
    } else if (event.key === 'Home' || event.key === 'End') {
      event.preventDefault();
      setKnob(name, event.key === 'Home' ? 0 : 5);
    }
  });

  knob.addEventListener('wheel', function (event) {
    event.preventDefault();
    const value = name === 'hot' ? hotWater : coldWater;
    if (event.deltaY !== 0) setKnob(name, value + (event.deltaY < 0 ? 1 : -1));
  }, { passive: false });
}

connectKnob('hot');
connectKnob('cold');

// STEP 5: The reset button changes both variables, then redraws the sink.
document.getElementById('off-button').addEventListener('click', function () {
  hotWater = 0;
  coldWater = 0;
  updateSink();
});

updateSink();
