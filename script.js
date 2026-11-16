const audio = document.querySelector('#audio');
const scene = document.querySelector('#scene');
const buttons = [...document.querySelectorAll('[data-time]')];
const scenes = [
  {
    time: 0,
    style: 'street',
    place: 'OUTSIDE',
    title: 'Along the street',
    description: 'Rain falls. Cars pass in the distance.'
  },
  {
    time: 25,
    style: 'walking',
    place: 'ON THE WAY',
    title: 'A few steps from home',
    description: 'Footsteps meet the wet pavement.'
  },
  {
    time: 44,
    style: 'door',
    place: 'AT THE DOOR',
    title: 'The turn of a key',
    description: 'Keys rattle. The door opens, then closes.'
  },
  {
    time: 50.44,
    style: 'inside',
    place: 'HOME',
    title: 'Rain beyond the window',
    description: 'The street fades into a quieter room.'
  }
];
function updateScene() {
  const current = scenes.filter(item => audio.currentTime >= item.time).pop() || scenes[0];
  scene.className = `scene ${current.style} ${audio.paused ? 'paused' : ''}`;
  scene.setAttribute('aria-label', current.title);
  document.querySelector('#location').textContent = current.place;
  document.querySelector('#scene-title').textContent = current.title;
  document.querySelector('#description').textContent = current.description;
  buttons.forEach((button, index) => button.setAttribute('aria-current', String(scenes[index] === current)));
}
buttons.forEach(button => button.addEventListener('click', () => {
  audio.currentTime = Number(button.dataset.time);
  updateScene();
}));
audio.addEventListener('timeupdate', updateScene);
audio.addEventListener('seeked', updateScene);
audio.addEventListener('play', () => {
  updateScene();
  document.querySelector('#status').textContent = 'Playing · Use the progress bar or scene buttons to explore.';
});
audio.addEventListener('pause', () => {
  updateScene();
  document.querySelector('#status').textContent = 'Paused · Press play to continue.';
});
audio.addEventListener('ended', () => {
  document.querySelector('#status').textContent = 'Home at last. Press play to listen again.';
});
audio.addEventListener('error', () => {
  document.querySelector('#status').textContent = 'Audio could not load. Keep the assets folder beside index.html.';
});
updateScene();

const toggle = document.querySelector('#toggle');
const clock = document.querySelector('#clock');
const seek = document.querySelector('#seek');
const speed = document.querySelector('#speed');

function formatTime(seconds) {
  const total = Math.floor(seconds);
  return Math.floor(total / 60) + ':' + String(total % 60).padStart(2, '0');
}

function updatePlayback() {
  const duration = Number.isFinite(audio.duration) ? audio.duration : 75;
  seek.max = duration;
  seek.value = audio.currentTime;
  clock.textContent = formatTime(audio.currentTime) + ' / ' + formatTime(duration);
  toggle.textContent = audio.paused ? 'Play' : 'Pause';
}

toggle.addEventListener('click', async () => {
  if (!audio.paused) {
    audio.pause();
    return;
  }

  try {
    await audio.play();
  } catch {
    document.querySelector('#status').textContent = 'Audio could not play.';
  }
});

seek.addEventListener('input', () => {
  audio.currentTime = Number(seek.value);
});

speed.addEventListener('change', () => {
  audio.playbackRate = Number(speed.value);
});

for (const event of ['loadedmetadata', 'timeupdate', 'seeked', 'play', 'pause', 'ended']) {
  audio.addEventListener(event, updatePlayback);
}
