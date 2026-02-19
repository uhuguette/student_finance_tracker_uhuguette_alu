export function compileRegex(input) {
  try {
    if (!input) return null;
    // use global + case-insensitive so highlighting replaces all matches
    return new RegExp(input, "gi");
  } catch {
    return null;
  }
}

function escapeHtml(s) {
  return s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

export function highlight(text, re) {
  if (!re) return escapeHtml(text);

  // ensure global flag on regex for iterative matching
  const flags = re.flags.includes("g") ? re.flags : re.flags + "g";
  const g = new RegExp(re.source, flags);

  let lastIndex = 0;
  let out = "";
  let match;

  while ((match = g.exec(text)) !== null) {
    out += escapeHtml(text.slice(lastIndex, match.index));
    out += `<mark>${escapeHtml(match[0])}</mark>`;
    lastIndex = g.lastIndex;
    if (match[0].length === 0) g.lastIndex++; // guard
  }

  out += escapeHtml(text.slice(lastIndex));
  return out;
}
