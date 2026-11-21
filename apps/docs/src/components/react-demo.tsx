import { demos as controls } from './react-examples/controls';
import { demos as interactive } from './react-examples/interactive';
import { demos as layout } from './react-examples/layout';

const demos = { ...controls, ...interactive, ...layout };

export default function ReactDemo({ name }: { name: keyof typeof demos }) {
  const Demo = demos[name];

  return (
    <div className="not-prose my-6 grid min-h-40 place-items-center rounded-2xl bg-fd-card p-4 sm:p-8" data-react-demo={name}>
      <div className="min-w-0 max-w-full">
        <Demo />
      </div>
    </div>
  );
}
