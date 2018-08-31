console.log('No pain, no pain');

const audioContext = new AudioContext();

// inspire toi de ça pour charger le fichier audio
// https://jsfiddle.net/torinmb/507nb7c6/21/

// definition de la source
// const source = new Tone.Player('./assets/Bruit_rose_10s.wav');
const source = new Tone.Player('./assets/Bon Jovi - You give love a bad name.mp3'); // TODO charger fichier venant de l'html
source.volume.value = -20;
source.autostart = true;
source.loop = true;

const EQUALIZER_SIMPLE = [16, 31.5, 63, 125, 250, 500, 1000, 2000, 4000, 8000, 16000];
const EQUALIZER_TRIPLE = [10, 12.5, 16, 20, 25, 31.5, 40, 50, 63, 80, 100, 125, 160, 200, 250, 315, 400, 500, 630, 800, 1000, 1250, 1600, 2000, 2500, 3150, 4000, 5000, 6300, 8000, 10000, 12500, 16000, 20000];

let isSimple = false;

// initialise chaque frequence a neutre
/**
 * Basic setup for gain nodes
 * @param {*} frequence number
 * @param {*} tiersOctave boolean
 */
const equalizerSetup = function(frequence, tiersOctave) {
    const filter = Tone.context.createBiquadFilter();
    filter.type = 'peaking';
    filter.frequency.value = frequence;
    filter.Q.value = tiersOctave ? 4.31 : 1.4;
    filter.gain.value = 0;
    return filter;
}

// choisir simple ou triple octave
const equalizerBands = isSimple ? EQUALIZER_SIMPLE.map(equalizerSetup, false) : EQUALIZER_TRIPLE.map(equalizerSetup, true);

// fonction pour changer une frequence
const changeFrequenceGain = function(frequenceIndex, value) {
    equalizerBands[frequenceIndex].gain.value = value;
}

// lie tous les filtres
source.connect(equalizerBands[0]);
equalizerBands.forEach((eq, index) => {
    if (index < equalizerBands.length - 1) {
        eq.connect(equalizerBands[index + 1]);
        changeFrequenceGain(index, 30);
    } else {
        eq.toMaster();
    }
});

// produire inverse
const revertChange = function() {
    // parcourir equalizerBands, get all gains in an array
    // apply negative value of each gain to each equalizerBands (might alter result obtained)
}
