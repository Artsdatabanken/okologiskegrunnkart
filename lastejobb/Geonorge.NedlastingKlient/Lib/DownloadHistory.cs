using System;
using System.IO;

namespace Geonorge.MassivNedlasting
{
    /// <summary>
    /// History of downloaded files. 
    /// </summary>
    public class DownloadHistory
    {

        public DownloadHistory(string url, string filePath, string downloaded = null, string lastUpdated = null)
        {
            Id = url;
            Downloaded = downloaded ?? DateTime.Now.ToString();
            FilePath = filePath;
            LastUpdated = lastUpdated ?? new DateTime(1970, 1, 1).ToString();
        }

        /// <summary>
        /// Download url
        /// </summary>
        public string Id { get; set; }

        /// <summary>
        /// Date of last run "Nedlaster". 
        /// </summary>
        public string Downloaded { get; set; }

        /// <summary>
        /// File path to check if local file exists
        /// </summary>
        public string FilePath { get; set; }

        /// <summary>
        /// Date when dataset was last updated 
        /// </summary>
        public string LastUpdated { get; set; }
    }

}
