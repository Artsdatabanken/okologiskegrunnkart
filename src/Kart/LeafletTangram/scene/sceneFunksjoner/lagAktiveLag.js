import byggLag from "./byggLag";

function lagAktiveLag(aktive, viserKatalog, opplyst, config) {
  Object.keys(aktive).forEach(kode => {
    let lag = aktive[kode];
    console.log("xxxx", lag);
    if (!lag.erSynlig && opplyst.kode !== lag.kode) return;
    byggLag(lag, opplyst, config, viserKatalog);
  });
}

export default lagAktiveLag;
