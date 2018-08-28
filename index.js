console.log('Gonna rain');

const audioContext = new AudioContext();
const synth = new Tone.Synth({
    envelope: {
        attack: 1
    }
}).toMaster()
synth.triggerAttackRelease('C4', 1);

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