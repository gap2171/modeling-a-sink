// Each knob controls flow from 0 (off) to 5 (fully open).
let hotWater = 0;
let coldWater = 0;

const hotControl = document.getElementById('hot');
const coldControl = document.getElementById('cold');
const water = document.getElementById('water');

function updateSink() {
  const totalFlow = hotWater + coldWater;
  let temperature;
  let color;

  if (totalFlow === 0) {
    temperature = 'Off';
  } else {
    // Proportion of hot water, not a temperature in degrees.
    const hotShare = hotWater / totalFlow;
    if (hotShare < 0.4) {
      temperature = 'Cold';
      color = '#4086d6';
    } else if (hotShare > 0.6) {
      temperature = 'Hot';
      color = '#d66a48';
    } else {
      temperature = 'Warm';
      color = '#8f71b5';
    }
  }

  for (const [control, value] of [[hotControl, hotWater], [coldControl, coldWater]]) {
    control.setAttribute('aria-valuenow', value);
    control.setAttribute('aria-valuetext', value === 0 ? 'Off' : value + ' of 5');
    control.querySelector('.handle').style.transform = 'rotate(' + (-135 + value * 54) + 'deg)';
  }
  document.getElementById('hotValue').textContent = hotWater;
  document.getElementById('coldValue').textContent = coldWater;
  document.getElementById('temperature').textContent = temperature;
  document.getElementById('flow').textContent = totalFlow + ' / 10';
  water.style.display = totalFlow === 0 ? 'none' : 'block';
  water.style.width = (5 + totalFlow * 3) + 'px';
  water.style.transform = 'translateX(-50%)';
  water.style.backgroundColor = color || 'transparent';
}

// Pointer events let the user turn a knob around its center.
function connectKnob(control, isHot) {
  function setValue(value) {
    value = Math.max(0, Math.min(5, value));
    if (isHot) hotWater = value;
    else coldWater = value;
    updateSink();
  }

  function turn(event) {
    const bounds = control.getBoundingClientRect();
    const x = event.clientX - (bounds.left + bounds.width / 2);
    const y = event.clientY - (bounds.top + bounds.height / 2);
    if (Math.hypot(x, y) < 12) return;
    const angle = Math.atan2(x, -y) * 180 / Math.PI;
    const limitedAngle = Math.max(-135, Math.min(135, angle));
    setValue(Math.round((limitedAngle + 135) / 270 * 5));
  }

  control.addEventListener('pointerdown', function (event) {
    if (event.button !== 0) return;
    control.focus();
    control.setPointerCapture(event.pointerId);
    turn(event);
  });
  control.addEventListener('pointermove', function (event) {
    if (control.hasPointerCapture(event.pointerId)) turn(event);
  });
  function finish(event) {
    if (control.hasPointerCapture(event.pointerId)) control.releasePointerCapture(event.pointerId);
  }
  control.addEventListener('pointerup', finish);
  control.addEventListener('pointercancel', finish);
  control.addEventListener('keydown', function (event) {
    const value = isHot ? hotWater : coldWater;
    if (['ArrowUp', 'ArrowRight', 'ArrowDown', 'ArrowLeft', 'Home', 'End'].includes(event.key)) {
      event.preventDefault();
      if (event.key === 'Home') setValue(0);
      else if (event.key === 'End') setValue(5);
      else setValue(value + (['ArrowUp', 'ArrowRight'].includes(event.key) ? 1 : -1));
    }
  });
}
connectKnob(hotControl, true);
connectKnob(coldControl, false);

document.getElementById('reset').addEventListener('click', function () {
  hotWater = 0;
  coldWater = 0;
  updateSink();
});

updateSink();
