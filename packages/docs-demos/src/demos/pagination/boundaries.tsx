import { Pagination } from "@codeui/kit";
export default function Boundaries() {
	return <div><p>First page</p><Pagination pages={12} initialPage={1} showFirst showLast /><p>Last page</p><Pagination pages={12} initialPage={12} showFirst showLast /><p>One page</p><Pagination pages={1} showFirst showLast /></div>;
}
