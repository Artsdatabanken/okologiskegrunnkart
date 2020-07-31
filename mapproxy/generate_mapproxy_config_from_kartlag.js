const fs = require("fs");

const special_options = {
  Arterrdlista_NTNrtruet: "styles: simple"
};

const disabled = {
  Grusogpukk_Gruspukkuttak: true,
  /*    "Marinebunnsedimenter_Bunnsedimenterdannelseregional": true,
        "Marinebunnsedimenter_Bunnsedimenterkornstrrelsedetaljert": true,
        "Marinebunnsedimenter_Bunnsedimenterkornstrrelseregional": true,
        "Marinebunnsedimenter_Sedimentasjonsmiljdetaljert": true,
        "Marinebunnsedimenter_Sedimentasjonsmiljregionalt": true,*/
  Marinelandformer_Andreformer: true,
  Marinelandformer_Glasialeformer: true,
  Marinelandformer_Grunngassrelaterteformer: true,
  Marinelandformer_Skredformer: true,

  ArealressursAR5_ArealressursAR5Arealtype: false,
  ArealressursAR5_Jordbruksareal: false,
  ArealressursAR5_Treslag: false,
  Arteravnasjonalforvaltningsinteresse_Arteravsrligstorforvaltningsinteresseomrder: false,
  Arteravnasjonalforvaltningsinteresse_Arteravsrligstorforvaltningsinteressepunkt: false,
  Arteravnasjonalforvaltningsinteresse_Arteravstorforvaltningsinteresseomrder: false,
  Arteravnasjonalforvaltningsinteresse_Arteravstorforvaltningsinteressepunkt: false,
  Arteravnasjonalforvaltningsinteresse_Fremmedearteromrder: false,
  Arteravnasjonalforvaltningsinteresse_Fremmedearterpunkt: false,
  Arterfredete_Fredetearteromrder: false,
  Arterfredete_Fredetearterpunkt: false,
  ArterPrioriterte_Prioritertearterkologiskefunksjonsomrder: false,
  ArterPrioriterte_Prioritertearteromrder: false,
  ArterPrioriterte_Prioritertearterpunkt: false,
  Arterrdlista_CRKritisktruet: false, // no work?
  Arterrdlista_DDDatamangel: false,
  Arterrdlista_ENSterkttruet: false,
  Arterrdlista_Rdlistaarterallekategorier: false,
  Arterrdlista_RERegionaltutddd: false,
  Arterrdlista_VUSrbar: false,
  Artskartfremmedearter2018_Allekategorier: false,
  Artskartfremmedearter2018_HIHyrisiko: false,
  Artskartfremmedearter2018_LOLavRisiko: false,
  Artskartfremmedearter2018_NKIngenkjentrisiko: false,
  Artskartfremmedearter2018_PHPotensielthyurisiko: false,
  Artskartfremmedearter2018_SESvrthyrisiko: false,
  BerggrunnN250_Bergartsflate1250000: false,
  BerggrunnN250_Bergartsgrense1250000: false,
  BerggrunnN250_Lineamenter: false,
  BerggrunnN50_BergartflateN50: false,
  BerggrunnN50_DekninsgskartN50: false,
  Bioklimatiskseksjon_Bioklimatiskseksjon: false,
  Bioklimatisksone_Bioklimatisksone: false,
  BreeriNorge_Breflate: false,
  BreeriNorge_Breflate18951907: false,
  BreeriNorge_Breflate19471985: false,
  BreeriNorge_Breflate19881997: false,
  BreeriNorge_Breflate19992006: false,
  BreeriNorge_Bresjo19881997: false,
  BreeriNorge_Bresjo19992006: false,
  BreeriNorge_Bresjo2014: false,
  BreeriNorge_Isras: false,
  BreeriNorge_Istykkelse: false,
  BreeriNorge_Jokulhlaup: false,
  Dybdedataterrengmodeller_havbunnrastermedgrdybdeog50skygge: false,
  ElvenettElvis_Elvenett: false,
  ElvenettElvis_Hovedelv: false,
  Fiskerireguleringerogvern_Fjordlinjerkysttorskregulering: false,
  Fiskerireguleringerogvern_Korallrevforbudsomrder: false,
  Fiskerireguleringerogvern_Nasjonalelaksefjorder: false,
  Fiskerireguleringerogvern_TareHstefeltMreogRomsdal: false,
  Fiskerireguleringerogvern_TareHstefeltNordTrndelag: false,
  Fiskerireguleringerogvern_TareHstefeltRogHordogSF: false,
  Fiskerireguleringerogvern_TareHstefeltSrTrndelag: false,
  Fiskerireguleringerogvern_Verneomrdebunnhabitat: false,
  Flomsoner_DekningskartAnalyseomrde: false,
  Flomsoner_Flomsone1000rsflom: false,
  Flomsoner_Flomsone10rsflom: false,
  Flomsoner_Flomsone200rsflom: false,
  Flomsoner_Flomsone20rsflom: false,
  Flomsoner_Flomsone500rsflom: false,
  Flomsoner_Flomsone50rsflom: false,
  Forurensetgrunn_Forurensetomrdepunkt: false,
  Forurensetgrunn_Forurensetomrdetilstand: false,
  Forurensetgrunn_Forurensetomrdetilstandpunkt: false,
  Geologiskarv_Geologiskarv: false,
  Grusogpukk_Gruspukkomrde: false,
  Grusogpukk_Steintipp: false,
  Gyteomrder_Gyteomrder: false,
  Innsjdatabase_Dybdekart: false,
  Innsjdatabase_DybdeKurve: false,
  Innsjdatabase_Dybdepunkt: false,
  Innsjdatabase_Innsjdatabase: false,
  Innsjdatabase_Innsjoveddybdemaling: false,
  Korallrev_KorallrevLopheliapertusa: false,
  Korallrevsannsynligeforekomster_Dekningskart: false,
  Korallrevsannsynligeforekomster_Omriss: false,
  Korallrevsannsynligeforekomster_Plitelighet: false,
  Korallrevsannsynligeforekomster_Tetthetantallprkm2: false,
  Kulturlandskaputvalgte_Kulturlandskaputvalgte: false,
  Kulturlandskapverdifulle_Kulturlandskapverdifulle: false,
  Kulturminnerlokaliteter_Kulturminnerlokaliteter: false,
  LandskapNiN_Fjordlandskap: false,
  LandskapNiN_Innlandsdallandskap: false,
  LandskapNiN_Innlandsslettelandskap: false,
  LandskapNiN_Innlandssogfjellandskap: false,
  LandskapNiN_Kystslettelandskap: false,
  LandskapNiN_Marinelandskap: false,
  LandskapsgradienterNiN_Arealbruksintenistet: false,
  LandskapsgradienterNiN_Brepreg: false,
  LandskapsgradienterNiN_Indreytrekyst: false,
  LandskapsgradienterNiN_Innsjpreg: false,
  LandskapsgradienterNiN_Kystavstand: false,
  LandskapsgradienterNiN_Vegetasjon: false,
  LandskapsgradienterNiN_Vtmarkspreg: false,
  Livsmiljer_Bekkeklfter: false,
  Livsmiljer_BergveggerFlate: false,
  Livsmiljer_BergveggerLinje: false,
  Livsmiljer_Brannflater: false,
  Livsmiljer_Dekningskartdetalj: false,
  Livsmiljer_Dekningskartoversikt: false,
  Livsmiljer_Eldrelauvsuksesjon: false,
  Livsmiljer_Gamletrr: false,
  Livsmiljer_Hulelauvtrar: false,
  Livsmiljer_Leirraviner: false,
  Livsmiljer_Liggendeddved: false,
  Livsmiljer_Livsmiljer: false,
  Livsmiljer_Rikbakkevegetasjon: false,
  Livsmiljer_Rikbarkstrr: false,
  Livsmiljer_Staendeddved: false,
  Livsmiljer_Trrmedhengelav: false,
  Lsmasse_Lsmasse: false,
  Marinebiotoper_BiotoperBarentshavetMAREANO: false,
  Marinebiotoper_BiotoperMidtnorsksokkel: false,
  Marinebiotoper_BiotoperNordlandVI: false,
  Marinebiotoper_BiotoperTromsIINordlandVII: false,
  Marinelandskap_MarineLandskap: false,
  Maringrense_Maringrense: false,
  Maringrense_Maringrensearealover: false,
  Maringrense_Maringrensearealunder: false,
  Maringrense_Maringrenselinje: false,
  Maringrense_Muligmarinleire: false,
  Marinleiremuligforekomst_Marinleiremuligforekomst: false,
  NaturtyperDNHndbok13_Hovednaturtypeandreviktige: false,
  NaturtyperDNHndbok13_Hovednaturtypeferskvannogvrmark: false,
  NaturtyperDNHndbok13_Hovednaturtypefjell: false,
  NaturtyperDNHndbok13_Hovednaturtypekulturlandskap: false,
  NaturtyperDNHndbok13_HovednaturtypeKystoghavstrand: false,
  NaturtyperDNHndbok13_Hovednaturtypemyrogkilde: false,
  NaturtyperDNHndbok13_Hovednaturtyperasmarkbergogkantkratt: false,
  NaturtyperDNHndbok13_Hovednaturtypeskog: false,
  NaturtyperDNHndbok13_NaturtyperDNHndbok13: false,
  NaturtyperDNHndbok19_Marinenaturtyperalle: false,
  NaturtyperDNHndbok19_Marinenaturtyperbltbunn: false,
  NaturtyperDNHndbok19_Marinenaturtyperlegras: false,
  NaturtyperDNHndbok19_Marinenaturtyperlitoral: false,
  NaturtyperDNHndbok19_Marinenaturtyperoksygen: false,
  NaturtyperDNHndbok19_Marinenaturtyperpollerogdyp: false,
  NaturtyperDNHndbok19_Marinenaturtyperskjellsand: false,
  NaturtyperDNHndbok19_Marinenaturtypertare: false,
  NaturtyperDNHndbok19_Marinenaturtypertidevann: false,
  NaturtyperNiNMdir_Dekningskart: false,
  NaturtyperNiNMdir_NaturtypeNiNhylokalitetskvalitet: false,
  NaturtyperNiNMdir_NaturtypeNiNikkefullstendigkvalitetsvurdert: false,
  NaturtyperNiNMdir_NaturtypeNiNlavlokalitetskvalitet: false,
  NaturtyperNiNMdir_NaturtypeNiNmoderatlokalitetskvalitet: false,
  NaturtyperNiNMdir_NaturtypeNiNSvrthylokalitetskvalitet: false,
  NaturtyperNiNMdir_NaturtyperMdir: false,
  Naturtyperutvalgte_Naturtyperutvalgte: false,
  Naturvernomrder_Naturvernomrder: false,
  Naturvernomrderforesltte_Foreslattnaturvernomrde: false,
  Nedbrfelt_Nedbrfelttilhav: false,
  Nedbrfelt_REGINEenhet: false,
  Nedbrfelt_Sidenedbrfelt: false,
  Nedbrfelt_Vassdragsomrde: false,
  Nkkelbiotoper_Nkkelbiotop: false,
  Nkkelbiotoper_NkkelbiotopmedMiS: false,
  Nkkelbiotoper_NkkelbiotoputenMiS: false,
  Ramsaromrder_Ramsaromrader: false,
  Skredhendelser_Oversiktskred: false,
  Skredhendelser_Skredtype: false,
  Srbarehabitatmarint_Blomklkorallskog: false,
  Srbarehabitatmarint_Bltbunnskorallskog: false,
  Srbarehabitatmarint_Hardbunnskorallskog: false,
  Srbarehabitatmarint_Sjfjrbunn: false,
  Srbarehabitatmarint_Svampskog: false,
  Srbarehabitatmarint_Svampspikelbunn: false,
  Srbarehabitatmarint_Umbellulabestander: false,
  Srbarehabitatmarint_VMEColdwatersponge: false,
  Vannforekomster_kologisktilstandellerpotensialelv: false,
  Vannforekomster_kologisktilstandellerpotensialinnsj: false,
  Vannforekomster_kologisktilstandellerpotensialkystvann: false,
  Vannkraftikkeutbygd_Ikkeutbygddam: false,
  Vannkraftikkeutbygd_Ikkeutbygdinntakspunkt: false,
  Vannkraftikkeutbygd_Ikkeutbygdmagasin: false,
  Vannkraftikkeutbygd_Ikkeutbygdvannkraftverk: false,
  Vannkraftikkeutbygd_Ikkeutbygdvannvei: false,
  Vannkraftutbygd_Dam: false,
  Vannkraftutbygd_DamN250: false,
  Vannkraftutbygd_Inntakspunkt: false,
  Vannkraftutbygd_Magasin: false,
  Vannkraftutbygd_Utlpspunkt: false,
  Vannkraftutbygd_Vannkraftverk: false,
  Vannkraftutbygd_Vannvei: false,
  VerneplanforVassdrag_VerneplanforVassdrag: false,
  Vernskog_Vernskog: false,
  Villreinomrder_Villreinbarmarksbeite: false,
  Villreinomrder_Villreinhelrsbeite: false,
  Villreinomrder_Villreinhstbeite: false,
  Villreinomrder_Villreinkalvingsomrde: false,
  Villreinomrder_Villreinleveomrde: false,
  Villreinomrder_Villreinsommerbeite: false,
  Villreinomrder_VillreinTrekkomrade: false,
  Villreinomrder_VillreinTrekkveg: false,
  Villreinomrder_Villreinvinterbeite: false
};

const coverage = {
  ArealressursAR5_ArealressursAR5Arealtype: "norge",
  ArealressursAR5_Treslag: "norge",
  ArealressursAR5_Jordbruksareal: "norge",
  ElvenettElvis_Elvenett: "norge_og_svalbard",
  Forurensetgrunn_Forurensetomrdetilstandpunkt: "norge",
  Forurensetgrunn_Forurensetomrdetilstandpunkt: "norge",
  Forurensetgrunn_Forurensetomrdetilstand: "norge_og_svalbard",
  Forurensetgrunn_Forurensetomrdetilstandpunkt: "norge_og_svalbard",
  Kulturminnerlokaliteter_Kulturminnerlokaliteter: "norge_og_svalbard",
  Vannkraftutbygd_Dam: "norge",
  Livsmiljer_Dekningskartdetalj: "norge"
};

const zoom = {
  Forurensetgrunn_Forurensetomrdetilstandpunkt: 9
};

const getBaseWmsUrl = url => {
  url = new URL(url);
  for (var item of url.searchParams) {
    const key = item[0];
    if (key.toLowerCase() === "request") url.searchParams.delete(key);
  }
  return url.toString();
};

var kartlag = JSON.parse(fs.readFileSync("kartlag.json"));
kartlag = Object.values(kartlag).reduce((acc, e) => {
  for (var ul of Object.values(e.underlag || {})) {
    ul.wmsurl = getBaseWmsUrl(e.wmsurl);
    ul.projeksjon = e.projeksjon;
    console.log(ul.id, zoom);
    if (zoom[ul.id]) ul.zoom[0] = zoom[ul.id];
    acc[ul.id] = ul; // Object so we can filter duplicates
  }
  return acc;
}, {});
kartlag = Object.values(kartlag);

kartlag = kartlag.sort((a, b) => {
  if (a.zoom[0] > b.zoom[0]) return 1;
  if (a.zoom[0] < b.zoom[0]) return -1;
  return a.tittel > b.tittel ? 1 : -1;
});
//const disabled = {}
//for (kl of kartlag) disabled[kl.id] = false
//console.log(JSON.stringify(disabled))
var logger = fs.createWriteStream("seed.yaml");

makeSeed(kartlag);

logger.end();
logger = fs.createWriteStream("mapproxy.yaml");

write(`layers:`);
makeLayers(kartlag);
write(`caches:`);
makeCaches(kartlag);
write(`sources:`);
makeSources(kartlag);

write(``);
write(`grids:`);
write(`  webmercator:`);
write(`    base: GLOBAL_MERCATOR`);
write(`    srs: EPSG:3857`);
write(`  google:`);
write(`    base: GLOBAL_MERCATOR`);
write(`    srs: EPSG:900913`);
write(``);
write(`globals:`);

write(``);
write(`services:`);
write(`  demo:`);
write(`  tms:`);
write(`    use_grid_names: true`);
write(`    origin: "nw"`);
write(`  wmts:`);
write(`  wms:`);
write(`    md:`);
write(`      title: Økologisk grunnkart cache`);
write(`      abstract: Økologisk grunnkart overview cache.`);
write(``);

logger.end();

function write(line) {
  logger.write(line + "\n");
}

function trimwmsurl(wmsurl) {
  const url = new URL(wmsurl);
  url.searchParams.delete("request");
  url.searchParams.delete("service");
  return url;
}

function makeSeed(kartlag) {
  write("seeds:");
  kartlag.forEach(ul => {
    if (ul.zoom[0] <= 1) return;
    if (disabled[ul.id]) return;
    write("  " + ul.id + ":");
    write(`        caches: [${ul.id}_cache]`);
    write(`        coverages: [${coverage[ul.id] || "alt"}]`);
    write(`        levels: [${ul.zoom[0]}]`);
    write(`        refresh_before:`);
    write(`          time: 2019-10-10T12:35:00`);
    write("");
  });
  write("coverages:");
  write("  norge:");
  write("    datasource: coverage/NO.txt");
  write('    srs: "EPSG:3857"');
  write("  norge_og_svalbard:");
  write("    union:");
  write("      - datasource: coverage/NO.txt");
  write('        srs: "EPSG:3857"');
  write("      - datasource: coverage/SV.txt");
  write('        srs: "EPSG:3857"');
  write("  alt:");
  write("    bbox: [4.41, 57.92, 34.22, 81.06]");
  write('    srs: "EPSG:4326"');
}

function makeLayers(kartlag) {
  kartlag.forEach(ul => {
    write(`  - name: ${ul.id}`);
    write(`    title: "${ul.tittel}"`);
    write(`    sources: [${ul.id}_cache]`);
  });
}

function makeCaches(kartlag) {
  kartlag.forEach(ul => {
    write(`  ${ul.id}_cache:`);
    write(`    sources: [${ul.id}]`);
    write(
      `    grids: [${
        ul.projeksjon === "EPSG:900913" ? "google" : "webmercator"
      }]`
    );
    write(`    cache:`);
    write(`      type: sqlite`);
    write(`      directory: /mapproxy/cache/${ul.id}/`);
  });
}

function makeSources(kartlag) {
  kartlag.forEach(ul => {
    write(`  ${ul.id}: `);
    write(`    type: wms`);
    write(`    req: `);
    write(`      url: ${trimwmsurl(ul.wmsurl)}`);
    write(`      layers: ${ul.wmslayer}`);
    if (special_options[ul.id]) write(`      ${special_options[ul.id]}`); // Arterrdlista_NTNrtruet
    write(`      transparent: true`);
  });
}
