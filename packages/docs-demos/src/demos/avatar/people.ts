/** A local picture, so the demos do not depend on the network. */
export const picture =
	"data:image/svg+xml;utf8," +
	encodeURIComponent(
		`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64"><defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#f6c28b"/><stop offset="1" stop-color="#c4795a"/></linearGradient></defs><rect width="64" height="64" fill="url(#g)"/><circle cx="32" cy="26" r="11" fill="#5b3a29"/><path d="M12 64c2-14 10-20 20-20s18 6 20 20z" fill="#2f4f6f"/></svg>`,
	);
