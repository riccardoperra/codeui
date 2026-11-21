import "../shared/base.css";
import { Badge, Link, Text } from "@codeui/kit";
import { For } from "solid-js";
import { render } from "@solidjs/web";
import { docsUrl, examples } from "../shared/examples";
import "./gallery.css";

/** The index of the standalone build. On the docs site the gallery is the `/examples` page. */
function Gallery() {
	return (
		<main class="gallery">
			<header class="gallery-header">
				<Text as="h1" size="lg" weight="semibold">
					Made with CodeUI
				</Text>
				<Text as="p" size="sm" tone="muted">
					Solid apps built with <Link href={docsUrl}>@codeui/kit</Link> and the Inkstone design language.
				</Text>
			</header>
			<ul class="gallery-list">
				<For each={examples}>
					{example => (
						<li>
							<a class="gallery-card" href={`./${example.slug}/`}>
								<span class="gallery-card-title">
									<Text size="md" weight="semibold">
										{example.title}
									</Text>
									<Badge>{example.kind}</Badge>
								</span>
								<Text as="span" size="caption" tone="muted">
									{example.description}
								</Text>
							</a>
						</li>
					)}
				</For>
			</ul>
		</main>
	);
}

render(() => <Gallery />, document.getElementById("root")!);
