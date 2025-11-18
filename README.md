### Strudel Reactor – Live Coding Music Platform (Assignment README) ###
Overview

This project is a fully interactive, React-based music platform built on top of Strudel, featuring live preprocessing, real-time audio manipulation controls, a fully custom D3 visualizer, and JSON preset handling.
All UI components are designed with a modern, cohesive theme, responsive layout, and accessibility in mind.

The system lets users modify musical parameters in real time, visualise instrument activity, save/load presets as JSON, and perform a live musical “set” using the provided Strudel composition.

### Controls & Their Functions ###

Below is a detailed explanation of each control included in the UI and how it affects the music.

-- Playback Controls --

- Play – Evaluates the Strudel code and starts audio playback.
- Stop – Immediately stops all audio and resets evaluation state.
- Process – Runs preprocessing logic on the Strudel code without playing it.
- Process & Play – Applies preprocessing logic and starts playback in one action.

-- Volume Slider --

- Controls the master volume of the track (globalThis.VOLUME).
- Range: 0–1
- Smoothly updates while music is playing.

-- Speed Multiplier (0.5x / 1x / 1.5x / 2x) --

- Adjusts playback speed by modifying Cycles Per Second (setcps).
- Does not distort audio pitch because Strudel re-evaluates the musical pattern.

-- Instrument Toggles (On/Off) --

Each toggle instantly enables or disables an instrument lane:
           - Melody
           - Drums
           - Chords
           - Bass
           - Extra / Arp Layer

Internally mapped to:
                        globalThis.MELODY
                        globalThis.DRUMS
                        globalThis.CHORDS
                        globalThis.BASS
                        globalThis.EXTRA
                    
-- FX Sliders --
Reverb Amount – SPACE
    Controls the overall ambience/room size of the sound.

Brightness – BRIGHT
    Adjusts tonal brightness (higher values = crisp, lower = mellow).

Width – WIDTH
    Stereo width of the mix (0 = narrow mono, 1 = wide stereo).

Chord Length – CHORD_LEN
    Controls sustain/length of chord notes.

Drum Kit Selector
- Switches between multiple drum kits by updating: globalThis.DRUM_KIT

Melody Style Selector
- Switches between different melody patterns/styles: globalThis.MELODY_STYLE

Section Selector
- Changes the musical “section” (e.g., drop, verse, chorus).

### Preset Features (JSON Handling) ###

 -- Save Preset --

- Saves all current settings to a strudel-preset.json file.
- Contains instrument toggles, sliders, style controls, FX, and layout.

--  Load Preset --

- User selects any .json preset file.
- System loads and:
    - Applies stored state to React controls
    - Pushes values into Strudel globals
    - Re-processes the musical pattern

### D3 Visualizer ###

A fully customised real-time instrument activity visualizer featuring:

- Five instrument lanes (Melody, Drums, Chords, Bass, Extra)
- Live activity blocks that move horizontally and change with each triggered note
- Dynamic colouring system matched to the site theme
- Velocity-based intensity variation
- Automatic fade-out of old notes

### Preprocessor Editor ###
- Allows users to write and modify preprocessing logic.
- Changes directly influence the final evaluated Strudel code.
- Designed for smooth text editing, clear font rendering, and code-focused layout.

### Strudel REPL Output ###

- Displays Strudel evaluation logs, warnings, pattern updates, and console messages.
- Helps users understand how preprocessing and control changes impact the music.
- Fully separated from the editor to avoid visual clutter and improve workflow.

### Song Attribution & Source ###

The musical base code was adapted and edited from:

https://github.com/terryds/awesome-strudel

## Link for the Video Demonstration ##
https://mymailunisaedu-my.sharepoint.com/:v:/g/personal/mxzdw001_mymail_unisa_edu_au/IQBcCb9GUox9R5Xpd-a1UaMoAYGw1xBZdQax26B3Woo8JMs?nav=eyJyZWZlcnJhbEluZm8iOnsicmVmZXJyYWxBcHAiOiJPbmVEcml2ZUZvckJ1c2luZXNzIiwicmVmZXJyYWxBcHBQbGF0Zm9ybSI6IldlYiIsInJlZmVycmFsTW9kZSI6InZpZXciLCJyZWZlcnJhbFZpZXciOiJNeUZpbGVzTGlua0NvcHkifX0&e=kDq4DM


## AI Usage ##
Used AI to understand how the new Strudel Framework work such as how .log() produces data, how strudel events fire, and how the REPL evaluation cycle work.

-- Prompts Used --
“What exactly happens when globalEditor.evaluate() is called? Does it restart audio or patch new values in?”
    - The REPL recompiles the entire code block currently inside the editor.
    - It resets the Strudel playback engine with the updated settings.
    - It clears previous cycles and schedules new audio patterns with the current global values.
    - It does not reload the audio context unless needed, which keeps playback smooth.

“Can you explain how Strudel generates haps, what values are inside them, and how I can detect instrument triggers? I’m trying to link the data to D3.”
    - A hap is Strudel’s event object containing time, duration, velocity, note, and sample names.
    - Inside the REPL’s onDraw callback, Strudel exposes all haps currently active in the time window.
    - You can inspect h.value.s or h.value.sample to identify which instrument fired.
    - A suggestion was made to dispatch custom browser events (e.g., new CustomEvent("d3Data")) so React components can listen to real-time note activity.