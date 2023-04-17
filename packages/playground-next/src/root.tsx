// @refresh reload
import { createSignal, Suspense } from "solid-js";
import {
	A,
	Body,
	ErrorBoundary,
	FileRoutes,
	Head,
	Html,
	Meta,
	Routes,
	Scripts,
	Title,
} from "solid-start";
import "./root.css";
import "./root.css.ts";
import "./preflight.css";
import { theme as themeClass } from "@codeui/kit";

export default function Root() {
	const [theme, setTheme] = createSignal("dark");

	return (
		<Html lang="en" class={themeClass} data-cui-theme={theme()}>
			<Head>
				<Title>SolidStart - Bare</Title>
				<Meta charset="utf-8" />
				<Meta name="viewport" content="width=device-width, initial-scale=1" />
				<link rel="preconnect" href="https://fonts.googleapis.com" />
				<link rel="preconnect" href="https://fonts.gstatic.com" />
				<link
					href="https://fonts.googleapis.com/css2?family=Manrope:wght@400;500;600;700&display=swap"
					rel="stylesheet"
				/>
			</Head>
			<Body>
				<Suspense>
					<ErrorBoundary>
						<A href="/">Index</A>
						<A href="/button">Button</A>
						<A href="/icon-button">IconButton</A>
						<Routes>
							<FileRoutes />
						</Routes>
					</ErrorBoundary>
				</Suspense>
				<Scripts />
			</Body>
		</Html>
	);
}
