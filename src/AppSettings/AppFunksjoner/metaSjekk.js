import redirectTo from "./redirectTo";

export default function metaSjekk(meta, parent) {
  if (!meta) return;
  // barn = lag
  meta.barn = [];
  Object.values(meta.lag).forEach(lag => {
    meta.barn.push(...Object.values(lag));
  });

  meta.barn.forEach(b => (b.opacity = 0.9));
  meta.erSynlig = true;
}
