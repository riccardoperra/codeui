const {registerHooks}=require('node:module');
registerHooks({load(url,context,next){if(/\/storybook-solidjs(?:-vite)?\/(?:dist\/)?[^/]+\.js$/.test(url))return next(url,{...context,format:'commonjs'});return next(url,context)}});
