import { Pagination } from "@codeui/kit";
export default function Window() {
	return <div><p>One sibling on either side</p><Pagination pages={20} initialPage={10} maxPages={3} /><p>Two siblings on either side</p><Pagination pages={20} initialPage={10} maxPages={5} /><p>Hide unavailable navigation</p><Pagination pages={20} showPrev={page => page > 1} showNext={(page, pages) => page < pages} /></div>;
}
