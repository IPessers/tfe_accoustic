// definition de la source en prenant le fichier donne par l'utilisateur dans la balise input
const sourceFile = $('#audio_file');

// Export file draft
// var rate = 22050;

// function exportWAV(type, before, after){
//     if (!before) { before = 0; }
//     if (!after) { after = 0; }

//     var channel = 0,
//         buffers = [];
//     for (channel = 0; channel < numChannels; channel++){
//         buffers.push(mergeBuffers(recBuffers[channel], recLength));
//     }

//     var i = 0,
//         offset = 0,
//         newbuffers = [];

//     for (channel = 0; channel < numChannels; channel += 1) {
//         offset = 0;
//         newbuffers[channel] = new Float32Array(before + recLength + after);
//         if (before > 0) {
//             for (i = 0; i < before; i += 1) {
//                 newbuffers[channel].set([0], offset);
//                 offset += 1;
//             }
//         }
//         newbuffers[channel].set(buffers[channel], offset);
//         offset += buffers[channel].length;
//         if (after > 0) {
//             for (i = 0; i < after; i += 1) {
//                 newbuffers[channel].set([0], offset);
//                 offset += 1;
//             }
//         }
//     }

//     if (numChannels === 2){
//         var interleaved = interleave(newbuffers[0], newbuffers[1]);
//     } else {
//         var interleaved = newbuffers[0];
//     }

//     var downsampledBuffer = downsampleBuffer(interleaved, rate);
//     var dataview = encodeWAV(downsampledBuffer, rate);
//     var audioBlob = new Blob([dataview], { type: type });

//     this.postMessage(audioBlob);
// }

// document.getElementById('export').addEventListener('click', function () {
//     // export original recording
//     module.recorder.exportWAV(function(blob) {
//         var url = URL.createObjectURL(blob),
//             li = document.createElement('li'),
//             au = document.createElement('audio'),
//             hf = document.createElement('a');

//         au.controls = true;
//         au.src = url;
//         hf.href = url;
//         hf.download = new Date().toISOString().replace('T', '-').slice(0, -5) + '.wav';
//         hf.innerHTML = hf.download;
//         li.appendChild(au);
//         li.appendChild(hf);
//         document.getElementById('downloads').appendChild(li);
//     });
// });

// enregitre le son avec les modifications de l'utilisateur pour pouvoir l'exporter avec apres
let recorder;
const startRecording = function() {
    Tone.context.createMediaStreamDestination();
    navigator.getUserMedia = navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia;
    navigator.getUserMedia({audio: true}, function (stream) {
        const input = Tone.context.createMediaStreamSource(stream);
        recorder = new Recorder(input);
        recorder.clear();
        recorder.startTime = Tone.context.currentTime;
        recorder.record();
    });
};

// arrete l enregistrement pour creer le fichier 
const stopRecordingAndExport = function(callback) {
    recorder.stop();
    recorder.getBuffer(function (buffers) {
        callback(buffers);
    });
}


const sourceAltered = new Tone.Player(sourceFile, function() {
    // permet au boutton selectionne de jouer le son avec les modifications de l'utilisateur
    const playButton = document.querySelector('#playSortieCircle');
	playButton.addEventListener('click', () => {
        player.start(new Tone.now());
        startRecording();
    });

    // permet au bouton selectionnne d arreter de jouer le e son avec les modifications de l'utilisateur
    document.querySelector('#boutonPauseSortie').addEventListener('click', () => {
        player.stop();
    });
});
sourceAltered.volume.value = -20;
sourceAltered.autostart = false;
sourceAltered.loop = true;

const sourceCheck = new Tone.Player(sourceFile, function() {
    // permet au boutton selectionne de jouer le son de verification de l'integrite de la source
    const playButton = document.querySelector('#boutonPlayEntree');
	playButton.addEventListener('click', () => {
        player.start(new Tone.now());
    });

    // permet au boutton selectionne d arreter de jouer le son de verification de l'integrite de la source
    document.querySelector('#boutonPauseEntree').addEventListener('click', () => {
        player.stop();
    });
});
sourceCheck.volume.value = -20;
sourceCheck.autostart = false;
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

if (isSimple) {
    // octave
    for (let compteur = 0; compteur < EQUALIZER_SIMPLE.length; compteur = compteur + 1) {
        $('.octave' + (compteur + 1)).addEventListener('change')
    }
} else {
    // 3/3
}

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
