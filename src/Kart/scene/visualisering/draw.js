import polygon from "./polygon";
import gradientVisualisering from "./gradientVisualisering";
import indexedRaster from "./indexedRaster";
import openStreetMap from "./openStreetMap";
import raster_tiles from "./raster_tiles";
import ruter from "./ruter";

export default {
  polygon: polygon, // kalk
  gradient: gradientVisualisering, // bioklimatisk sone, arealbruksintensitet ++
  raster_gradient: gradientVisualisering, // bioklimatisk sone, arealbruksintensitet ++
  raster_indexed: indexedRaster, /// Landskapstyper
  raster_ruter: ruter, // Arter
  osm_lys: openStreetMap,
  osm_mørk: openStreetMap,
  gebco: raster_tiles,
  norgeibilder: raster_tiles,
  topo4: raster_tiles,
  fjellskygge: raster_tiles,
  topo4graatone: raster_tiles,
  google_hybrid: raster_tiles,
  google_satellite: raster_tiles
};
