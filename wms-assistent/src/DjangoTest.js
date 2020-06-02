import React, { useEffect } from "react";

async function requestDjangoFormToken(layerNum) {
  const url = `https://forvaltningsportaladmin.artsdatabanken.no/admin/forvaltningsportal/kartlag/${layerNum}/change/`;
  const resp = await fetch(url);
  const html = await resp.text();
  const csrfmiddlewaretoken = html.match(
    /csrfmiddlewaretoken.*?value="(.*?)"/i
  );
  return csrfmiddlewaretoken[1];
}

async function update() {
  const csrfmiddlewaretoken = await requestDjangoFormToken(69);
  console.log("csrfmiddlewaretoken", csrfmiddlewaretoken);
  const resp = await fetch("/admin/forvaltningsportal/kartlag/69/change/", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body:
      "csrfmiddlewaretoken=" +
      csrfmiddlewaretoken +
      "&tittel=aok&wmsurl=2&faktaark=3&produktark=4&klikkurl=5&klikktekst=6&geonorgeurl=7&publiser=on&type=1&dataeier=2&tema=1&tag=4&tag=5&sublag-TOTAL_FORMS=5&sublag-INITIAL_FORMS=2&sublag-MIN_NUM_FORMS=0&sublag-MAX_NUM_FORMS=1000&sublag-0-tittel=a&sublag-0-wmslayer=b&sublag-0-legendeurl=c&sublag-0-publiser=on&sublag-0-id=227&sublag-0-hovedkartlag=69&sublag-1-tittel=d1&sublag-1-wmslayer=e&sublag-1-legendeurl=f&sublag-1-erSynlig=on&sublag-1-id=228&sublag-1-hovedkartlag=69&sublag-2-tittel=&sublag-2-wmslayer=&sublag-2-legendeurl=&sublag-2-id=&sublag-2-hovedkartlag=69&sublag-3-tittel=xxx&sublag-3-wmslayer=&sublag-3-legendeurl=&sublag-3-id=&sublag-3-hovedkartlag=69&sublag-4-tittel=&sublag-4-wmslayer=&sublag-4-legendeurl=&sublag-4-id=&sublag-4-hovedkartlag=69&sublag-__prefix__-tittel=&sublag-__prefix__-wmslayer=&sublag-__prefix__-legendeurl=&sublag-__prefix__-id=&sublag-__prefix__-hovedkartlag=69&_save=Save",
  });
  console.log("a http", resp.status);
}

const DjangoTest = () => {
  useEffect(() => {
    update();
  }, []);
  return <div>yyyXXXXXXXXXXxxxxxxxxxxxxxxxxx</div>;
};

export default DjangoTest;
