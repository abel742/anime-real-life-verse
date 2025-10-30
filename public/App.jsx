import React, { useEffect, useMemo, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link, useNavigate, useParams } from 'react-router-dom';

// Helpers
const uid = () => '_' + Math.random().toString(36).substr(2, 9);
const lsGet = (key, fallback) => {
  try { return JSON.parse(localStorage.getItem(key) || JSON.stringify(fallback)); }
  catch { return fallback; }
};
const lsSet = (key, val) => localStorage.setItem(key, JSON.stringify(val));

// Sample Data
const SAMPLE_CHARACTERS = [
  { id: 'c1', name: 'Mika Kurosawa', anime: 'Starfall Academy', role: 'Energetic protagonist', tags: ['energetic','student'], image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=800&auto=format&fit=crop&ixlib=rb-4.0.3&s=1', bio: 'Mika grew up on the docks... She discovers latent powers and fights for her friends.' },
  { id: 'c2', name: 'Hayato Inoue', anime: 'Neon Borough', role: 'Quiet tech genius', tags: ['tech','quiet'], image: 'https://images.unsplash.com/photo-1607746882042-944635dfe10e?q=80&w=800&auto=format&fit=crop&ixlib=rb-4.0.3&s=2', bio: 'Hayato rebuilt his own AI companion after a lab accident.' },
  { id: 'c3', name: 'Sora Amano', anime: 'Winds of Kyoto', role: 'Kind healer', tags: ['healer','calm'], image: 'https://images.unsplash.com/photo-1527980965255-d3b416303d12?q=80&w=800&auto=format&fit=crop&ixlib=rb-4.0.3&s=3', bio: 'Sora travels the countryside to help communities in need.' },
];

const SAMPLE_QUIZ = {
  id: 'q1',
  title: 'Which anime character would be your best friend in real life?',
  questions: [
    {
      q: 'On a weekend, you prefer to:',
      options: ['Explore a city', 'Work on a project', 'Relax at home', 'Train outdoors'],
      scores: [0,1,2,3]
    },
    {
      q: 'Your ideal friend is:',
      options: ['Outgoing', 'Quiet and reliable', 'Funny', 'Protective'],
      scores: [3,2,1,0]
    }
  ],
  results: [
    { range: [0,1], text: 'You match Sora — calm and thoughtful.' },
    { range: [2,3], text: 'You match Hayato — dependable and clever.' },
    { range: [4,6], text: 'You match Mika — energetic and fun!' }
  ]
};

// Main App
export default function App() {
  return (
    <Router>
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-yellow-50">
        <Header />
        <main className="max-w-6xl mx-auto p-6">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/profiles" element={<Profiles />} />
            <Route path="/profiles/:id" element={<ProfileDetail />} />
            <Route path="/fanart" element={<FanArtGallery />} />
            <Route path="/forum" element={<Forum />} />
            <Route path="/blog" element={<Blog />} />
            <Route path="/quiz" element={<QuizPage />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

// Header/Footer
function Header() {
  return (
    <header className="bg-white shadow-sm">
      <div className="max-w-6xl mx-auto px-6 py-4 flex items-center justify-between">
        <Link to="/" className="font-extrabold text-xl">Real Life Verse</Link>
        <nav className="flex gap-4 items-center">
          <NavLink to="/profiles">Profiles</NavLink>
          <NavLink to="/fanart">Fan Art</NavLink>
          <NavLink to="/forum">Forum</NavLink>
          <NavLink to="/blog">Blog</NavLink>
          <NavLink to="/quiz">Quiz</NavLink>
        </nav>
      </div>
    </header>
  );
}
function NavLink({ to, children }) {
  return <Link to={to} className="text-sm px-3 py-2 rounded hover:bg-gray-100">{children}</Link>;
}
function Footer() {
  return (
    <footer className="mt-12 py-6 text-center text-sm text-gray-600">
      Made with ❤️ — Prototype app. Data stored locally in your browser. • Created by Somya
    </footer>
  );
}

// Home
function Home() {
  return (
    <div className="grid lg:grid-cols-3 gap-6">
      <section className="lg:col-span-2 bg-white p-6 rounded-2xl shadow">
        <h2 className="text-2xl font-bold">What if Anime Characters Were Real?</h2>
        <p className="text-gray-600 mt-2">Explore character profiles, share fan art, discuss ideas, read blog posts, and take fun quizzes.</p>

        <div className="mt-4 grid sm:grid-cols-2 gap-4">
          <Card title="Profiles" text="Browse detailed character pages and suggested real-life casting." to="/profiles" />
          <Card title="Fan Art" text="Upload and view fan-made real-life renditions of anime characters." to="/fanart" />
          <Card title="Forum" text="Join discussions and fan theories." to="/forum" />
          <Card title="Blog" text="Read and write long-form 'what if' stories." to="/blog" />
          <Card title="Quiz" text="Fun personality quizzes to match characters to you." to="/quiz" />
        </div>
      </section>

      <aside className="bg-white p-6 rounded-2xl shadow">
        <h3 className="font-semibold">Quick Picks</h3>
        <ul className="mt-3 space-y-2 text-sm text-gray-700">
          <li>Top fan art of the week</li>
          <li>Active forum threads</li>
          <li>Latest blog post</li>
        </ul>
      </aside>
    </div>
  );
}
function Card({ title, text, to }) {
  return (
    <Link to={to} className="block p-4 bg-gray-50 rounded-lg hover:shadow">
      <h4 className="font-semibold">{title}</h4>
      <p className="text-sm text-gray-600 mt-1">{text}</p>
    </Link>
  );
}

// Profiles
function Profiles() {
  const [characters, setCharacters] = useState(() => lsGet('rl_characters', SAMPLE_CHARACTERS));
  useEffect(() => lsSet('rl_characters', characters), [characters]);

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold">Character Profiles</h2>
        <AddCharacter onAdd={(c) => setCharacters(prev => [c, ...prev])} />
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {characters.map(c => (
          <article key={c.id} className="bg-white rounded-2xl shadow p-4">
            <img src={c.image} alt={c.name} className="w-full h-44 object-cover rounded" />
            <h3 className="mt-3 font-semibold">{c.name}</h3>
            <p className="text-sm text-gray-600">{c.role} • {c.anime}</p>
            <div className="mt-3 flex gap-2 flex-wrap">{(c.tags||[]).map(t => <span key={t} className="px-2 py-1 bg-gray-100 text-xs rounded">{t}</span>)}</div>
            <div className="mt-4 flex gap-2">
              <Link to={`/profiles/${c.id}`} className="px-3 py-2 bg-indigo-600 text-white rounded text-sm">View</Link>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}

function AddCharacter({ onAdd }) {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({ name:'', anime:'', role:'', tags:'', image:'', bio:'' });
  function submit(e) {
    e.preventDefault();
    const newC = { ...form, id: uid(), tags: form.tags.split(',').map(s=>s.trim()).filter(Boolean) };
    onAdd(newC);
    setForm({ name:'', anime:'', role:'', tags:'', image:'', bio:'' });
    setOpen(false);
  }
  if (!open) return <button onClick={()=>setOpen(true)} className="px-3 py-2 bg-green-600 text-white rounded">Add Character</button>;
  return (
    <form onSubmit={submit} className="bg-white p-4 rounded shadow">
      <div className="grid sm:grid-cols-2 gap-2">
        <input required placeholder="Name" value={form.name} onChange={e=>setForm({...form,name:e.target.value})} className="p-2 border rounded" />
        <input required placeholder="Anime" value={form.anime} onChange={e=>setForm({...form,anime:e.target.value})} className="p-2 border rounded" />
        <input required placeholder="Role" value={form.role} onChange={e=>setForm({...form,role:e.target.value})} className="p-2 border rounded" />
        <input placeholder="Tags (comma separated)" value={form.tags} onChange={e=>setForm({...form,tags:e.target.value})} className="p-2 border rounded" />
        <input placeholder="Image URL" value={form.image} onChange={e=>setForm({...form,image:e.target.value})} className="p-2 border rounded col-span-2" />
        <textarea placeholder="Short bio" value={form.bio} onChange={e=>setForm({...form,bio:e.target.value})} className="p-2 border rounded col-span-2" />
      </div>
      <div className="mt-2 flex gap-2">
        <button type="submit" className="px-3 py-2 bg-indigo-600 text-white rounded">Save</button>
        <button type="button" onClick={()=>setOpen(false)} className="px-3 py-2 border rounded">Cancel</button>
      </div>
    </form>
  );
}

function ProfileDetail() {
  const { id } = useParams();
  const [characters] = useState(() => lsGet('rl_characters', SAMPLE_CHARACTERS));
  const navigate = useNavigate();
  const char = characters.find(c => c.id === id);
  if (!char) return <div className="p-6 bg-white rounded">Character not found. <button onClick={()=>navigate(-1)} className="text-indigo-600">Go back</button></div>;

  return (
    <div className="bg-white p-6 rounded-2xl shadow">
      <div className="md:flex gap-6">
        <img src={char.image} alt={char.name} className="w-full md:w-1/3 rounded" />
        <div>
          <h2 className="text-2xl font-bold">{char.name}</h2>
          <p className="text-sm text-gray-600">{char.anime} • {char.role}</p>
          <p className="mt-4 text-gray-700">{char.bio}</p>
          <div className="mt-4 flex gap-2">{(char.tags||[]).map(t=> <span key={t} className="px-2 py-1 bg-gray-100 rounded text-xs">{t}</span>)}</div>
        </div>
      </div>
    </div>
  );
}

// Fan Art Gallery
function FanArtGallery() {
  const [items, setItems] = useState(() => lsGet('rl_fanart', []));
  useEffect(()=> lsSet('rl_fanart', items), [items]);

  function handleUpload(e) {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      const obj = { id: uid(), image: reader.result, title: file.name, author: 'Anonymous', created: Date.now(), likes: 0 };
      setItems(prev => [obj, ...prev]);
    };
    reader.readAsDataURL(file);
  }

  function like(id) { setItems(prev => prev.map(it => it.id === id ? {...it, likes: it.likes+1} : it)); }

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold">Fan Art Gallery</h2>
        <label className="px-3 py-2 bg-indigo-600 text-white rounded cursor-pointer">
          Upload
          <input type="file" accept="image/*" onChange={handleUpload} className="hidden" />
        </label>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {items.length === 0 && <div className="text-gray-500">No fan art yet — be the first to upload!</div>}
        {items.map(it => (
          <div key={it.id} className="bg-white rounded shadow p-3">
            <img src={it.image} alt={it.title} className="w-full h-44 object-cover rounded" />
            <div className="mt-2 flex items-center justify-between">
              <div>
                <div className="font-semibold text-sm">{it.title}</div>
                <div className="text-xs text-gray-500">by {it.author}</div>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={()=>like(it.id)} className="px-2 py-1 border rounded">❤️ {it.likes}</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Forum
function Forum() {
  const [threads, setThreads] = useState(() => lsGet('rl_forum', [
    { id: uid(), title: 'Which character would survive longest in our world?', posts: [{id: uid(), author:'User1', body:'I think a healer like Sora would do well.', created: Date.now()}], created: Date.now() }
  ]));
  useEffect(()=> lsSet('rl_forum', threads), [threads]);

  function addThread(title) {
    setThreads(prev => [{ id: uid(), title, posts: [], created: Date.now() }, ...prev]);
  }
  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold">Discussion Forum</h2>
        <ThreadCreator onCreate={addThread} />
      </div>

      <div className="space-y-4">
        {threads.map(t => <Thread key={t.id} thread={t} onUpdate={(nt)=> setThreads(prev => prev.map(x=> x.id===nt.id?nt:x))} />)}
      </div>
    </div>
  );
}
function ThreadCreator({ onCreate }) {
  const [val, setVal] = useState('');
  return (
    <div className="flex gap-2">
      <input className="p-2 border rounded" placeholder="New thread title" value={val} onChange={e=>setVal(e.target.value)} />
      <button className="px-3 py-2 bg-green-600 text-white rounded" onClick={()=>{ if(val.trim()){ onCreate(val.trim()); setVal(''); } }}>Create</button>
    </div>
  );
}
function Thread({ thread, onUpdate }) {
  const [open, setOpen] = useState(false);
  const [reply, setReply] = useState('');
  function postReply() {
    if (!reply.trim()) return;
    const nt = { ...thread, posts: [...thread.posts, { id: uid(), author: 'You', body: reply.trim(), created: Date.now() }] };
    onUpdate(nt);
    setReply('');
    setOpen(true);
  }
  return (
    <div className="bg-white rounded p-4 shadow">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="font-semibold">{thread.title}</h3>
          <div className="text-xs text-gray-500">{thread.posts.length} posts</div>
        </div>
        <div className="flex gap-2">
          <button onClick={()=>setOpen(o=>!o)} className="px-3 py-1 border rounded">{open? 'Close' : 'Open'}</button>
        </div>
      </div>
      {open && (
        <div className="mt-3">
          <div className="space-y-2">
            {thread.posts.map(p => (
              <div key={p.id} className="p-2 border rounded">
                <div className="text-xs text-gray-500">{p.author} • {new Date(p.created).toLocaleString()}</div>
                <div className="mt-1">{p.body}</div>
              </div>
            ))}
          </div>
          <div className="mt-3 flex gap-2">
            <input placeholder="Write a reply..." value={reply} onChange={e=>setReply(e.target.value)} className="flex-1 p-2 border rounded" />
            <button onClick={postReply} className="px-3 py-2 bg-indigo-600 text-white rounded">Post</button>
          </div>
        </div>
      )}
    </div>
  );
}

// Blog
function Blog() {
  const [posts, setPosts] = useState(() => lsGet('rl_blog', [
    { id: uid(), title: 'If Goku went to university', body: 'A thought experiment...', created: Date.now() }
  ]));
  useEffect(()=> lsSet('rl_blog', posts), [posts]);

  function createPost(title, body) {
    setPosts(prev => [{ id: uid(), title, body, created: Date.now() }, ...prev]);
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-bold">Blog</h2>
        <BlogCreator onCreate={createPost} />
      </div>

      <div className="space-y-4">
        {posts.map(p => (
          <article key={p.id} className="bg-white p-4 rounded shadow">
            <h3 className="font-semibold">{p.title}</h3>
            <div className="text-xs text-gray-500">{new Date(p.created).toLocaleString()}</div>
            <p className="mt-2 text-gray-700">{p.body}</p>
          </article>
        ))}
      </div>
    </div>
  );
}
function BlogCreator({ onCreate }) {
  const [open, setOpen] = useState(false);
  const [title, setTitle] = useState('');
  const [body, setBody] = useState('');
  function submit() {
    if (!title.trim() || !body.trim()) return;
    onCreate(title.trim(), body.trim());
    setTitle(''); setBody(''); setOpen(false);
  }
  if (!open) return <button onClick={()=>setOpen(true)} className="px-3 py-2 bg-green-600 text-white rounded">Write Post</button>;
  return (
    <div className="bg-white p-3 rounded shadow">
      <input placeholder="Title" value={title} onChange={e=>setTitle(e.target.value)} className="p-2 border rounded w-full mb-2" />
      <textarea placeholder="Body" value={body} onChange={e=>setBody(e.target.value)} className="p-2 border rounded w-full mb-2" />
      <div className="flex gap-2">
        <button onClick={submit} className="px-3 py-2 bg-indigo-600 text-white rounded">Publish</button>
        <button onClick={()=>setOpen(false)} className="px-3 py-2 border rounded">Cancel</button>
      </div>
    </div>
  );
}

// Quiz
function QuizPage() {
  const quiz = SAMPLE_QUIZ;
  return (
    <div className="bg-white p-6 rounded shadow">
      <h2 className="text-2xl font-bold">{quiz.title}</h2>
      <Quiz quiz={quiz} />
    </div>
  );
}
function Quiz({ quiz }) {
  const [answers, setAnswers] = useState(() => Array(quiz.questions.length).fill(null));
  const [result, setResult] = useState(null);

  function choose(qIndex, optIndex) {
    const copy = [...answers]; copy[qIndex] = optIndex; setAnswers(copy);
  }
  function submit() {
    if (answers.some(a => a === null)) { alert('Please answer all questions'); return; }
    let score = 0;
    answers.forEach((a, i) => { score += quiz.questions[i].scores[a]; });
    const res = quiz.results.find(r => score >= r.range[0] && score <= r.range[1]);
    setResult({ score, text: res?.text || 'No result' });
  }

  return (
    <div>
      {quiz.questions.map((q, i) => (
        <div key={i} className="mt-4 p-3 border rounded">
          <div className="font-semibold">{i+1}. {q.q}</div>
          <div className="mt-2 grid sm:grid-cols-2 gap-2">
            {q.options.map((opt, idx) => (
              <label key={idx} className={`p-2 border rounded cursor-pointer ${answers[i]===idx? 'bg-indigo-50':''}`}>
                <input type="radio" name={`q${i}`} checked={answers[i]===idx} onChange={()=>choose(i, idx)} className="mr-2" />{opt}
              </label>
            ))}
          </div>
        </div>
      ))}

      <div className="mt-4 flex gap-2">
        <button onClick={submit} className="px-4 py-2 bg-indigo-600 text-white rounded">Submit</button>
        <button onClick={()=>{ setAnswers(Array(quiz.questions.length).fill(null)); setResult(null); }} className="px-4 py-2 border rounded">Reset</button>
      </div>

      {result && (
        <div className="mt-4 p-4 bg-green-50 rounded">
          <div className="font-semibold">Result</div>
          <div className="mt-2">Score: {result.score}</div>
          <div className="mt-1">{result.text}</div>
        </div>
      )}
    </div>
  );
}

// Misc
function NotFound() { return <div className="bg-white p-6 rounded">Page not found</div>; }
