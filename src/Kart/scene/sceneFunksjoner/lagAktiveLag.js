import byggLag from "./byggLag";

function lagAktiveLag(aktive, opplyst, config, token) {
  Object.keys(aktive).forEach(kode => {
    let lag = aktive[kode];
    if (!lag.erSynlig && opplyst.kode !== lag.kode) return;
    byggLag(lag, config, token);
  });
}

export default lagAktiveLag;
