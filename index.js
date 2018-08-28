console.log('Gonna rain');

const audioContext = new AudioContext();
const synth = new Tone.Synth({
    envelope: {
        attack: 1
    }
}).toMaster();

const EQUALIZER_CENTER_FREQUENCIES = [
    315,400,500,
    630,800,1000,
    1250,1600,2000,
    2500,3150,4000,
    5000,6300,8000,
    10000,12500,16000,
    20000,
];

fetch('./assets/Bruit_rose_10s.wav')
    .then(response => response.arrayBuffer()) // receive
    .then(arrayBuffer => audioContext.decodeAudioData(arrayBuffer)) // decode
    .then(audioBuffer => {
        const sourceNode = audioContext.createBufferSource();
        sourceNode.buffer = audioBuffer;

        // options
        sourceNode.loop = true;

        const gainNode = audioContext.createGain();
        gainNode.gain.value = 0.03;

        sourceNode.connect(gainNode);
        gainNode.connect(audioContext.destination);

        sourceNode.start();
    })
    .catch(e =>console.error(e));