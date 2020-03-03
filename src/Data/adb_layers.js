function mapAktivtTrinn(el, key, outkey, dict) {
  if (!el.environment) return;
  const x = el.environment[key];
  if (!x) return;
  const trinn = x.barn.find(e => e.aktiv);
  x.trinn = { kode: trinn.kode, tittel: trinn.tittel.nb };
  dict[outkey] = x;
}

export default function adb_layers(el) {
  let dict = {};
  dict["kommune"] = { kommune: el.kommune, fylke: el.fylke };
  mapAktivtTrinn(el, "NN-NA-BS-6SO", "sone", dict);
  mapAktivtTrinn(el, "NN-NA-BS-6SE", "seksjon", dict);
  mapAktivtTrinn(el, "NN-NA-LKM-KA", "kalk", dict);
  return dict;
}
