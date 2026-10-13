import { useEffect, useRef, useState } from 'react';

const PARTS = [
  { name: 'Pulse', steps: [1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0] },
  { name: 'Bass', steps: [1, 0, 0, 1, 0, 0, 1, 0, 1, 0, 0, 1, 0, 0, 1, 0] },
  { name: 'Harmony', steps: [1, 0, 0, 0, 0, 0, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0] },
  { name: 'Accents', steps: [0, 0, 1, 0, 0, 0, 1, 1, 0, 0, 1, 0, 0, 1, 1, 0] },
];
function tone(ctx, output, frequency, time, duration, volume, type = 'sine', fall = false) {
  const osc = ctx.createOscillator(), gain = ctx.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(frequency, time);
  if (fall) osc.frequency.exponentialRampToValueAtTime(38, time + duration);
  gain.gain.setValueAtTime(0, time);
  gain.gain.linearRampToValueAtTime(volume, time + .008);
  gain.gain.exponentialRampToValueAtTime(.001, time + duration);
  osc.connect(gain); gain.connect(output); osc.start(time); osc.stop(time + duration + .01);
  osc.onended = () => { osc.disconnect(); gain.disconnect(); };
}
export default function SoundLab({ session }) {
  const [enabled, setEnabled] = useState([true, true, false, false]);
  const [playing, setPlaying] = useState(false);
  const [step, setStep] = useState(-1);
  const [error, setError] = useState('');
  const engine = useRef(null), enabledRef = useRef(enabled), mounted = useRef(true), generation = useRef(0);
  enabledRef.current = enabled;
  const stop = () => {
    generation.current += 1;
    if (engine.current) { clearInterval(engine.current.timer); engine.current.ctx.close().catch(() => {}); engine.current = null; }
    if (mounted.current) { setPlaying(false); setStep(-1); }
  };
  useEffect(() => {
    mounted.current = true;
    const hide = () => { if (document.hidden) stop(); };
    document.addEventListener('visibilitychange', hide);
    return () => { mounted.current = false; stop(); document.removeEventListener('visibilitychange', hide); };
  }, []);
  const play = async () => {
    if (engine.current) { stop(); return; }
    setError('');
    const token = ++generation.current;
    try {
      const Audio = window.AudioContext || window.webkitAudioContext;
      if (!Audio) throw new Error('unavailable');
      const ctx = new Audio();
      const output = ctx.createGain(); output.gain.value = .38; output.connect(ctx.destination);
      engine.current = { ctx };
      await ctx.resume();
      if (!mounted.current || token !== generation.current) { ctx.close().catch(() => {}); return; }
      let beat = 0, nextTime = ctx.currentTime + .04;
      const interval = 60 / 108 / 4;
      const queue = [];
      const tick = () => {
        while (nextTime < ctx.currentTime + .09) {
          const current = beat % 16;
          PARTS.forEach((part, index) => {
            if (!enabledRef.current[index] || !part.steps[current]) return;
            if (index === 0) tone(ctx, output, 140, nextTime, .19, .65, 'sine', true);
            if (index === 1) tone(ctx, output, current < 8 ? 110 : 130.81, nextTime, .18, .2, 'triangle');
            if (index === 2) [220, 261.63, 329.63].forEach(note => tone(ctx, output, note * (current < 8 ? 1 : .89), nextTime, .75, .075, 'triangle'));
            if (index === 3) tone(ctx, output, current % 2 ? 1600 : 1100, nextTime, .04, .06, 'square');
          });
          queue.push({ time: nextTime, step: current }); nextTime += interval; beat++;
        }
        while (queue.length && queue[0].time <= ctx.currentTime) setStep(queue.shift().step);
      };
      tick(); engine.current.timer = setInterval(tick, 25); setPlaying(true);
    } catch {
      stop(); setError('Audio could not start in this browser. You can still explore the arrangement above.');
    }
  };
  return <section className="m-lab" aria-labelledby="lab-title">
    <div className="p-rowhead"><div><p className="m-kicker">Make the idea audible</p><h3 id="lab-title">The less-is-more machine.</h3></div><span className="p-mono">108 BPM / original sound sketch</span></div>
    <p className="p-small">{session.lab}</p>
    <div className="m-sequencer">{PARTS.map((part, index) => <div className={`m-sequencer__row ${enabled[index] ? '' : 'is-muted'}`} key={part.name}><button aria-pressed={enabled[index]} aria-label={`${part.name} ${enabled[index] ? 'on' : 'off'}`} onClick={() => setEnabled(value => value.map((on, i) => i === index ? !on : on))}><span>{enabled[index] ? '●' : '○'}</span>{part.name}</button><div aria-hidden="true">{part.steps.map((hit, i) => <span key={i} className={`${hit ? 'is-hit' : ''} ${step === i ? 'is-current' : ''}`} />)}</div></div>)}</div>
    <div className="p-btns"><button className="p-btn m-primary" onClick={play}>{playing ? '■ Stop sketch' : '▶ Play sketch'}</button><button className="p-btn" onClick={() => setEnabled([true, true, true, true])}>All four parts</button><button className="p-btn" onClick={() => setEnabled([true, true, false, false])}>Strip it back</button></div>
    <p className="p-mono">An original Memphis exercise, not audio or stems from {session.title}. Tap a part to add or remove it.</p>
    {error && <p role="alert" className="p-error">{error}</p>}
  </section>;
}
