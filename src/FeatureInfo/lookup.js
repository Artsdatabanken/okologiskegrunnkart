export default function lookup(barn) {
  if (!barn) return null;
  const r = barn.filter(b => b.aktiv);
  if (r.length > 0) return r[0];
  return null;
}
