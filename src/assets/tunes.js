// src/assets/tunes.js
// "Birds of a Feather" inspired tune, adapted for Strudel Reactor UI

export const stranger_tune = `

// Global controls //

globalThis.SPEED  ??= 1;      // Speed slider (1 = normal)
globalThis.VOLUME ??= 0.75;   // Master volume slider (0–1)

globalThis.MELODY ??= 1;      // m1 / m2 lead on/off
globalThis.DRUMS  ??= 1;      // drum kit on/off
globalThis.CHORDS ??= 1;      // main chords on/off
globalThis.BASS   ??= 1;      // bass root + bassline on/off
globalThis.EXTRA  ??= 1;      // organ pad + arp guitar on/off

// Tempo (105 BPM, scaled by SPEED)//
const BASE_CPS = 105/60/4;
setcps(BASE_CPS * globalThis.SPEED);


// Helper: gate(on, pattern) – used by all toggles //

const gate = (on, pat) => on ? pat : pat.mask("<0!999>");


// MELODY //


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


// DRUMS (1 bar loop) //


let dr =
  stack(
    s("[bd:<1 0>(<3 1>,8,<0 2>:1.3)] , [~ sd:<15>:2.5]")
      .note("B1")
      .bank("LinnDrum")
      .decay(.3)
      .room(".3:2")
      .fast(2),

    s("[LinnDrum_hh(<3 2>,8)]")
      .hp("1000")
      .lp("9000")
      .decay(.3)
      .velocity([".8 .6"])
      .room(".3:2")
      .fast(2),

    s("sh*8")
      .note("B1")
      .bank("RolandTR808")
      .room(".6:2")
      .velocity("[.8 .5]!4")
      .postgain(1.5)
      .fast(2)
  );

let drums = gate(globalThis.DRUMS, dr);


// CHORD PROGRESSION (8 bar loops) //


// Electric piano chords
let chord =
  n('<[[0,2,4,6] ~!3] ~ ~ ~ \
[[-1,0,2,4] ~!3] ~ ~ ~ \
[[1,3,5,7] ~!3]  ~ ~ ~ \
[[-2,0,1,3] ~!3]  ~ [[-2,-1,1,3] ~!3] ~ >')
    .scale("D:major")
    .s("gm_epiano1:6")
    .decay(1.5)
    .release(.25)
    .lp(2500)
    .delay(".45:.1:.3")
    .room(".6:2")
    .postgain(1.5)
    .fast(2);

let chordsMain = gate(globalThis.CHORDS, chord);

// Organ pad layer
let chordOrg =
  n('<[0,2,4,6] \
[-1,0,2,4] \
[1,3,5,7] \
[-2,0,1,3] >/2')
    .scale("D2:major")
    .s("gm_church_organ:4")
    .legato(1)
    .delay(".45:.1:.3")
    .room(".6:2")
    .postgain(.6);

let organLayer = gate(globalThis.EXTRA, chordOrg);

// Arp guitar layer
let chordArp =
  n('<[0 2 4 6]*8 \
[-1 0 2 4]*8 \
[1 3 5 7]*8 \
[-2 0 1 3]*8 >/2')
    .scale("D4:major")
    .s("gm_electric_guitar_jazz:<2 3>")
    .legato(.08)
    .delay(".45:.1:.3")
    .room(".6:2")
    .velocity(saw.range(.8,1).fast(4))
    .juxBy(1, rev())
    .postgain(1.8);

let arpLayer = gate(globalThis.EXTRA, chordArp);


// BASS (8 bar loops) //


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


// SONG SECTIONS (built from gated layers) //


let section1 = stack(leadA, drums);                                         // intro
let section2 = stack(leadA, drums, chordsMain, bassRoot);                   // add chords + root bass
let section3 = stack(leadA, drums, chordsMain, bassRoot, bassLine);         // add full bassline
let section4 = stack(leadB, drums, chordsMain, bassRoot, bassLine, arpLayer);          // + arp
let section5 = stack(leadB, drums, chordsMain, bassRoot, bassLine, organLayer, arpLayer); // full
let section6 = section5;                                                    // repeat
let section7 = stack(leadB, bassRoot, bassLine, organLayer);                // outro, no drums


// ARRANGEMENT – durations are in cycles //

$: arrange(
  [2, section1],
  [8, section2],
  [8, section3],
  [8, section4],
  [8, section5],
  [4, section6],
  [4, section7],
);


// Master volume //

all(x => x.postgain(globalThis.VOLUME ?? 0.75));
`;
