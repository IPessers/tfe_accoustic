console.log('No pain, no pain');

const audioContext = new AudioContext();

// inspire toi de ça pour charger le fichier audio
// https://jsfiddle.net/torinmb/507nb7c6/21/

// definition de la source
// const source = new Tone.Player('./assets/Bruit_rose_10s.wav');
const sourceFile = './assets/Bon Jovi - You give love a bad name.mp3';
let recorder;
const startRecording = function() {
    Tone.context.createMediaStreamDestination();
    navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia;
    navigator.getUserMedia({audio: true}, function (stream) {
        const input = Tone.context.createMediaStreamSource(stream);
        recorder = new Recorder(input);
    });
};

const sourceAltered = new Tone.Player(sourceFile, function() {
    const playButton = document.querySelector('REPLACE_ME'); // ============== ICI AXEL, faut arriver en Jquery à pointer sur le boutton play de la version user

	playButton.addEventListener('click', () => {
        player.start(new Tone.now());
        startRecording();
    });

    document.querySelector('REPLACE_ME').addEventListener('click', () => { // ============== ICI AXEL, faut arriver en Jquery à pointer sur le boutton stop de la version user
        player.stop();
    });
}); // TODO charger fichier venant de l'html
sourceAltered.volume.value = -20;
sourceAltered.autostart = true;
sourceAltered.loop = true;

const sourceCheck = new Tone.Player(sourceFile, function() {
    const playButton = document.querySelector('REPLACE_ME'); // ============== ICI AXEL, faut arriver en Jquery à pointer sur le boutton play de la version check

	playButton.addEventListener('click', () => {
        player.start(new Tone.now());
    });

    document.querySelector('REPLACE_ME').addEventListener('click', () => { // ============== ICI AXEL, faut arriver en Jquery à pointer sur le boutton stop de la version check
        player.stop();
    });
}); // TODO charger fichier venant de l'html
sourceCheck.volume.value = -20;
sourceCheck.autostart = true;
sourceCheck.loop = true;

const EQUALIZER_SIMPLE = [16, 31.5, 63, 125, 250, 500, 1000, 2000, 4000, 8000, 16000];
const EQUALIZER_TRIPLE = [10, 12.5, 16, 20, 25, 31.5, 40, 50, 63, 80, 100, 125, 160, 200, 250, 315, 400, 500, 630, 800, 1000, 1250, 1600, 2000, 2500, 3150, 4000, 5000, 6300, 8000, 10000, 12500, 16000, 20000];

let isSimple = false; // ============== ICI AXEL, tu dois faire changer la valeur en fonction de ton sélecteur de fréquences (1/3 ou 3/3)
// Tu peux t'en sortir à coup de JQuery 'si option selectionne dans mon selecteur est 1/3 alors true sinon false

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
let equalizerBands;
let equalizerCheck;

if (isSimple) {
    // 1/3 octave
    equalizerBands = EQUALIZER_SIMPLE.map(equalizerSetup, false); // changes of the user
    equalizerCheck = EQUALIZER_SIMPLE.prototype.concat(EQUALIZER_SIMPLE).map(equalizerSetup, false); // revert check changes
} else {
    // octave
    equalizerBands = EQUALIZER_TRIPLE.map(equalizerSetup, true);
    equalizerCheck = EQUALIZER_TRIPLE.prototype.concat(EQUALIZER_TRIPLE).map(equalizerSetup, true);
}

// fonction pour changer une frequence
// ============================================ ICI AXEL => add eventListener avec changeFrequenceGain(index, gain) sur chaque champ de gain
const changeFrequenceGain = function(frequenceIndex, value) {
    // change frequence value for alterd result
    equalizerBands[frequenceIndex].gain.value = value;

    // change frequence value like the previous one to have the change wanted by the user
    // and do the opposite on the same frequence but on a different node to prove the quality
    equalizerCheck[frequenceIndex].gain.value = value;
    equalizerCheck[frequenceIndex + equalizerBands.length].gain.value = -value;
}


// TODO merge in 1
// lie tous les filtres
sourceAltered.connect(equalizerBands[0]);
equalizerBands.forEach((eq, index) => {
    if (index < equalizerBands.length - 1) {
        eq.connect(equalizerBands[index + 1]);
    } else {
        eq.toMaster();
    }
});

// lie les filtres inverses pour la vérification
sourceCheck.connect(equalizerCheck[0]);
equalizerCheck.forEach((eq, index) => {
    if (index < equalizerCheck.length - 1) {
        eq.connect(equalizerCheck[index + 1]);
    } else {
        eq.toMaster();
    }
});
