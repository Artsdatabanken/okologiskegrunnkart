using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace Geonorge.MassivNedlasting
{
    public class ConfigFile
    {
        public const string Default = "default";

        public Guid Id { get; set; }

        /// <summary>
        /// Config file name
        /// </summary>
        public string Name { get; set; }

        /// <summary>
        /// Path to file containing all dataset files to download. 
        /// </summary>
        public string FilePath { get; set; }

        /// <summary>
        /// Where to put downloaded files
        /// </summary>
        public string DownloadDirectory { get; set; }

        /// <summary>
        /// Where to put log files
        /// </summary>
        public string LogDirectory { get; set; }

        /// <summary>
        /// Selected download usage and purpose
        /// </summary>
        public DownloadUsage DownloadUsage { get; set; }


        public ConfigFile()
        {
            Id = Guid.NewGuid();
        }

        /// <summary>
        /// Create a default config file
        /// </summary>
        /// <returns></returns>
        public static ConfigFile GetDefaultConfigFile()
        {
            return new ConfigFile()
            {
                Id = Guid.NewGuid(),
                Name = Default,
                FilePath = ApplicationService.GetDownloadFilePath(),
                DownloadDirectory = ApplicationService.GetDefaultDownloadDirectory(),
                LogDirectory = ApplicationService.GetDefaultLogDirectory(),
            };
        }

        public bool DownloadUsageIsSet()
        {
            return DownloadUsage != null && DownloadUsage.Group.Any() && DownloadUsage.Purpose != null;
        }

        public bool IsDefault()
        {
            return Name == Default;
        }
    }
}
