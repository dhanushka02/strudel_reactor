// src/assets/tunes.js
export const stranger_tune = `

// UI Controled Flags (preprocessed)
const KICK_ON = <KICK_ON>;
const CHAT_ON = <CHAT_ON>;
const SNARE_ON = <SNARE_ON>;
const BASS_ON  = <BASS_ON>;
const ARP_ON   = <ARP_ON>;



globalThis.SPEED ??= 1;
globalThis.VOLUME ??= 0.75;

// Tempo (135 BPM / 4) with UI speed multiplier
const BASE_CPS = 135/60/4
setcps(BASE_CPS * globalThis.SPEED)

// Sample map
samples({
  kick_crimewave: 'Kicks/crimewave.wav',
  kick_fleece:    'Kicks/fleece.wav',
  kick_heroes:    'Kicks/heroes.wav',
  kick_nightmare: 'Kicks/nightmare.wav',
  kick_pictures:  'Kicks/pictures.wav',
  kick_private:   'Kicks/private.wav',
  kick_138:       'Kicks/138.wav',
  kick_suffer:    'Kicks/suffer.wav',

  chat_chained:   'CHats/chained.wav',
  chat_goodtime:  'CHats/goodtime.wav',

  ohat:           'OHats/spell.wav',

  clap_electric:  'Claps/ELECTRIC.wav',
  clap_verbclap:  'Claps/VERBCLAP.wav',
  clap_simplify:  'Claps/simplify.wav',
  clap_vision:    'Claps/vision.wav',

  snare_aching:   'Snare/aching.wav',
  snare_love:     'Snare/love.wav',
  snare_vanished: 'Snare/vanished.wav',
}, 'https://raw.githubusercontent.com/arcathrax/Samples/main/')

// Parts
let chat = n("c")
  .struct("<[ - x ] [ - [ x!2]]>*4")
  .scale("G1:minor")
  .sound("chat_goodtime")
  .gain(0.3)

if (!CHAT_ON) chat = chat.mask("<0!999>"); //mute

let snare = n("< - 3>*4")
  .scale("G1:minor")
  .sound("snare_love")

if (!SNARE_ON) snare = snare.mash("<0!999>");

let kick = n("<3>*4")
  .scale("G1:minor")
  .sound("kick_fleece")
// .duckorbit("2:3")
// .duckdepth(1)
// .duckattack(0.25)

if (!KICK_ON) kick = kick.mask("<0!999>");

let bass = n("<0 2 4 3>")
  .scale("G1:minor")
  .s("saw")          // use built-in synths: "sine" | "square" | "saw" | "triangle"
  .orbit(2)
  .gain(1.0)

if (!BASS_ON) bass = bass.mask("<0!999>");

let arp = n("<[3 4] [1@3 5] [4 2 1!2] [2@3 4]>")
  .scale("G4:minor")
  .s("square")
  .decay(0.5)
  .delay(0.25)
  .delayfeedback(0.25)
  .orbit(3)
  .gain(0.75)
// ._punchcard()

if (!ARP_ON) arp = arp.mask("<0!999>");

let drums   = stack(kick, chat, snare)
let intro   = stack(bass)
let buildUp = stack(bass, kick)
let drop    = stack(kick, arp)
let main    = stack(drums, bass, arp)

// >>> EMIT the arrangement
$: arrange(
  [16, buildUp],
  [ 2, bass],
  [ 2, drop],
  [16, main],
  [16, buildUp],
)

// Master volume
all(x => x.postgain(globalThis.VOLUME))
`;

