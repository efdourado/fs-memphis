import { useRef, useState } from 'react';
import { experimentFor, settingsFor } from './soundExperiments';
import { useSoundPlayer } from './useSoundPlayer';
import AudioHelp from './AudioHelp';

function Experiment({ session, experiment }) {
  const [settings, setSettings] = useState(() => settingsFor(experiment));
  const { activeId, starting, step, error, play } = useSoundPlayer();
  const playing = activeId === session.slug && !starting;
  const controls = useRef(settings);
  controls.current = settings;
  const preset = experiment.presets.find(item => item.id === settings.presetId);
  const modified = preset.enabled.some(id => !settings.enabled.includes(id)) || settings.enabled.some(id => !preset.enabled.includes(id));
  const togglePlayback = () => play({ id: session.slug, experiment, readSettings: () => controls.current });
  const choose = selected => setSettings(current => ({ ...settingsFor(experiment, selected), amount: current.amount }));
  const toggle = id => setSettings(current => ({ ...current, enabled: current.enabled.includes(id) ? current.enabled.filter(part => part !== id) : [...current.enabled, id] }));

  return (
    <section className="m-lab" aria-labelledby="lab-title">
      <div className="p-rowhead">
        <div><p className="m-kicker">Make the idea audible · {session.title}</p><h3 id="lab-title">{experiment.title}</h3></div>
        <span className="p-mono">{settings.bpm} BPM / original sound sketch</span>
      </div>
      <p className="p-small">{experiment.instruction}</p>
      <div className="m-lab-presets" role="group" aria-label={`Experiments for ${session.title}`}>
        {experiment.presets.map((item, index) => (
          <button key={item.id} aria-pressed={settings.presetId === item.id} onClick={() => choose(item)}>
            <span className="p-mono">0{index + 1}</span><span>{item.name}</span>
          </button>
        ))}
      </div>
      <p className="m-lab-note" role="status">{modified ? 'Your variation: you changed the layers. Select a scene above to hear its starting arrangement again.' : preset.note}</p>
      {experiment.control && (
        <div className="m-lab-control">
          <label htmlFor="lab-amount">{experiment.control.label}<output>{settings.amount}%</output></label>
          <input id="lab-amount" type="range" min="0" max="100" value={settings.amount} onChange={event => setSettings(current => ({ ...current, amount: Number(event.target.value) }))} />
          <div><span>{experiment.control.low}</span><span>{experiment.control.high}</span></div>
          {!settings.enabled.some(id => experiment.parts.some(part => part.id === id && (experiment.control.id === 'width' ? part.spread : part.human))) && (
            <p className="p-small">{experiment.control.id === 'width' ? 'Choose Lift or Chorus to hear the width change.' : 'Choose Let the accents in to hear the looseness change.'}</p>
          )}
        </div>
      )}
      <div className="m-sequencer">
        {experiment.parts.map(part => (
          <div className={`m-sequencer__row ${settings.enabled.includes(part.id) ? '' : 'is-muted'}`} key={part.id}>
            <button aria-pressed={settings.enabled.includes(part.id)} aria-label={`${part.name} ${settings.enabled.includes(part.id) ? 'on' : 'off'}`} onClick={() => toggle(part.id)}>
              <span aria-hidden="true">{settings.enabled.includes(part.id) ? '●' : '○'}</span>{part.name}
            </button>
            <div aria-hidden="true">{Array.from({ length: 16 }, (_, index) => <span key={index} className={`${part.hits.some(hit => hit.step === index) ? 'is-hit' : ''} ${step === index ? 'is-current' : ''}`} />)}</div>
          </div>
        ))}
      </div>
      <div className="p-btns">
        <button className="p-btn m-primary" onClick={togglePlayback}>{starting ? 'Cancel audio start' : playing ? '■ Stop experiment' : '▶ Play experiment'}</button>
        <button className="p-btn" onClick={() => setSettings(settingsFor(experiment))}>Reset experiment</button>
        <span className="p-small">{settings.enabled.length ? `${settings.enabled.length} layers active` : 'All layers muted. Turn one on to hear it.'}</span>
      </div>
      <p className="p-mono">{experiment.tip} Tap a layer to add or remove it.</p>
      <p className="p-mono">An original Memphis demonstration of an idea in {session.title}. Not the recording, its stems, or a reconstruction.</p>
      {error && <p role="alert" className="p-error">{error}</p>}
      <AudioHelp />
    </section>
  );
}

export default function SoundLab({ session }) {
  const experiment = experimentFor(session.slug);
  return experiment ? <Experiment key={session.slug} session={session} experiment={experiment} /> : null;
}
