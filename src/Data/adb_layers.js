export default function adb_layers(el) {
  let dict = {};
  if (el.kommune) {
    dict["kommune"] = { kommune: el.kommune, fylke: el.fylke };
  }
  if (el.environment["NN-NA-BS-6SO"]) {
    dict["sone"] = el.environment["NN-NA-BS-6SO"];
  }
  if (el.environment["NN-NA-BS-6SE"]) {
    dict["seksjon"] = el.environment["NN-NA-BS-6SE"];
  }
  if (el.environment["NN-NA-LKM-KA"]) {
    dict["kalk"] = el.environment["NN-NA-LKM-KA"];
  }
  return dict;
}
