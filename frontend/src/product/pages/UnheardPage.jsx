import { useState } from 'react';
import { api, errorMessage } from '../api';
import { usePageTitle, useResource } from '../hooks';
import { SongTile } from '../components/Tiles';

const EMPTY = { artist: '', title: '', link: '', contact: '', story: '' };

function SubmitForm() {
  const [form, setForm] = useState(EMPTY);
  const [state, setState] = useState({ busy: false, error: '', sent: false });
  const update = (field) => (event) => setForm((f) => ({ ...f, [field]: event.target.value }));

  const submit = async (event) => {
    event.preventDefault();
    setState({ busy: true, error: '', sent: false });
    try {
      await api.submitSong(form);
      setForm(EMPTY);
      setState({ busy: false, error: '', sent: true });
    } catch (error) {
      setState({ busy: false, error: errorMessage(error), sent: false });
    }
  };

  if (state.sent) {
    return (
      <div className="p-stack">
        <p className="p-stand">Got it. Thank you.</p>
        <p className="p-small">Someone will listen and read what you wrote. If it fits, we’ll write to you before anything is published.</p>
        <button type="button" className="p-btn" onClick={() => setState({ busy: false, error: '', sent: false })}>Send another</button>
      </div>
    );
  }

  return (
    <form className="p-form" onSubmit={submit}>
      <div className="p-grid2">
        <label>Your name or the artist’s<input id="unheard-artist" className="p-input" value={form.artist} onChange={update('artist')} required maxLength={120} /></label>
        <label>Song title<input id="unheard-title" className="p-input" value={form.title} onChange={update('title')} required maxLength={160} /></label>
      </div>
      <label>Where can we hear it?<input id="unheard-link" className="p-input" type="url" placeholder="https://" value={form.link} onChange={update('link')} required maxLength={300} /></label>
      <label>
        How did you make it?
        <small>The part you’d tell another musician. What you played, what you recorded it on, what went wrong, what you’d keep.</small>
        <textarea id="unheard-story" className="p-input" rows={7} value={form.story} onChange={update('story')} required minLength={80} maxLength={4000} />
      </label>
      <label>
        How can we reach you?
        <small>Optional. An email or a profile link.</small>
        <input id="unheard-contact" className="p-input" value={form.contact} onChange={update('contact')} maxLength={160} />
      </label>
      {state.error && <p className="p-error" role="alert">{state.error}</p>}
      <div className="p-btns">
        <button type="submit" className="p-btn p-btn--fill" disabled={state.busy}>{state.busy ? 'Sending…' : 'Send it'}</button>
      </div>
    </form>
  );
}

export default function UnheardPage() {
  usePageTitle('Unheard');
  const works = useResource(() => api.works(), []);
  const unheard = (works.data || []).filter((work) => work.room === 'unheard');

  return (
    <div className="p-page p-page--read">
      <header className="p-sec">
        <h1 className="p-xl">Unheard</h1>
        <p className="p-lede">
          Charts mostly measure marketing. A song with no budget can be as well made as a number one,
          and nobody will ever tell you why. This room is for those.
        </p>
      </header>

      <section className="p-grid3">
        <div className="p-card p-pad p-stack"><h2 className="p-md">By craft</h2><p className="p-small">A song gets in because someone can point to what’s good about how it’s made.</p></div>
        <div className="p-card p-pad p-stack"><h2 className="p-md">No numbers</h2><p className="p-small">No charts, streams or follower counts appear on any Unheard page.</p></div>
        <div className="p-card p-pad p-stack"><h2 className="p-md">From the maker</h2><p className="p-small">The person who made it tells how. For once, the source is in the room.</p></div>
      </section>

      <section className="p-sec">
        <h2 className="p-md">On the shelf</h2>
        {unheard.length > 0 ? (
          <div className="p-grid-tiles">{unheard.map((work) => <SongTile key={work.slug} work={work} />)}</div>
        ) : (
          <p className="p-notice">Nothing here yet. The first songs will come from people who write in below.</p>
        )}
      </section>

      <section className="p-sec" id="send">
        <header className="p-stack">
          <h2 className="p-lg">Send a song</h2>
          <p className="p-lede">Yours, or one you think deserves it. Nothing is published without the artist saying yes.</p>
        </header>
        <SubmitForm />
      </section>
    </div>
  );
}
