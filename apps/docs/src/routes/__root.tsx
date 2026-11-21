import { createRootRoute, HeadContent, Outlet, Scripts } from '@tanstack/react-router';
import appCss from '@/styles/app.css?url';
import { RootProvider } from 'fumadocs-ui/provider/tanstack';

const themeBridge = `(()=>{const r=document.documentElement,s=()=>r.setAttribute('data-cui-theme',r.classList.contains('dark')?'dark':'light');new MutationObserver(s).observe(r,{attributes:true,attributeFilter:['class']});s()})()`;

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { title: 'CodeUI' },
      { name: 'description', content: 'Documentation for Inkstone components for Solid and React.' },
    ],
    links: [{ rel: 'stylesheet', href: appCss }],
  }),
  component: RootComponent,
});

function RootComponent() {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <HeadContent />
        <script dangerouslySetInnerHTML={{ __html: themeBridge }} />
      </head>
      <body className="flex flex-col min-h-screen">
        <RootProvider theme={{ defaultTheme: 'dark' }}>
          <Outlet />
        </RootProvider>
        <Scripts />
      </body>
    </html>
  );
}
