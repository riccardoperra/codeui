// @refresh reload
import { Button } from "@codeui/kit";
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
import { Sidebar, SidebarItem } from "./components/ui/Sidebar";
import "./preflight.css";
import "./root.css";
import * as styles from "./root.css.ts";
import "./tailwind-preflight.css";

export default function Root() {
	const [theme, setTheme] = createSignal("dark");

	return (
		<Html lang="en" data-cui-theme={theme()}>
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
						<div class={styles.scaffold}>
							<Sidebar>
								<div>
									<Button
										onClick={() =>
											setTheme(theme => (theme === "light" ? "dark" : "light"))
										}
										theme={"tertiary"}
										block
									>
										Switch theme
									</Button>
								</div>

								<SidebarItem>
									<A href="/">Index</A>
								</SidebarItem>
								<SidebarItem>
									<A href="/button">Button</A>
								</SidebarItem>
								<SidebarItem>
									<A href="/icon-button">IconButton</A>
								</SidebarItem>
								<SidebarItem>
									<A href="/link">Link</A>
								</SidebarItem>
								<SidebarItem>
									<A href="/radio">Radio</A>
								</SidebarItem>
								<SidebarItem>
									<A href="/dropdown-menu">Dropdown Menu</A>
								</SidebarItem>
								<SidebarItem>
									<A href="/dialog">Dialog</A>
								</SidebarItem>
								<SidebarItem>
									<A href="/popover">Popover</A>
								</SidebarItem>
								<SidebarItem>
									<A href="/text-input">Text Input</A>
								</SidebarItem>
								<SidebarItem>
									<A href="/select">Select</A>
								</SidebarItem>
								<SidebarItem>
									<A href="/tooltip">Tooltip</A>
								</SidebarItem>
								<SidebarItem>
									<A href="/pagination">Pagination</A>
								</SidebarItem>
								<SidebarItem>
									<A href="/icons">Icons</A>
								</SidebarItem>
							</Sidebar>
							<div class={styles.layoutContent}>
								<Routes>
									<FileRoutes />
								</Routes>
							</div>
						</div>
					</ErrorBoundary>
				</Suspense>
				<Scripts />
			</Body>
		</Html>
	);
}
