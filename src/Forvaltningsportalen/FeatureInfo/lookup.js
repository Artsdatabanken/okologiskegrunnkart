export default function lookup(barn) {
  if (!barn) return null;
  const r = Object.values(barn).filter(b => b.aktiv);
  if (r.length > 0) return r[0];
  return null;
}
