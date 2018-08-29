console.log('No pain, no pain');

const audioContext = new AudioContext();

// definition de la source
const source = new Tone.Player('./assets/Bruit_rose_10s.wav');
source.volume.value = -20;
source.autostart = true;
source.loop = true;

const EQUALIZER_SIMPLE = [16, 31.5, 63, 125, 250, 500, 1000, 2000, 4000, 8000, 16000];
const EQUALIZER_TRIPLE = [10, 12.5, 16, 20, 25, 31.5, 40, 50, 63, 80, 100, 125, 160, 200, 250, 315, 400, 500, 630, 800, 1000, 1250, 1600, 2000, 2500, 3150, 4000, 5000, 6300, 8000, 10000, 12500, 16000, 20000];

let isSimple = false;

// initialise chaque frequence a neutre
const equalizerSetup = function(frequence) {
    const filter = Tone.context.createBiquadFilter();
    filter.type = 'peaking';
    filter.frequency.value = frequence;
    filter.Q.value = 4.31;
    filter.gain.value = 0;
    return filter;
}

// choisir simple ou triple octave
const equalizerBands = isSimple ? EQUALIZER_SIMPLE.map(equalizerSetup) : EQUALIZER_TRIPLE.map(equalizerSetup);

// lie tous les filtres
source.connect(equalizerBands[0]);
equalizerBands.forEach((eq, index) => {
    if (index < equalizerBands.length - 1) {
        eq.connect(equalizerBands[index + 1]);
    } else {
        eq.toMaster();
    }
});

// equalizerBands.connect();

// var player = new Tone.Player("./assets/Bruit_rose_10s.wav").toMaster();
// //play as soon as the buffer is loaded
// player.autostart = true;
// // player.loop = true;

// fetch('./assets/Bruit_rose_10s.wav')
//     .then(response => response.arrayBuffer()) // receive
//     .then(arrayBuffer => audioContext.decodeAudioData(arrayBuffer)) // decode
//     .then(audioBuffer => {
//         const sourceNode = audioContext.createBufferSource();
//         sourceNode.buffer = audioBuffer;

//         // options
//         sourceNode.loop = true;

//         const filter = context.createBiquadFilter();

//         const gainNode = audioContext.createGain();
//         gainNode.gain.value = 0.03;

//         sourceNode.connect(gainNode);
//         gainNode.connect(audioContext.destination);

//         sourceNode.start();

//     })
//     .catch(e =>console.error(e));