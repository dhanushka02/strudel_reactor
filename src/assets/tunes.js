// src/assets/tunes.js
export const stranger_tune = `

globalThis.SPEED ??= 1;
globalThis.VOLUME ??= 0.75;

// Tempo (135 BPM / 4) with UI speed multiplier
const BASE_CPS = 135/60/4
setcps(BASE_CPS * globalThis.SPEED)

// Parts
let chat = n("c")
  .struct("<[ - x ] [ - [ x!2]]>*4")
  .scale("G1:minor")
  .sound("chat_goodtime")
  .gain(0.3)

let snare = n("< - 3>*4")
  .scale("G1:minor")
  .sound("snare_love")

let kick = n("<3>*4")
  .scale("G1:minor")
  .sound("kick_fleece")
// .duckorbit("2:3")
// .duckdepth(1)
// .duckattack(0.25)

let bass = n("<0 2 4 3>")
  .scale("G1:minor")
  .s("saw")          // use built-in synths: "sine" | "square" | "saw" | "triangle"
  .orbit(2)
  .gain(1.0)

let arp = n("<[3 4] [1@3 5] [4 2 1!2] [2@3 4]>")
  .scale("G4:minor")
  .s("square")
  .decay(0.5)
  .delay(0.25)
  .delayfeedback(0.25)
  .orbit(3)
  .gain(0.75)
// ._punchcard()

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

