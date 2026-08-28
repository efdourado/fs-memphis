import { Link } from 'react-router-dom';
import ContentBadge from '../../components/knowledge/ContentBadge';
import KnowledgeFrame from '../../components/knowledge/KnowledgeFrame';

const sourceTypes = [
  {
    number: '01',
    title: 'Official credits',
    body: 'Declared roles from an authoritative release, publisher or rights record.',
    use: 'People, roles and work relationships',
  },
  {
    number: '02',
    title: 'Creator statements',
    body: 'Interviews or process notes attributed to the person who made the claim.',
    use: 'Intent, tools and declared process',
  },
  {
    number: '03',
    title: 'Historical context',
    body: 'Research used to place a work beside its period, scene and circulation.',
    use: 'Stories, genres and cultural readings',
  },
  {
    number: '04',
    title: 'Documented analysis',
    body: 'A reproducible method with inputs, date, limits and confidence made visible.',
    use: 'Structure, sound and computed connections',
  },
];

const verificationSteps = [
  { title: 'Collect', body: 'Record the source type, origin and the exact claim it may support.' },
  { title: 'Inspect', body: 'Check attribution, context, date and whether a stronger primary source exists.' },
  { title: 'Connect', body: 'Attach the evidence to one specific sentence, credit or computed value.' },
  { title: 'Label', body: 'Publish its status, method and uncertainty beside the information.' },
  { title: 'Review', body: 'Keep corrections and later source changes visible in the record.' },
];

const pendingRecords = [
  {
    id: 'SRC-001',
    type: 'Official credits',
    claim: 'Complete writing and production roles for the prototype song dossier.',
    status: 'awaiting',
    note: 'No public claim is promoted to verified until a suitable record is attached.',
  },
  {
    id: 'SRC-002',
    type: 'Creator statement',
    claim: 'Declared instruments, programmed elements and studio treatment.',
    status: 'awaiting',
    note: 'The visual module exists, but the evidence slot intentionally remains empty.',
  },
  {
    id: 'SRC-003',
    type: 'Analysis method',
    claim: 'Method and confidence behind structural or musical coordinates.',
    status: 'prototype',
    note: 'A real record will disclose inputs, calculation method, date and limitations.',
  },
];

const SourceLedgerPage = () => (
  <KnowledgeFrame
    className="knowledge-source-page"
    eyebrow="Public evidence · editorial infrastructure"
    title={<>Sources are part<br />of the story.</>}
    description="A public ledger for seeing what supports a Memphis page, what remains uncertain and what still needs evidence."
    breadcrumbs={[{ label: 'Source ledger' }]}
    heroAside={(
      <div className="source-ledger-mark" role="img" aria-label="Public evidence ledger with three pending records">
        <span>PUBLIC LEDGER</span>
        <strong>03</strong>
        <div>
          <i aria-hidden="true" />
          <i aria-hidden="true" />
          <i aria-hidden="true" />
        </div>
        <small>Evidence before certainty</small>
      </div>
    )}
    heroActions={(
      <>
        <a className="knowledge-button knowledge-button--primary" href="#source-ledger-records">Inspect the records</a>
        <Link className="knowledge-button knowledge-button--quiet" to="/atlas/song/die-young#sources">Return to the song sources</Link>
      </>
    )}
  >
    <section className="source-ledger-boundary" aria-labelledby="source-ledger-boundary-title">
      <header>
        <ContentBadge status="editorial" />
        <p className="knowledge-kicker">A deliberate boundary</p>
        <h2 id="source-ledger-boundary-title">Public evidence is not your private reference shelf.</h2>
      </header>

      <div className="source-ledger-boundary__grid">
        <article className="source-ledger-boundary__card source-ledger-boundary__card--public">
          <span>Public / this page</span>
          <h3>Memphis Source Ledger</h3>
          <p>Evidence selected by the editorial process to support published credits, stories, analysis and connections.</p>
          <ul>
            <li>Visible publication status</li>
            <li>Claim-level attribution</li>
            <li>Method and uncertainty</li>
            <li>Correction history</li>
          </ul>
          <strong>Readable by everyone</strong>
        </article>

        <article className="source-ledger-boundary__card source-ledger-boundary__card--private">
          <span>Private / My Memphis</span>
          <h3>Your References</h3>
          <p>A personal place for material you save while learning. Saving something does not publish or endorse it.</p>
          <ul>
            <li>Controlled by the user</li>
            <li>Not an editorial citation</li>
            <li>Not exposed in public dossiers</li>
            <li>Deletable from the personal space</li>
          </ul>
          <Link to="/references">Open your private references ↗</Link>
        </article>
      </div>
    </section>

    <section className="source-ledger-types" aria-labelledby="source-ledger-types-title">
      <header className="knowledge-section-heading">
        <div>
          <p className="knowledge-kicker">Evidence vocabulary</p>
          <h2 id="source-ledger-types-title">Different questions need different sources.</h2>
        </div>
        <p>A source type describes what the record can support. It does not make every claim inside it automatically reliable.</p>
      </header>

      <div className="source-ledger-types__grid">
        {sourceTypes.map((source) => (
          <article className="source-ledger-type" key={source.number}>
            <span>{source.number}</span>
            <ContentBadge status="editorial" compact />
            <h3>{source.title}</h3>
            <p>{source.body}</p>
            <div>
              <small>Used for</small>
              <strong>{source.use}</strong>
            </div>
          </article>
        ))}
      </div>
    </section>

    <section className="source-ledger-workflow" aria-labelledby="source-ledger-workflow-title">
      <header>
        <ContentBadge status="prototype" />
        <p className="knowledge-kicker">Verification workflow</p>
        <h2 id="source-ledger-workflow-title">From material to a supported claim.</h2>
        <p>The interface keeps verification visible instead of turning “has a link” into “is a fact.”</p>
      </header>

      <ol className="source-ledger-workflow__rail">
        {verificationSteps.map((step, index) => (
          <li key={step.title}>
            <span>{String(index + 1).padStart(2, '0')}</span>
            <div>
              <h3>{step.title}</h3>
              <p>{step.body}</p>
            </div>
            {index < verificationSteps.length - 1 && <i aria-hidden="true">→</i>}
          </li>
        ))}
      </ol>
    </section>

    <section className="source-ledger-records" id="source-ledger-records" aria-labelledby="source-ledger-records-title">
      <header className="knowledge-section-heading">
        <div>
          <p className="knowledge-kicker">Dossier / Die Young / source slots</p>
          <h2 id="source-ledger-records-title">Pending is an honest state.</h2>
        </div>
        <Link to="/atlas/song/die-young#sources">See these slots inside the dossier →</Link>
      </header>

      <div className="source-ledger-record-list">
        {pendingRecords.map((record) => (
          <article className="source-ledger-record" key={record.id}>
            <div className="source-ledger-record__identity">
              <span>{record.id}</span>
              <strong>{record.type}</strong>
            </div>
            <div className="source-ledger-record__claim">
              <small>Claim waiting for support</small>
              <h3>{record.claim}</h3>
              <p>{record.note}</p>
            </div>
            <ContentBadge status={record.status} compact />
            <div className="source-ledger-record__empty" role="group" aria-label="No public source attached">
              <span aria-hidden="true">+</span>
              <strong>No public evidence attached</strong>
            </div>
          </article>
        ))}
      </div>
    </section>

    <section className="source-ledger-method" aria-labelledby="source-ledger-method-title">
      <header>
        <p className="knowledge-kicker">Publication methodology</p>
        <h2 id="source-ledger-method-title">What the ledger promises.</h2>
      </header>
      <div className="source-ledger-method__grid">
        <article>
          <span>01</span>
          <h3>One source, bounded use.</h3>
          <p>Evidence supports a named claim—not every possible conclusion around it.</p>
        </article>
        <article>
          <span>02</span>
          <h3>Interpretation stays labeled.</h3>
          <p>An editorial reading can be sourced and still remain a reading rather than a verified fact.</p>
        </article>
        <article>
          <span>03</span>
          <h3>Computations expose method.</h3>
          <p>Inputs, confidence, limitations and calculation date belong beside computed connections.</p>
        </article>
        <article>
          <span>04</span>
          <h3>Absence is not permission to invent.</h3>
          <p>Unverified credits and process details remain empty until suitable evidence exists.</p>
        </article>
      </div>
    </section>

    <aside className="source-ledger-correction">
      <div>
        <ContentBadge status="prototype" />
        <p className="knowledge-kicker">Correction path</p>
        <h2>Evidence can change. The history should remain understandable.</h2>
        <p>A future correction flow will record what changed, why it changed and which source now supports the public page.</p>
      </div>
      <span>Correction interface not active</span>
    </aside>

    <aside className="knowledge-next-step source-ledger-next-step">
      <div>
        <p className="knowledge-kicker">Return to the work</p>
        <h2>See where every evidence record belongs.</h2>
        <p>The song dossier keeps sources beside sound, credits, story and connections.</p>
      </div>
      <Link className="knowledge-button knowledge-button--primary" to="/atlas/song/die-young#sources">
        Back to the source section
      </Link>
    </aside>
  </KnowledgeFrame>
);

export default SourceLedgerPage;
