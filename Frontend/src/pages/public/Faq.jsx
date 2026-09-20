import { useMemo, useState } from 'react';
import { PageHero } from '../../components/ui/PageHero.jsx';
import { ChevronDown, Search } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useFaqs } from '../../hooks/usePublicData.js';
import { EmptyState, NoResultsState, Skeleton } from '../../components/ui/States.jsx';
import { AnimatedReveal } from '../../components/ui/AnimatedReveal.jsx';
import { useDocumentHead } from '../../hooks/useDocumentHead.js';

function FaqItem({ faq }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="overflow-hidden rounded-xl border border-ink-900/8 bg-white">
      <button onClick={() => setOpen((o) => !o)} className="flex w-full items-center justify-between px-5 py-4 text-left" aria-expanded={open}>
        <span className="text-sm font-semibold text-ink-900">{faq.question}</span>
        <ChevronDown className={`h-4 w-4 shrink-0 text-ink-900/40 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && <p className="px-5 pb-4 text-sm leading-relaxed text-ink-900/55">{faq.answer}</p>}
    </div>
  );
}

export default function Faq() {
  useDocumentHead({
    title: 'Frequently Asked Questions',
    description: 'Answers to common questions about our process, pricing and support.',
  });

  const { data: faqs, isLoading } = useFaqs();
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('all');

  const categories = useMemo(() => ['all', ...new Set((faqs || []).map((f) => f.category))], [faqs]);

  const filtered = useMemo(() => {
    return (faqs || []).filter((f) => {
      const matchCategory = category === 'all' || f.category === category;
      const matchSearch = !search || f.question.toLowerCase().includes(search.toLowerCase()) || f.answer.toLowerCase().includes(search.toLowerCase());
      return matchCategory && matchSearch;
    });
  }, [faqs, search, category]);

  const grouped = useMemo(() => {
    return filtered.reduce((acc, f) => {
      acc[f.category] = acc[f.category] || [];
      acc[f.category].push(f);
      return acc;
    }, {});
  }, [filtered]);

  return (
    <div>
      <PageHero eyebrow="FAQ" title="Frequently asked questions" description="Quick answers to what clients ask us most. Can't find yours? Just get in touch." />

      <section className="section-y container-page">
        <div className="mx-auto max-w-3xl">
          <div className="mb-6 flex flex-col gap-3 sm:flex-row">
            <div className="relative flex-1">
              <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-900/35" />
              <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search questions..." className="input-field pl-10" />
            </div>
            <select value={category} onChange={(e) => setCategory(e.target.value)} className="input-field sm:w-48">
              {categories.map((c) => <option key={c} value={c}>{c === 'all' ? 'All Categories' : c}</option>)}
            </select>
          </div>

          {isLoading ? (
            <div className="space-y-3">{Array.from({ length: 5 }).map((_, i) => <Skeleton key={i} className="h-14" />)}</div>
          ) : !faqs?.length ? (
            <EmptyState title="No FAQs published yet" description="Add FAQs from the Admin panel." />
          ) : !filtered.length ? (
            <NoResultsState />
          ) : (
            <div className="space-y-8">
              {Object.entries(grouped).map(([cat, items]) => (
                <AnimatedReveal key={cat}>
                  <h2 className="mb-3 text-sm font-bold uppercase tracking-wider text-ink-900/40">{cat}</h2>
                  <div className="space-y-3">
                    {items.map((f) => <FaqItem key={f._id} faq={f} />)}
                  </div>
                </AnimatedReveal>
              ))}
            </div>
          )}

          <div className="mt-10 rounded-2xl bg-white p-6 text-center shadow-soft">
            <p className="font-semibold text-ink-900">Still have questions?</p>
            <p className="mt-1 text-sm text-ink-900/50">We're happy to help - reach out directly.</p>
            <Link to="/contact" className="btn-outline mt-4 inline-flex">Contact Us</Link>
          </div>
        </div>
      </section>
    </div>
  );
}
