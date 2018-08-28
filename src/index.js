import * as audioContext from 'audio-context';
import * as tone from 'tone';

let context;
let dogBarkingBuffer = null;
const url = './assets/Bruit_rose_10s.wav';

function onError(error) {
    console.log(`This just broke: ${error}`);
}

function loadSound(url) {
  const request = new XMLHttpRequest();
  request.open('GET', url, true);
  request.responseType = 'arraybuffer';

  // Decode asynchronously
  request.onload = function() {
    context.decodeAudioData(request.response, (buffer) => {
      dogBarkingBuffer = buffer;
    }, onError);
  }

  request.send();
}

function init() {
    try {
        window.AudioContext = window.AudioContext || window.webkitAudioContext;
        context = new AudioContext();
        loadSound(url);
    } catch (e) {
        console.log(`Unsupported browser: ${e}`);
    }
}

window.addEventListener('load', init, false);



console.log('COUCOU');