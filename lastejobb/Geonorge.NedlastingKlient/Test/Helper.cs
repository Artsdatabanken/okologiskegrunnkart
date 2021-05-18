using System;
using System.Collections.Generic;
using System.Text;
using Geonorge.Nedlaster;

namespace Geonorge.MassivNedlasting.Test
{
    class Helper
    {
        public static string DatasetFileUrl = "https://nedlasting.geonorge.no/geonorge/KystOgFiskeri/AkvakulturLokaliteter/GML/KystOgFiskeri_0101_Halden_25833_AkvakulturLokaliteter_GML.zip";

        public static Dataset NewDataset()
        {
            var dataset = new Dataset();
            dataset.Title = "Administrative enheter fylker GEOJSON-format";
            dataset.Description = "Dataset description";
            dataset.LastUpdated = "2018-01-10T13:47:55";
            dataset.Organization = "Kartverket";
            dataset.Url = "http://nedlasting.geonorge.no/fmedatastreaming/ATOM-feeds/AdministrativeEnheterFylker_AtomFeedGEOJSON.fmw";
            dataset.Uuid = "6093c8a8-fa80-11e6-bc64-92361f002671";

            return dataset;
        }

        public static DatasetFile NewDatasetFile(string title = null)
        {
            var datasetFile = new DatasetFile();
            datasetFile.Title = title ?? "GML-format,  3001, Halden";
            datasetFile.Description = "Dataset description";
            datasetFile.Url = "https://nedlasting.geonorge.no/geonorge/KystOgFiskeri/AkvakulturLokaliteter/GML/KystOgFiskeri_0101_Halden_25833_AkvakulturLokaliteter_GML.zip";
            datasetFile.LastUpdated = "2018-10-31T01:43:35";
            datasetFile.Organization = "Kartverket";
            datasetFile.Projection = "EPSG:25833";
            datasetFile.DatasetId = "Akvakultur - lokaliteter GML-format";
            datasetFile.DatasetUrl = "http://nedlasting.geonorge.no/geonorge/ATOM-feeds/AkvakulturLokaliteter_AtomFeedGML.xml";

            return datasetFile;
        }

        public static Download NewDownload()
        {
            var download = new Download();
            download.DatasetUrl = "http://nedlasting.geonorge.no/geonorge/ATOM-feeds/AkvakulturLokaliteter_AtomFeedGML.xml";
            download.DatasetTitle = "Akvakultur - lokaliteter GML-format";
            download.DatasetId = "Akvakultur - lokaliteter GML-format";
            download.Subscribe = false;
            download.AutoDeleteFiles = false;
            download.AutoAddFiles = false;
            download.Files = CreateListOfFiles();

            return download;
        }

        private static List<DatasetFile> CreateListOfFiles()
        {
            var files = new List<DatasetFile>();
            files.Add(NewDatasetFile());
            files.Add(NewDatasetFile("TestDatasetFile1"));
            files.Add(NewDatasetFile("TestDatasetFile2"));
            return files;
        }

        public static DownloadLog NewDownloadLog()
        {
            return new DownloadLog()
            {
                TotalDatasetsToDownload = 10,
            };
        }

        public static List<DownloadViewModel> NewDownloadViewModelList()
        {
            var downloadViewModels = new List<DownloadViewModel>();
            downloadViewModels.Add(NewDownloadViewModel());
            return downloadViewModels;
        }

        private static DownloadViewModel NewDownloadViewModel(string name = null)
        {
            return new DownloadViewModel()
            {
                DatasetUrl = "http://nedlasting.geonorge.no/geonorge/ATOM-feeds/AkvakulturLokaliteter_AtomFeedGML.xml",
                DatasetId = "Akvakultur - lokaliteter GML-format",
                DatasetTitle = "Akvakultur - lokaliteter GML-format",
                Subscribe = false,
                AutoDeleteFiles = false,
                AutoAddFiles = false,
                Files = new List<DatasetFileViewModel>()
            };
        }

    }
}
