import { CodeBlock, Pre } from 'fumadocs-ui/components/codeblock';

type Token = { kind?: 'tag' | 'attr' | 'value' | 'comment'; text: string };

/**
 * Splits an HTML demo into tokens at render time. Shiki at build time turned every token of the
 * 184 demos into styled spans in the server bundle, which pushed the Cloudflare worker past its size
 * limit. Demos only need tags, attributes, values and comments told apart.
 */
function tokenize(source: string): Token[] {
  const tokens: Token[] = [];
  for (const part of source.split(/(<!--[\s\S]*?-->|<\/?[a-zA-Z][^>]*>)/)) {
    if (!part) continue;
    if (part.startsWith('<!--')) {
      tokens.push({ kind: 'comment', text: part });
      continue;
    }
    const tag = part.match(/^(<\/?)([a-zA-Z][\w-]*)([\s\S]*?)(\/?>)$/);
    if (!tag) {
      tokens.push({ text: part });
      continue;
    }
    const [, open, name, rest, close] = tag;
    tokens.push({ text: open }, { kind: 'tag', text: name });
    for (const piece of rest.split(/([^\s=]+(?:=(?:"[^"]*"|'[^']*'|[^\s"'>]+))?)/)) {
      const attribute = piece.trim() ? piece.match(/^([^\s=]+)(?:(=)([\s\S]*))?$/) : null;
      if (!attribute) tokens.push({ text: piece });
      else {
        tokens.push({ kind: 'attr', text: attribute[1] });
        if (attribute[2]) tokens.push({ text: '=' }, { kind: 'value', text: attribute[3] });
      }
    }
    tokens.push({ text: close });
  }
  return tokens;
}

/** Groups tokens into lines, splitting a token that spans a line break. */
function lines(tokens: Token[]): Token[][] {
  const result: Token[][] = [[]];
  for (const token of tokens) {
    token.text.split('\n').forEach((text, index) => {
      if (index > 0) result.push([]);
      if (text) result.at(-1)!.push({ ...token, text });
    });
  }
  return result;
}

export function HtmlSource({ name, source }: { name: string; source: string }) {
  return (
    <CodeBlock title={`${name}.html`} className="html-source">
      <Pre>
        <code>
          {/* Fumadocs styles each direct child of code as one line. */}
          {lines(tokenize(source)).map((line, index) => (
            <span key={index} className="line">
              {line.map((token, i) => (token.kind ? <span key={i} className={`html-${token.kind}`}>{token.text}</span> : token.text))}
            </span>
          ))}
        </code>
      </Pre>
    </CodeBlock>
  );
}
