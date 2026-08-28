export const contentLabels = {
  verified: { label: 'Verified fact', className: 'is-verified' },
  prototype: { label: 'Prototype', className: 'is-prototype' },
  editorial: { label: 'Editorial reading', className: 'is-editorial' },
  computed: { label: 'Computed connection', className: 'is-computed' },
  awaiting: { label: 'Awaiting sources', className: 'is-awaiting' },
};

export const featuredSong = {
  slug: 'die-young',
  title: 'Die Young',
  artist: 'Kesha',
  year: '2012',
  eyebrow: 'Song dossier · visual prototype',
  statement: 'A pop song used here to show how Memphis can connect sound, people, context and discovery in one place.',
  disclaimer: 'The layout is complete. Content marked as prototype or awaiting sources must be researched and verified before publication.',
  quickFacts: [
    { label: 'Tempo', value: '128 BPM', status: 'prototype' },
    { label: 'Key', value: 'C♯ minor', status: 'prototype' },
    { label: 'Time', value: '3:31', status: 'prototype' },
    { label: 'Era', value: 'Early 2010s pop', status: 'editorial' },
  ],
  thesis: 'The interesting question is not only why it sounds familiar, but how repeated hooks, collaborative authorship and its cultural moment worked together.',
  structure: [
    { part: 'Intro', width: 8, tone: 'muted' },
    { part: 'Verse', width: 17, tone: 'low' },
    { part: 'Pre', width: 11, tone: 'mid' },
    { part: 'Chorus', width: 20, tone: 'high' },
    { part: 'Verse', width: 15, tone: 'low' },
    { part: 'Bridge', width: 12, tone: 'mid' },
    { part: 'Final', width: 17, tone: 'high' },
  ],
  soundNotes: [
    { title: 'Forward motion', body: 'A steady pulse and short transitions create the impression that the track rarely stops to breathe.', status: 'editorial' },
    { title: 'Hook density', body: 'Melodic and verbal hooks return in layers instead of depending on one isolated chorus.', status: 'editorial' },
    { title: 'Digital + physical', body: 'This module will separate declared instruments, programmed elements and studio treatment when sources are available.', status: 'awaiting' },
  ],
  credits: [
    { name: 'Kesha', role: 'Artist · writing', slug: 'kesha', status: 'prototype' },
    { name: 'Benny Blanco', role: 'Production · writing', slug: 'benny-blanco', status: 'prototype' },
    { name: 'Creative team', role: 'Complete credits pending', slug: 'creative-team', status: 'awaiting' },
    { name: 'Engineering team', role: 'Recording · mix · master', slug: 'engineering-team', status: 'awaiting' },
  ],
  connections: [
    { title: 'The collaborator network', kicker: 'People network', reason: 'Follow one producer through works, eras and recurring creative choices.', to: '/people/benny-blanco', status: 'prototype' },
    { title: 'Pop and youth culture', kicker: 'Historical story', reason: 'Explore how urgency, repetition and youth were translated into early-2010s pop.', to: '/stories/pop-youth', status: 'editorial' },
    { title: 'Why one act breaks through', kicker: 'Comparison lab', reason: 'A multifactor comparison of audience, timing, positioning and creative identity.', to: '/comparisons/breakthrough', status: 'editorial' },
    { title: 'Leave the algorithm', kicker: 'Memphis trail', reason: 'Move from mainstream pop toward adjacent scenes through explained steps.', to: '/picks', status: 'editorial' },
  ],
  sources: [
    { title: 'Official credits', note: 'Required before this dossier can be published as verified.', status: 'awaiting' },
    { title: 'Artist and producer interviews', note: 'Used to distinguish declared process from editorial interpretation.', status: 'awaiting' },
    { title: 'Audio analysis', note: 'Method, date and confidence will appear beside every computed value.', status: 'prototype' },
  ],
};

export const knowledgePillars = [
  { number: '01', title: 'Works & process', body: 'Songs, albums, structure, instruments, tools and complete credits.', to: '/atlas/song/die-young', accent: 'work' },
  { number: '02', title: 'People & connections', body: 'Follow collaborators through eras, roles and recurring creative choices.', to: '/people/benny-blanco', accent: 'people' },
  { number: '03', title: 'Context & culture', body: 'Genres, scenes, history, technology and the questions around a release.', to: '/genres/pop', accent: 'context' },
  { number: '04', title: 'Discovery with reasons', body: 'Trails curated around ideas, not hype or opaque recommendation loops.', to: '/picks', accent: 'discovery' },
];

export const personPrototype = {
  name: 'Benny Blanco',
  role: 'Producer · songwriter · collaborator',
  intro: 'A visual prototype for navigating a creative career through credits instead of popularity alone.',
  stats: [
    { value: '3', label: 'creative eras mapped' },
    { value: '5', label: 'roles represented' },
    { value: '—', label: 'verified works pending' },
  ],
  timeline: [
    { year: 'Era 01', title: 'Learning the grammar', body: 'Early collaborations grouped by technique and role rather than chart position.' },
    { year: 'Era 02', title: 'Scaling the hook', body: 'A network view reveals repeated collaborators and production patterns.' },
    { year: 'Era 03', title: 'Authorship in public', body: 'The producer becomes a visible artist while carrying previous creative relationships forward.' },
  ],
  roles: ['Producer', 'Writer', 'Artist', 'Collaborator', 'Creative connector'],
  works: [
    { title: 'Die Young', artist: 'Kesha', reason: 'Shared creative credit', to: '/atlas/song/die-young' },
    { title: 'Work awaiting sources', artist: 'Credit archive', reason: 'Will link after verification', to: '/atlas' },
    { title: 'Collaboration map', artist: 'Network view', reason: 'Computed from verified credits', to: '/people/benny-blanco#collaboration-map' },
  ],
};

export const genrePrototype = {
  title: 'Pop',
  subtitle: 'Not one sound. A changing relationship between craft, technology, audience and circulation.',
  coordinates: [
    { label: 'Function', value: 'Immediate recognition' },
    { label: 'Form', value: 'Flexible, hook-led' },
    { label: 'Circulation', value: 'Mass and niche coexist' },
    { label: 'Boundary', value: 'Constantly absorbs scenes' },
  ],
  questions: [
    'When does a production choice become the language of an era?',
    'How do local scenes change after mass circulation?',
    'Why is “popular” a context, not a measure of artistic worth?',
  ],
  paths: [
    { from: 'Mainstream pop', to: 'Dance-pop', bridge: 'Pulse and repetition' },
    { from: 'Dance-pop', to: 'Electronic scenes', bridge: 'Tools and texture' },
    { from: 'Mainstream pop', to: 'Alternative pop', bridge: 'Form and authorship' },
    { from: 'Alternative pop', to: 'Local scenes', bridge: 'Voice and context' },
  ],
  distinctions: [
    {
      term: 'Classical',
      kind: 'Tradition and historical field',
      note: 'A broad cultural and compositional lineage with many periods, practices and institutions.',
    },
    {
      term: 'Instrumental',
      kind: 'Description of a performance',
      note: 'It usually describes music without a sung lead; it does not identify one genre by itself.',
    },
  ],
};

export const storyPrototype = {
  title: 'Pop, youth and the feeling of an endless night',
  deck: 'A story template for connecting one production choice to a broader cultural question without pretending that one factor explains everything.',
  chapters: [
    { number: 'I', title: 'The sound of urgency', body: 'Repetition can create continuity: the night feels endless because the track avoids giving the listener a clean stopping point.' },
    { number: 'II', title: 'Youth is not one audience', body: 'Age, access, scene, platform and identity overlap. Memphis treats reception as a set of hypotheses supported by sources.' },
    { number: 'III', title: 'From track to era', body: 'A song becomes historical evidence only when read beside other works, interviews, technologies and social conditions.' },
  ],
};

export const picksPrototype = [
  { step: '01', title: 'Start with the familiar', body: 'Choose a track whose structure you can already anticipate.', tag: 'Recognition' },
  { step: '02', title: 'Follow one person', body: 'Open a producer, player or engineer and notice what changes across their credits.', tag: 'Authorship' },
  { step: '03', title: 'Cross one border', body: 'Move through a shared technique instead of a genre label.', tag: 'Technique' },
  { step: '04', title: 'Read the context', body: 'Return to the first work with a historical or cultural question.', tag: 'Context' },
  { step: '05', title: 'Listen elsewhere', body: 'Memphis gives the reason. The listening happens at the source you choose.', tag: 'External' },
];

export const comparisonPrototype = {
  title: 'Why one act breaks through and another does not',
  intro: 'Not a verdict. A workspace for comparing multiple factors without turning correlation into a single cause.',
  factors: [
    { name: 'Audience entry point', left: 82, right: 64, note: 'How quickly each act gives a new listener a recognizable identity.' },
    { name: 'Timing & circulation', left: 72, right: 58, note: 'Release context, media channels and platform conditions.' },
    { name: 'Creative distinction', left: 68, right: 75, note: 'Similarity can help discovery but make identity harder to defend.' },
    { name: 'Narrative continuity', left: 86, right: 51, note: 'How releases, visuals and public story reinforce one another over time.' },
  ],
};

export const technologyPrototype = {
  title: 'AI, digital tools and human authorship',
  intro: 'A provenance-first workspace for discussing how something was made without reducing art to the tool used to make it.',
  questions: [
    'Which decisions came from a person, a team, a model or a preset?',
    'What material was used to train, sample or transform the result?',
    'Can the process be documented without guessing from the finished sound?',
  ],
  toolGroups: [
    {
      title: 'Physical instruments',
      body: 'Performance, tuning, articulation, room and recording choices remain part of the authored result.',
      signal: 'Document performer + instrument + capture',
    },
    {
      title: 'Digital instruments',
      body: 'Synthesis, sampling, sequencing and editing are creative systems, not evidence that authorship disappeared.',
      signal: 'Document operator + source + transformation',
    },
    {
      title: 'Generative systems',
      body: 'Prompts alone rarely explain provenance. Memphis needs declared tools, inputs, edits and rights information.',
      signal: 'Document model + inputs + human decisions',
    },
  ],
  provenance: ['Declared creator roles', 'Source and rights status', 'Tools and model version', 'Human edits and selection', 'Confidence and supporting sources'],
};
