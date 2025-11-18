// src/assets/tunes.js
// "Birds of a Feather" inspired tune, adapted for Strudel Reactor UI

export const stranger_tune = `


samples('github:tidalcycles/dirt-samples');

// Global controls (wired to React controls) //
globalThis.SPEED  ??= 1;      // Speed slider (1 = normal)
globalThis.VOLUME ??= 0.75;   // Master volume slider (0–1)

globalThis.MELODY ??= 1;      // m1 / m2 lead on/off
globalThis.DRUMS  ??= 1;      // drum kit on/off
globalThis.CHORDS ??= 1;      // main chords on/off
globalThis.BASS   ??= 1;      // bass root + bassline on/off
globalThis.EXTRA  ??= 1;      // organ pad + arp guitar on/off

// FX controls (wired to "Effects" tab)
globalThis.SPACE   ??= 0.6;   // 0..1  reverb amount
globalThis.BRIGHT  ??= 0.5;   // 0..1  filter brightness
globalThis.WIDTH ??= 0.7; // Stereo width (0 = mono, 1 = wide)
globalThis.CHORD_LEN ??= 0.6;   // 0..1  chord length (short → long)

globalThis.DRUM_KIT ??= 0;   // 0 = Studio, 1 = TR-808, 2 = TR-909 (drum kits)

// Helper functions for FX parameters //

globalThis.roomAmt = () =>
  0.05 + (globalThis.SPACE ?? 0) * 1.2;           // 0.05–1.25 reverb

globalThis.brightCut = () =>
  500 + (globalThis.BRIGHT ?? 0.5) * 7500;        // 500–8000 Hz cutoff

globalThis.widthAmt = () =>
  (globalThis.WIDTH ?? 0.7);                      // 0–1 width factor

globalThis.chordLen = () =>
  (globalThis.CHORD_LEN ?? 0.6);   // 0–1 normalized



// Tempo (105 BPM, scaled by SPEED) //
const BASE_CPS = 105/60/4;
setcps(BASE_CPS * globalThis.SPEED);

// Helper: gate(on, pattern) – used by all toggles //
const gate = (on, pat) => on ? pat : pat.mask("<0!999>");


const w = widthAmt(); // 0..1 stereo width factor
const cLen = chordLen();           // 0..1 chord length

// -------------------- MELODY --------------------

// m1 – kalimba lead (1 bar loop)
let m1 =
  note("<[D@3 A@2 ~ D@2] [Cs@2 ~ A@2 ~ Cs@2]>".add("12,24"))
    .s("gm_kalimba:3")
    .legato(1.5)
    .fast(2)
    .attack(.025)
    .release(.2)
    .lp(brightCut())
    .room(roomAmt())
    .postgain(1.5);

// m2 – kalimba + guitar layer (1 bar loop)
let m2 =
  note("<[D@3 A@2 ~ D@2] [Cs@2 ~ A@2 ~ Cs@2]>".add("12,24"))
    .layer(
      x => x
        .s("gm_kalimba:3")
        .legato(1.5)
        .attack(.025)
        .release(.2)
        .lp(brightCut())
        .room(roomAmt())
        .postgain(2),
      x => x
        .s("gm_acoustic_guitar_steel:6")
        .clip(1.5)
        .release(.2)
        .room(roomAmt())
        .postgain(1)
    )
    .fast(2);

let leadA = gate(globalThis.MELODY, m1).pan(-0.6 * w);
let leadB = gate(globalThis.MELODY, m2).pan(-0.4 * w);





// -------------------- DRUMS – kit selector  --------------------

// 0 = Studio, 1 = 808-ish, 2 = 909-ish
const currentKit = globalThis.DRUM_KIT ?? 0;

const makeDrums = () => {
  if (currentKit === 1) {
    // "808-ish" – deeper kicks, softer snares, bright hats
    return stack(
      s("bd:2(3,8)")              // alt kick sample
        .room(roomAmt() * 0.6)
        .decay(0.45)
        .shape(0.35)
        .gain(1.3),

      s("sd:2(2,8)")              // alt snare
        .room(roomAmt() * 0.7)
        .decay(0.38)
        .gain(0.95),

      s("hh:2*16")                // brighter hats
        .lp(brightCut() + 2500)
        .hp(1200 + (1 - (globalThis.BRIGHT ?? 0.5)) * 800)
        .gain(0.75)
    );
  }

  if (currentKit === 2) {
    // "909-ish" – punchy kick, snappy snare, tighter hats
    return stack(
      s("bd:3(3,8)")
        .room(roomAmt() * 0.4)
        .decay(0.35)
        .shape(0.4)
        .gain(1.4),

      s("sd:3(2,8)")
        .room(roomAmt() * 0.5)
        .decay(0.3)
        .gain(1.0),

      s("hh:3*16")
        .lp(brightCut() + 1500)
        .hp(1500 + (1 - (globalThis.BRIGHT ?? 0.5)) * 700)
        .gain(0.7)
    );
  }

  // 0 – Studio (default)
  return stack(
    s("bd(3,8)")
      .room(roomAmt() * 0.5)
      .decay(0.4)
      .shape(0.3)
      .gain(1.2),

    s("sd(2,8)")
      .room(roomAmt() * 0.6)
      .decay(0.35)
      .gain(0.9),

    s("hh*16")
      .lp(brightCut() + 2000)
      .hp(1000 + (1 - (globalThis.BRIGHT ?? 0.5)) * 1000)
      .gain(0.7)
  );
};

let dr     = makeDrums();
let drums  = gate(globalThis.DRUMS, dr);

// -------------------- CHORDS / HARMONY --------------------

// Shared chord progression definition
const chordProg = "<0 0 0 0, -1 -1 -1 -1, 1 1 1 1, -2 -2 -2 -2>/2";

// Main electric-piano chords
let chord =
  n(chordProg)
    .scale("D:major")
    .s("gm_epiano1:6")
    .legato(0.4 + cLen * 1.6)
    .decay(0.7 + cLen * 1.3)
    .lp(brightCut())
    .room(roomAmt())
    .postgain(2.0);

let chordsMain = gate(globalThis.CHORDS, chord).pan(0.4 * w);

// Arp / guitar shimmer on top
let chordArp =
  n("<0 2 4 6 4 2 1 2>*2")
    .scale("D4:major")
    .s("gm_electric_guitar_jazz:3")
    .legato(0.08)
    .lp(brightCut() + 1000)
    .room(roomAmt())
    .postgain(1.6);

let arpLayer =
  gate(globalThis.EXTRA, chordArp).pan(0.9 * w);

// -------------------- BASS --------------------

// Root-note synth bass
let bass1note =
  n("<0 -1 1 -2>/2")
    .scale("D1:major")
    .s("gm_lead_8_bass_lead:1")
    .lp(400 + brightCut() * 0.4)
    .clip(.1)
    .attack(.2)
    .release(.12)
    .room(roomAmt() * 0.6)
    .postgain(1.3);

// Fast guitar-ish bassline

let bassline =
  note("<[D2!28 Cs2!4] B1*32 [E2!28 D2!4] A1*32>/2")
    .s("gm_electric_bass_pick")
    .decay(.5)
    .velocity(rand.range(.7,1).fast(4))
    .lp(600 + brightCut() * 0.4)
    .compressor("-20:20:10:.002:.02")
    .room(roomAmt() * 0.6)
    .postgain(1.5);

let bassRoot = gate(globalThis.BASS, bass1note).pan(-0.1 * w);
let bassLine = gate(globalThis.BASS, bassline).pan(0.1 * w);

// -------------------- SONG SECTIONS --------------------

// Soft but not empty: melody + chords + simple bass
let section1 = stack(
  leadA,
  chordsMain,
  bassRoot
);

// Main groove: add drums + full bassline
let section2 = stack(
  leadA,
  drums,
  chordsMain,
  bassRoot,
  bassLine
);

// Big chorus: switch to fuller lead + organ pad
let section3 = stack(
  leadB,
  drums,
  chordsMain,
  bassRoot,
  bassLine,
);

// Max energy: add arp guitar on top
let section4 = stack(
  leadB,
  drums,
  chordsMain,
  bassRoot,
  bassLine,
  arpLayer
);


let section5 = stack(
  leadA,
  drums,
  chordsMain,
  bassRoot,
  bassLine
);


// ARRANGEMENT //
$: arrange(
  [4, section1],  // 4 cycles – chords + bass already there
  [8, section2],  // add drums + bassline
  [8, section3],  // add organ pad
  [8, section4],  // full stack with arp
  [4, section5],  // come down but still grooving
);

// Master volume //
all(x => x.postgain(globalThis.VOLUME ?? 0.75));
`;
