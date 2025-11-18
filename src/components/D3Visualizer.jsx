// src/components/D3Visualizer.jsx
import { useEffect, useRef } from "react";
import * as d3 from "d3";

const INSTRUMENTS = ["melody", "drums", "chords", "bass", "extra"];

const INSTR_COLORS = {
    melody: "#8b5cf6",
    drums:  "#22c55e",
    chords: "#38bdf8",
    bass:   "#f97316",
    extra:  "#e11d48",
};

// ==== TUNING KNOBS ====

const DISPLAY_WINDOW = 2.5;   // seconds
const ACTIVE_WINDOW  = 0.45;  // how long a hit is considered "current"

// Per-instrument dash widths (in pixels)
const DASH_WIDTH_MAP = {
    melody: 32,
    drums:  24,
    chords: 60,
    bass:   60,
    extra:  32,
};

// parse "D3", "A#4" → approx MIDI number
function parseNote(noteStr) {
    if (!noteStr) return null;
    const m = /^([A-Ga-g])([#b]?)(-?\d+)?$/.exec(String(noteStr).trim());
    if (!m) return null;

    const letter = m[1].toUpperCase();
    const accidental = m[2];
    const octave = m[3] ? parseInt(m[3], 10) : 4;

    const baseMap = { C: 0, D: 2, E: 4, F: 5, G: 7, A: 9, B: 11 };
    let midi = baseMap[letter] + (octave + 1) * 12;

    if (accidental === "#") midi += 1;
    else if (accidental === "b") midi -= 1;

    return midi;
}

export default function D3Visualizer() {
    const svgRef = useRef(null);
    const eventsRef = useRef([]);
    const rafRef = useRef(null);

    useEffect(() => {
        const svg = d3.select(svgRef.current);
        const container = svgRef.current;

        const render = () => {
        if (!container) return;

        const { width, height } = container.getBoundingClientRect();
        if (!width || !height) return;

        const margin = { top: 20, right: 24, bottom: 40, left: 24 };
        const innerW = width - margin.left - margin.right;
        const innerH = height - margin.top - margin.bottom;

        svg.selectAll("*").remove();

        const g = svg
            .append("g")
            .attr("transform", `translate(${margin.left},${margin.top})`);

        const now = performance.now() / 1000;
        const windowStart = now - DISPLAY_WINDOW;

        const x = d3
            .scaleLinear()
            .domain([windowStart, now])
            .range([0, innerW]);

        const laneH = innerH / INSTRUMENTS.length;

        // card background
        g.append("rect")
            .attr("x", 0)
            .attr("y", 0)
            .attr("width", innerW)
            .attr("height", innerH)
            .attr("rx", 22)
            .attr("ry", 22)
            .attr("fill", "rgba(57, 75, 118, 0.9)")
            .attr("stroke", "rgba(56, 189, 248, 0.30)")
            .attr("stroke-width", 1);

        // dashed lane guides
        g.append("g")
            .selectAll("line")
            .data(INSTRUMENTS.slice(1))
            .join("line")
            .attr("x1", 20)
            .attr("x2", innerW - 20)
            .attr("y1", (_, i) => laneH * (i + 1))
            .attr("y2", (_, i) => laneH * (i + 1))
            .attr("stroke", "rgba(148, 163, 184, 0.45)")
            .attr("stroke-width", 0.8)
            .attr("stroke-dasharray", "4 6");

        // vertical "now" line
        g.append("line")
            .attr("x1", innerW - 4)
            .attr("x2", innerW - 4)
            .attr("y1", 10)
            .attr("y2", innerH - 10)
            .attr("stroke", "rgba(255,255,255,0.90)")
            .attr("stroke-width", 2);

        // fixed pitch scale so Y-movement is stable
        const pitchScale = d3
            .scaleLinear()
            .domain([36, 84])
            .range([0.15, 0.85]);

        // build bar data from events
        const barData = eventsRef.current.map((ev) => {
            const laneIndex = INSTRUMENTS.indexOf(ev.instrument);
            const xCenter = x(ev.time);
            const age = now - ev.time;
            const isActive = age <= ACTIVE_WINDOW;
            const relPitch = ev.pitch != null ? pitchScale(ev.pitch) : 0.5;
            const widthPx = DASH_WIDTH_MAP[ev.instrument] ?? 26;

            return {
            instrument: ev.instrument,
            laneIndex,
            velocity: ev.velocity ?? 1,
            time: ev.time,
            xCenter,
            age,
            isActive,
            relPitch,
            widthPx,
            };
        });

        g.append("g")
            .selectAll("rect.note-dash")
            .data(barData, (d) => `${d.instrument}-${d.time}`)
            .join("rect")
            .attr("class", "note-dash")
            .attr("rx", 6)
            .attr("ry", 6)
            .attr("x", (d) => d.xCenter - d.widthPx / 2)
            .attr("width", (d) => d.widthPx)
            .attr("y", (d) => {
            const laneTop = d.laneIndex * laneH;
            const yWithinLane = d.relPitch * laneH;
            const h = d.isActive ? laneH * 0.45 : laneH * 0.30;
            return laneTop + yWithinLane - h / 2;
            })
            .attr("height", (d) => (d.isActive ? laneH * 0.45 : laneH * 0.30))
            .attr("fill", (d) => INSTR_COLORS[d.instrument] || "#e5e7eb")
            .attr("fill-opacity", (d) => {

            const ageFactor = Math.max(0, Math.min(1, d.age / DISPLAY_WINDOW));
            const base = 0.25 + (1 - ageFactor) * 0.6;
            return d.isActive ? 1 : base;
            })
            .attr("stroke", (d) =>
            d3.color(INSTR_COLORS[d.instrument] || "#e5e7eb")
            )
            .attr("stroke-width", (d) => (d.isActive ? 2.2 : 1.4));

        // pulses at scan line for current hits
        const activeHits = barData.filter((d) => d.isActive);
        g.append("g")
            .selectAll("circle.hit-pulse")
            .data(activeHits, (d) => `${d.instrument}-${d.time}`)
            .join("circle")
            .attr("class", "hit-pulse")
            .attr("cx", innerW - 4)
            .attr("cy", (d) => {
            const laneTop = d.laneIndex * laneH;
            const yWithinLane = d.relPitch * laneH;
            return laneTop + yWithinLane;
            })
            .attr("r", laneH * 0.18)
            .attr("fill", "none")
            .attr("stroke", (d) =>
            d3.color(INSTR_COLORS[d.instrument] || "#e5e7eb")
            )
            .attr("stroke-width", 2.4)
            .attr("stroke-opacity", 0.98);
        };

        const handleEvent = (ev) => {
        const payload = ev.detail;
        if (!payload || !payload.instrument) return;

        const pitch = parseNote(payload.note);

        eventsRef.current.push({
            instrument: payload.instrument,
            velocity: payload.velocity ?? 1,
            time: payload.time,
            pitch,
        });

        const now = performance.now() / 1000;
        const cutoff = now - DISPLAY_WINDOW;
        eventsRef.current = eventsRef.current.filter((d) => d.time >= cutoff);
        };

        const animate = () => {
        render();
        rafRef.current = requestAnimationFrame(animate);
        };

        window.addEventListener("d3Data", handleEvent);
        window.addEventListener("resize", render);
        rafRef.current = requestAnimationFrame(animate);

        // initial render
        render();

        return () => {
        window.removeEventListener("d3Data", handleEvent);
        window.removeEventListener("resize", render);
        if (rafRef.current) cancelAnimationFrame(rafRef.current);
        };
    }, []);

    return (
        <div className="d3-card p-3 mb-2">
        <div className="d-flex justify-content-between align-items-center mb-2">
            <div>
            <h2 className="m-0 text-white">Live Instrument Activity</h2>
            <small className=" text-white">
                Last {DISPLAY_WINDOW}s of notes across all tracks
            </small>
            </div>
        </div>

        <svg
            ref={svgRef}
            className="d3-viz w-100"
            style={{ height: 220 }}
        />

        <div className="mt-3 d-flex flex-wrap gap-3">
            {INSTRUMENTS.map((inst) => (
            <div
                key={inst}
                className="d-flex align-items-center gap-2 legend-item"
            >
                <span
                style={{
                    width: 10,
                    height: 10,
                    borderRadius: "999px",
                    background: INSTR_COLORS[inst] || "#e5e7eb",
                    boxShadow: `0 0 6px ${INSTR_COLORS[inst] || "#e5e7eb"}`,
                }}
                />
                <span className="legend-label text-white text-capitalize">
                {inst}
                </span>
            </div>
            ))}
        </div>
        </div>
    );
}
