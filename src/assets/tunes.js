// src/assets/tunes.js
export const stranger_tune = `
globalThis.SPEED  ??= 1;
globalThis.VOLUME ??= 0.75;

globalThis.KICK  ??= 1;
globalThis.CHAT  ??= 1;
globalThis.SNARE ??= 1;
globalThis.BASS  ??= 1;
globalThis.ARP   ??= 1;

const BASE_CPS = 135/60/4;
setcps(BASE_CPS * globalThis.SPEED);

// samples
samples({
  kick_fleece:   'Kicks/fleece.wav',
  chat_goodtime: 'CHats/goodtime.wav',
  snare_love:    'Snare/love.wav',
}, 'https://raw.githubusercontent.com/arcathrax/Samples/main/');


const gate = (on, pat) => on ? pat : pat.mask("<0!999>");

let chat = gate(globalThis.CHAT,
  n("c")
    .struct("<[ - x ] [ - [ x!2]]>*4")
    .scale("G1:minor")
    .sound("chat_goodtime")
    .gain(0.3)
);

let snare = gate(globalThis.SNARE,
  n("< - 3>*4")
    .scale("G1:minor")
    .sound("snare_love")
);

let kick = gate(globalThis.KICK,
  n("<3>*4")
    .scale("G1:minor")
    .sound("kick_fleece")
);

let bass = gate(globalThis.BASS,
  n("<0 2 4 3>")
    .scale("G1:minor")
    .s("saw")
    .orbit(2)
    .gain(1.0)
);

let arp = gate(globalThis.ARP,
  n("<[3 4] [1@3 5] [4 2 1!2] [2@3 4]>")
    .scale("G4:minor")
    .s("square")
    .decay(0.5)
    .delay(0.25)
    .delayfeedback(0.25)
    .orbit(3)
    .gain(0.75)
);

let drums   = stack(kick, chat, snare);
let intro   = stack(bass);
let buildUp = stack(bass, kick);
let drop    = stack(kick, arp);
let main    = stack(drums, bass, arp);

$: arrange(
  [16, buildUp],
  [ 2, bass],
  [ 2, drop],
  [16, main],
  [16, buildUp],
);

// master volume
all(x => x.postgain((globalThis.VOLUME ?? 0.75)));
`;
