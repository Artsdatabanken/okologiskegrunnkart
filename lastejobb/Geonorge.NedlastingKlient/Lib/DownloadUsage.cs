using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;
using System.Text;

namespace Geonorge.MassivNedlasting
{
    public class DownloadUsage
    {
        public string Group { get; set; }
        public List<string> Purpose { get; set; }
        public string SoftwareClient => "Geonorge.MassivNedlasting";
        public string SoftwareClientVersion => Assembly.GetExecutingAssembly().GetName().Version.ToString();
        public List<DownloadUsageEntries> Entries { get; set; }

        public DownloadUsage()
        {
            Purpose = new List<string>();
            Entries = new List<DownloadUsageEntries>();
        }

    }

    public class DownloadUsageEntries
    {
        public string MetadataUuid { get; set; }
        public string AreaCode { get; set; }
        public string AreaName { get; set; }
        public string Format { get; set; }
        public string Projection { get; set; }

        public DownloadUsageEntries(DatasetFile datasetFile)
        {
            MetadataUuid = datasetFile.DatasetId; // TODO legg til metadata uuid i dataset file..
            var title = datasetFile.Title.Split(',');
            if (title.Length == 3)
            {
                AreaCode = title[1].Trim();
                AreaName = title[2];
                Format = title[0];
            }
            else if (title.Length == 2)
            {
                AreaName = title[1];
                Format = title[0];
            }
            Projection = datasetFile.Projection;
        }
    }

    public class PurposeViewModel
    {
        public string Purpose { get; set; }
        public bool IsSelected { get; set; }


        public PurposeViewModel(string item, List<string> selectedPurposes)
        {
            Purpose = item;
            IsSelected = false;
            if (!selectedPurposes.Any()) return;
            foreach (var selectedPurpose in selectedPurposes)
            {
                if (selectedPurpose == item)
                {
                    IsSelected = true;
                    break;
                }
            }
        }

    }
}
