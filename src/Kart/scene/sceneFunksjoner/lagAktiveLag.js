import byggLag from "./byggLag";

function lagAktiveLag(aktive, config, token) {
  Object.keys(aktive).forEach(kode => {
    let lag = aktive[kode];
    if (!lag.erSynlig) return;
    byggLag(lag, config, token);
  });
}

export default lagAktiveLag;
