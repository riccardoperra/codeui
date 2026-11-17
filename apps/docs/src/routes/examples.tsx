import { createFileRoute } from '@tanstack/react-router';
import { HomeLayout } from 'fumadocs-ui/layouts/home';
import { homeOptions } from '@/lib/layout.shared';
import { examples, exampleShot, exampleUrl, type Example } from '@/lib/examples';
import { gitConfig } from '@/lib/shared';

export const Route = createFileRoute('/examples')({
  head: () => ({
    meta: [
      { title: 'Made with CodeUI' },
      { name: 'description', content: 'Full-screen Solid apps built with @codeui/kit and the Inkstone design language.' },
    ],
  }),
  component: Examples,
});

function Examples() {
  return (
    <HomeLayout {...homeOptions()}>
      <div className="home">
        <section className="home-hero">
          <h1>Made with CodeUI</h1>
          <p>
            Four Solid apps built with the kit and nothing else for the interface. Each one opens full screen, follows
            Inkstone in both themes, and works from the keyboard and on a phone.
          </p>
        </section>
        <ul className="examples-grid">
          {examples.map((example) => (
            <Card key={example.slug} example={example} />
          ))}
        </ul>
      </div>
    </HomeLayout>
  );
}

function Card({ example }: { example: Example }) {
  const source = `https://github.com/${gitConfig.user}/${gitConfig.repo}/tree/${gitConfig.branch}/apps/examples/src/${example.slug}`;
  return (
    <li className="examples-card">
      {/* A plain anchor: the example is a static page outside the router, so it needs a full load. */}
      <a href={exampleUrl(example.slug)} className="examples-shot" aria-label={`Open ${example.title}`}>
        {/* Both themes ship, and CSS shows the one that matches the page. */}
        <img src={exampleShot(example.slug, 'dark')} alt="" width={1440} height={900} loading="lazy" data-theme="dark" />
        <img src={exampleShot(example.slug, 'light')} alt="" width={1440} height={900} loading="lazy" data-theme="light" />
      </a>
      <div className="examples-text">
        <h2>
          {example.title}
          <span className="examples-kind">{example.kind}</span>
        </h2>
        <p>{example.description}</p>
        <p className="examples-uses">{example.uses.join(' · ')}</p>
      </div>
      <div className="examples-actions">
        <a href={exampleUrl(example.slug)} className="home-button" data-variant="primary">
          Open<span className="sr-only"> {example.title}</span>
        </a>
        <a href={source} className="home-button">
          Source<span className="sr-only"> of {example.title}</span>
        </a>
      </div>
    </li>
  );
}
