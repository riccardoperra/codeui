import { createFileRoute } from '@tanstack/react-router';
import { HomeLayout } from 'fumadocs-ui/layouts/home';
import Link from 'fumadocs-core/link';
import { useEffect, useState, type CSSProperties } from 'react';
import { useSolidDemo } from '@/components/solid-demo';
import { baseOptions } from '@/lib/layout.shared';
import { showcase, type ShowcaseTile } from '@/lib/showcase';

export const Route = createFileRoute('/')({
  component: Home,
});

const installCommand = 'pnpm add @codeui/kit';

function Home() {
  return (
    <HomeLayout
      {...baseOptions()}
      links={[
        { text: 'Docs', url: '/docs' },
        { text: 'Inkstone', url: '/docs/design' },
      ]}
    >
      <div className="home">
        <section className="home-hero">
          <h1>CodeUI</h1>
          <p>
            The Solid component kit behind CodeImage. It builds on Kobalte’s accessible primitives, compiles its styles
            with vanilla-extract, and follows the Inkstone design language.
          </p>
          <div className="home-actions">
            <Link href="/docs" className="home-button" data-variant="primary">
              Get started
            </Link>
            <Link href="/docs/design" className="home-button">
              Inkstone
            </Link>
            <InstallCommand />
          </div>
        </section>
        <section className="home-grid" aria-label="Live components">
          {showcase.map((tile, index) => (
            <Tile key={tile.demo} tile={tile} index={index} />
          ))}
        </section>
      </div>
    </HomeLayout>
  );
}

function Tile({ tile, index }: { tile: ShowcaseTile; index: number }) {
  const demo = useSolidDemo(tile.demo);
  return (
    <article className="home-tile" aria-label={tile.title} style={{ '--i': index } as CSSProperties}>
      {demo.hydration}
      <div {...demo.host} />
      <Link href={tile.href} className="home-tile-link">
        {tile.title}
        <span aria-hidden="true">→</span>
      </Link>
    </article>
  );
}

function InstallCommand() {
  const [copied, setCopied] = useState(false);
  useEffect(() => {
    if (!copied) return;
    const timer = setTimeout(() => setCopied(false), 2000);
    return () => clearTimeout(timer);
  }, [copied]);
  return (
    <div className="home-install">
      <code>{installCommand}</code>
      <button
        type="button"
        className="home-button"
        onClick={() => navigator.clipboard.writeText(installCommand).then(() => setCopied(true))}
      >
        {/* Both labels share one cell, so the button keeps the width of the longer one. */}
        <span className="home-swap" data-copied={copied}>
          <span>Copy</span>
          <span>Copied</span>
        </span>
        <span className="sr-only"> install command</span>
      </button>
      <span role="status" className="sr-only">
        {copied ? 'Copied' : ''}
      </span>
    </div>
  );
}
