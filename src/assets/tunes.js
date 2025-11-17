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

// Tempo (105 BPM, scaled by SPEED) //
const BASE_CPS = 105/60/4;
setcps(BASE_CPS * globalThis.SPEED);

// Helper: gate(on, pattern) – used by all toggles //
const gate = (on, pat) => on ? pat : pat.mask("<0!999>");

// -------------------- MELODY --------------------

// m1 – kalimba lead (1 bar loop)
let m1 =
  note("<[D@3 A@2 ~ D@2] [Cs@2 ~ A@2 ~ Cs@2]>".add("12,24"))
    .s("gm_kalimba:3")
    .legato(1.5)
    .fast(2)
    .attack(.025)
    .release(.2)
    .lp(1000)
    .room(".6:2")
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
        .lp(1000)
        .room(".6:2")
        .postgain(2),
      x => x
        .s("gm_acoustic_guitar_steel:6")
        .clip(1.5)
        .release(.2)
        .room(".6:2")
        .postgain(1)
    )
    .fast(2);

// gated versions used in sections
let leadA = gate(globalThis.MELODY, m1);
let leadB = gate(globalThis.MELODY, m2);

// -------------------- DRUMS (LinnDrum bank) --------------------

let dr =
  stack(
    // Punchy kick pattern
    s("bd(3,8)")
      .room(".3:2")
      .decay(0.4)
      .shape(0.3)
      .gain(1.2),

    // Snare on the backbeat
    s("sd(2,8)")
      .room(".3:2")
      .decay(0.35)
      .gain(0.9),

    // Fast hi-hats for groove
    s("hh*16")
      .lp(9000)
      .hp(3000)
      .gain(0.7)
  );

let drums = gate(globalThis.DRUMS, dr);

// -------------------- CHORDS / HARMONY --------------------

// Shared chord progression definition (I–vi–IV–V in D major)
const chordProg = "<0 0 0 0, -1 -1 -1 -1, 1 1 1 1, -2 -2 -2 -2>/2";

// Main electric-piano chords
let chord =
  n(chordProg)
    .scale("D:major")
    .s("gm_epiano1:6")
    .legato(1.4)
    .lp(2500)
    .room(".6:2")
    .postgain(2.0);

let chordsMain = gate(globalThis.CHORDS, chord);

// Arp / guitar shimmer on top
let chordArp =
  n("<0 2 4 6 4 2 1 2>*2")
    .scale("D4:major")
    .s("gm_electric_guitar_jazz:3")
    .legato(0.08)
    .room(".6:2")
    .postgain(1.6);

let arpLayer = gate(globalThis.EXTRA, chordArp);

// -------------------- BASS --------------------

// Root-note synth bass
let bass1note =
  n("<0 -1 1 -2>/2")
    .scale("D1:major")
    .s("gm_lead_8_bass_lead:1")
    .lp(800)
    .clip(.1)
    .attack(.2)
    .release(.12)
    .delay(".45:.1:.3")
    .room(".6:2")
    .postgain(1.3);

// Fast guitar-ish bassline
let bassline =
  note("<[D2!28 Cs2!4] B1*32 [E2!28 D2!4] A1*32>/2")
    .s("gm_electric_bass_pick")
    .decay(.5)
    .velocity(rand.range(.7,1).fast(4))
    .lp(1000)
    .compressor("-20:20:10:.002:.02")
    .room(".6:2")
    .postgain(1.5);

let bassRoot = gate(globalThis.BASS, bass1note);
let bassLine = gate(globalThis.BASS, bassline);

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
