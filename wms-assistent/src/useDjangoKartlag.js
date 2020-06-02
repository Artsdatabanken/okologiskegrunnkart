import { useState } from "react";

// Gjør automatisk oppdatering av Django via Form
const url = (layerNum) =>
  `/admin/forvaltningsportal/wmshelper/${layerNum}/change/`;

async function requestDjangoFormToken(layerNum) {
  const resp = await fetch(url);
  const html = await resp.text();
  const csrfmiddlewaretoken = html.match(
    /csrfmiddlewaretoken.*?value="(.*?)"/i
  );
  return csrfmiddlewaretoken[1];
}

function encode(value) {
  return encodeURIComponent(value || "");
}

async function update(doc) {
  const csrfmiddlewaretoken = await requestDjangoFormToken(doc._id);
  console.log("csrfmiddlewaretoken", csrfmiddlewaretoken);
  await fetch(url(doc._id), {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: `csrfmiddlewaretoken=${csrfmiddlewaretoken}&tittel=${
      doc.tittel
    }&wmsurl=${encode(doc.wmsurl)}&wmsversion=${encode(
      doc.wmsversion
    )}&projeksjon=${encode(doc.projeksjon)}&wmsinfolayers=${encode(
      doc.wmsinfolayers
    )}&testkoordinater=${encode(doc.testkoordinater)}&wmsinfoformat=${encode(
      doc.wmsinfoformat
    )}&klikkurl=${encode(doc.klikkurl)}&klikktekst=${encode(
      doc.klikktekst
    )}&klikktekst2=${encode(
      doc.klikktekst2
    )}&_continue=Save+and+continue+editing`,
  });
}

function useDjangoKartlag() {
  const [isLoading, setLoading] = useState(false);
  const writeUpdate = async (doc) => {
    setLoading(true);
    console.log("writeUpdate");
    await update(doc);
    setLoading(false);
  };
  return { isLoading, writeUpdate };
}

export default useDjangoKartlag;
