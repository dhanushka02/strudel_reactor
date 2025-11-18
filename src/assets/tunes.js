

export const stranger_tune = `

samples('github:tidalcycles/dirt-samples');

// ---------------- GLOBAL CONTROLS ----------------

globalThis.SPEED  ??= 1;      // Speed slider (1 = normal)
globalThis.VOLUME ??= 0.75;   // Master volume slider (0–1)

globalThis.MELODY ??= 1;      // lead on/off
globalThis.DRUMS  ??= 1;      // drum kit on/off
globalThis.CHORDS ??= 1;      // main chords on/off
globalThis.BASS   ??= 1;      // bass root + bassline on/off
globalThis.EXTRA  ??= 1;      // arp / extra layer on/off

// FX / mix controls
globalThis.SPACE      ??= 0.6;  // 0..1  reverb amount
globalThis.BRIGHT     ??= 0.5;  // 0..1  brightness
globalThis.WIDTH      ??= 0.7;  // 0..1  stereo width
globalThis.CHORD_LEN  ??= 0.6;  // 0..1  chord length (short → long)

// Selectors
globalThis.DRUM_KIT     ??= 0;  // 0 = Studio, 1 = 808-ish, 2 = 909-ish
globalThis.MELODY_STYLE ??= 0;  // 0 = Kalimba, 1 = Kalimba+Guitar, 2 = E-Piano lead

// ---------------- HELPER FUNCTIONS ----------------

// read current slider values every time the code is evaluated
const roomAmt = () =>
  0.05 + (globalThis.SPACE ?? 0) * 1.2;           // 0.05–1.25 reverb

const brightCut = () =>
  500 + (globalThis.BRIGHT ?? 0.5) * 7500;        // 500–8000 Hz cutoff

const widthAmt = () =>
  (globalThis.WIDTH ?? 0.7);                      // 0–1 width factor

const chordLen = () =>
  (globalThis.CHORD_LEN ?? 0.6);                  // 0–1 normalized length

// Tempo (105 BPM, scaled by SPEED)
const BASE_CPS = 105/60/4;
setcps(BASE_CPS * globalThis.SPEED);

// Gate helper
const gate = (on, pat) => on ? pat : pat.mask("<0!999>");

// Snapshot of current FX values for this render
const w    = widthAmt();
const cLen = chordLen();

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

// m2 – kalimba + guitar layer
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

// m3 – e-piano style lead
let m3 =
  note("<[D@3 A@2 ~ D@2] [Cs@2 ~ A@2 ~ Cs@2]>".add("12,24"))
    .s("gm_epiano1:6")
    .legato(1.3)
    .fast(2)
    .attack(.02)
    .release(.25)
    .lp(brightCut())
    .room(roomAmt())
    .postgain(1.8);

// Melody style selector
const melodyStyle = globalThis.MELODY_STYLE ?? 0;

let leadCore =
  melodyStyle === 1 ? m2 :
  melodyStyle === 2 ? m3 :
  m1; // default = soft kalimba

// Final lead with toggle + pan based on WIDTH
let leadMain =
  melodyStyle === 1
    ? gate(globalThis.MELODY, leadCore).pan(-0.4 * w)
    : melodyStyle === 2
      ? gate(globalThis.MELODY, leadCore).pan(-0.2 * w)
      : gate(globalThis.MELODY, leadCore).pan(-0.6 * w);

// -------------------- DRUMS – KIT SELECTOR --------------------

const currentKit = globalThis.DRUM_KIT ?? 0;

const makeDrums = () => {
  if (currentKit === 1) {
    // 808-ish
    return stack(
      s("bd:2(3,8)")
        .room(roomAmt() * 0.6)
        .decay(0.45)
        .shape(0.35)
        .gain(1.3),

      s("sd:2(2,8)")
        .room(roomAmt() * 0.7)
        .decay(0.38)
        .gain(0.95),

      s("hh:2*16")
        .lp(brightCut() + 2500)
        .hp(1200 + (1 - (globalThis.BRIGHT ?? 0.5)) * 800)
        .gain(0.75)
    );
  }

  if (currentKit === 2) {
    // 909-ish
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

let dr    = makeDrums();
let drums = gate(globalThis.DRUMS, dr);

// -------------------- CHORDS / HARMONY --------------------

// Shared chord progression
const chordProg = "<0 0 0 0, -1 -1 -1 -1, 1 1 1 1, -2 -2 -2 -2>/2";

let chord =
  n(chordProg)
    .scale("D:major")
    .s("gm_epiano1:6")
    .legato(0.4 + cLen * 1.6)     // chord length slider
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

let arpLayer = gate(globalThis.EXTRA, chordArp).pan(0.9 * w);

// -------------------- BASS --------------------

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
let bassLine = gate(globalThis.BASS, bassline).pan( 0.1 * w);

// -------------------- SONG SECTIONS --------------------

let section1 = stack(
  leadMain,
  chordsMain,
  bassRoot
);

let section2 = stack(
  leadMain,
  drums,
  chordsMain,
  bassRoot,
  bassLine
);

let section3 = stack(
  leadMain,
  drums,
  chordsMain,
  bassRoot,
  bassLine
);

let section4 = stack(
  leadMain,
  drums,
  chordsMain,
  bassRoot,
  bassLine,
  arpLayer
);

let section5 = stack(
  leadMain,
  drums,
  chordsMain,
  bassRoot,
  bassLine
);

// ARRANGEMENT //
$: arrange(
  [4, section1],
  [8, section2],
  [8, section3],
  [8, section4],
  [4, section5],
);

// Master volume //
all(x => x.postgain(globalThis.VOLUME ?? 0.75));
`;
