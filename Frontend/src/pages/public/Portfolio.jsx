import { useState } from 'react';
import { Search } from 'lucide-react';
import { useProjects } from '../../hooks/usePublicData.js';
import { Stagger } from '../../components/ui/AnimatedReveal.jsx';
import { ProjectCard } from '../../components/sections/ProjectCard.jsx';
import { EmptyState, NoResultsState, Skeleton } from '../../components/ui/States.jsx';
import { Pagination } from '../../components/ui/Pagination.jsx';
import { useDebouncedValue } from '../../hooks/useDebouncedValue.js';
import { useDocumentHead } from '../../hooks/useDocumentHead.js';

export default function Portfolio() {
  useDocumentHead({
    title: 'Portfolio - Our Work',
    description: "A selection of projects we've delivered - genuine client work and outcomes.",
  });

  const [category, setCategory] = useState('all');
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const debouncedSearch = useDebouncedValue(search, 400);

  const { data, isLoading, isError } = useProjects({
    category,
    search: debouncedSearch || undefined,
    page,
    limit: 9,
  });

  const projects = data?.data || [];
  const categories = data?.meta?.categories || [];

  return (
    <div>
      <section className="bg-ink-950 text-white section-y">
        <div className="container-page text-center">
          <span className="badge bg-white/10 text-white/70">Portfolio</span>
          <h1 className="mt-5 text-4xl font-extrabold sm:text-5xl">Genuine work, real outcomes</h1>
          <p className="mx-auto mt-5 max-w-2xl text-white/60">
            A selection of projects we've delivered - each entry reflects real client work.
          </p>
        </div>
      </section>

      <section className="section-y container-page">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="relative w-full sm:max-w-xs">
            <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-900/35" />
            <input
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              placeholder="Search projects..."
              className="input-field pl-10"
            />
          </div>
          <div className="flex flex-wrap gap-2">
            <button
              onClick={() => { setCategory('all'); setPage(1); }}
              className={`rounded-full px-4 py-2 text-sm font-medium transition ${category === 'all' ? 'bg-ink-900 text-white' : 'bg-white text-ink-900/60 hover:bg-ink-900/5'}`}
            >
              All
            </button>
            {categories.map((c) => (
              <button
                key={c}
                onClick={() => { setCategory(c); setPage(1); }}
                className={`rounded-full px-4 py-2 text-sm font-medium capitalize transition ${category === c ? 'bg-ink-900 text-white' : 'bg-white text-ink-900/60 hover:bg-ink-900/5'}`}
              >
                {c}
              </button>
            ))}
          </div>
        </div>

        {isLoading ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 6 }).map((_, i) => <Skeleton key={i} className="h-72" />)}
          </div>
        ) : isError ? (
          <EmptyState title="Couldn't load projects" description="Please refresh the page or try again shortly." />
        ) : !projects.length ? (
          debouncedSearch || category !== 'all' ? <NoResultsState /> : <EmptyState title="No projects published yet" description="Add real, genuine projects from the Admin panel to build your portfolio." />
        ) : (
          <>
            <Stagger className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {projects.map((p) => <ProjectCard key={p._id} project={p} />)}
            </Stagger>
            <Pagination page={data.meta.page} totalPages={data.meta.totalPages} onPageChange={setPage} />
          </>
        )}
      </section>
    </div>
  );
}
