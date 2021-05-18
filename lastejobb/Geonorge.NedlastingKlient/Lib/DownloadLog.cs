using System;
using System.Collections.Generic;
using System.Linq;

namespace Geonorge.Nedlaster
{
    public class DownloadLog
    {

        public DownloadLog()
        {
            Updated = new List<DatasetFileLog>();
            NotUpdated = new List<DatasetFileLog>();
            Faild = new List<DatasetFileLog>();
        }

        public List<DatasetFileLog> Updated { get; set; }
        public List<DatasetFileLog> NotUpdated { get; set; }
        public List<DatasetFileLog> Faild { get; set; }
        public int TotalDatasetsToDownload { get; set; }
        public string TotalSizeOfDownloadedFiles { get; set; }

    }
}