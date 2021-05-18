using System;
using System.IO;

namespace Geonorge.MassivNedlasting
{

    public class DatasetFile
    {
        private DatasetFileViewModel datasetFileViewModel;
        private const string NorwayDigitalRestricted = "norway digital restricted";
        private const string Restricted = "restricted";

        /// <summary>
        /// Dataset file title
        /// </summary>
        public string Title { get; set; }

        /// <summary>
        /// Dataset file description
        /// </summary>
        public string Description { get; set; }

        /// <summary>
        /// Url to download file
        /// </summary>
        public string Url { get; set; }

        /// <summary>
        /// Date when file was updated
        /// </summary>
        public string LastUpdated { get; set; }

        /// <summary>
        /// Owner organization
        /// </summary>
        public string Organization { get; set; }

        /// <summary>
        /// Projection of file
        /// </summary>
        public string Projection { get; set; }

        /// <summary>
        /// Format of file
        /// </summary>
        public string Format { get; set; }

        /// <summary>
        /// DatasetId (Dataset title) to the dataset where file belongs
        /// </summary>
        public string DatasetId { get; set; }

        /// <summary>
        /// Url to the dataset where file belongs
        /// </summary>
        public string DatasetUrl { get; set; }

        /// <summary>
        /// File restriction
        /// </summary>
        public string Restrictions { get; set; }

        /// <summary>
        /// File path
        /// </summary>
        public string FilePath { get; set; }

        /// <summary>
        /// When was the file downloaded
        /// </summary>
        public string DownloadedDate { get; set; }


        public DatasetFile(DatasetFileViewModel datasetFileViewModel)
        {
            Title = datasetFileViewModel.Title;
            Description = datasetFileViewModel.Description;
            Url = datasetFileViewModel.Url;
            LastUpdated = datasetFileViewModel.LastUpdated;
            Organization = datasetFileViewModel.Organization;
            Projection = datasetFileViewModel.Category;
            Format = datasetFileViewModel.Format;
            DatasetId = datasetFileViewModel.DatasetId;
            DatasetUrl = datasetFileViewModel.DatasetUrl;
            Restrictions = datasetFileViewModel.Restrictions;
        }

        public DatasetFile()
        {
        }

        public bool IsRestricted()
        {
            return Restrictions == Restricted || Restrictions == NorwayDigitalRestricted;
        }

        public string LocalFileName()
        {
            var fileName = Path.GetFileName(new Uri(Url).LocalPath);
            var extension = Path.GetExtension(fileName);
            if (string.IsNullOrWhiteSpace(extension))
                return null;

            return fileName;
        }

        public bool HasLocalFileName()
        {
            return !string.IsNullOrWhiteSpace(LocalFileName());
        }
    }

    public class DatasetFileViewModel
    {
        public string Id { get; set; }
        public string Title { get; set; }
        public string Description { get; set; }
        public string Url { get; set; }
        public string LastUpdated { get; set; }
        public string Organization { get; set; }
        public string Category { get; set; }
        public string EpsgName { get; set; }
        public string Format { get; set; }
        public string DatasetId { get; set; }
        public string DatasetUrl { get; set; }
        public bool SelectedForDownload { get; set; }
        public bool IsRestricted { get; set; }
        public string Restrictions { get; set; }

        public string GetId()
        {
            return DatasetId + "_" + Title + "_" + Category;
        }

        public DatasetFileViewModel(DatasetFile datasetFile, string epsgName, bool selectedForDownload = false)
        {
            Title = datasetFile.Title;
            Description = datasetFile.Description;
            Url = datasetFile.Url;
            LastUpdated = datasetFile.LastUpdated;
            Organization = datasetFile.Organization;
            Category = datasetFile.Projection;
            Format = datasetFile.Format;
            DatasetId = datasetFile.DatasetId;
            DatasetUrl = FixDatasetUrl(datasetFile.DatasetUrl);
            Id = GetId();
            SelectedForDownload = selectedForDownload;
            IsRestricted = datasetFile.IsRestricted();
            Restrictions = datasetFile.Restrictions;
            EpsgName = epsgName;
        }

        private string FixDatasetUrl(string datasetUrl)
        {
            var url = datasetUrl.Replace(".fmw", ".xml").Replace("fmedatastreaming", "geonorge");
            return url;
        }
    }
}
