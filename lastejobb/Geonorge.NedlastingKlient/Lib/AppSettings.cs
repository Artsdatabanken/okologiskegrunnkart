using System;
using System.Collections;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;

namespace Geonorge.MassivNedlasting
{
    /// <summary>
    /// Holds various application settings.
    /// </summary>
    public class AppSettings
    {
        /// <summary>
        /// Used to identify the application to "Nedlastings-api"
        /// </summary>
        public const string StatisticsToken = "";
        public const string TestStatisticsToken = "tu7Szvs2Lej8yVXtiu3IVogke3TaN5GmSmNmLuSZDTvYtSYzrSG9VUgW9LE4XHiRfrbZmEqN42WwP7uLzfUAhSZnzR3ZBiF9JvI7VHwEyz7vaUdaa5BAxpDUqx2QDUu8";

        public const string NedlatingsApiDownloadUsage = "";
        public const string NedlatingsApiDownloadUsageDev = "https://nedlasting.dev.geonorge.no/api/internal/download-usage";


        /// <summary>
        /// Basic authentication User
        /// </summary>
        public string Username { get; set; }

        /// <summary>
        /// Basic authentication Password
        /// </summary>
        public string Password { get; set; }

        /// <summary>
        /// To remember last opend config file when starting app.
        /// </summary>
        public ConfigFile LastOpendConfigFile { get; set; }

        /// <summary>
        /// When creating a new config file it is set as temp before saving. 
        /// Used when adding user group and purpose to a new config file
        /// </summary>
        public ConfigFile TempConfigFile { get; set; }

        /// <summary>
        /// Added config files
        /// </summary>
        public List<ConfigFile> ConfigFiles { get; set; }

        public string LastCheckForUpdate { get; set; }

        public AppSettings()
        {
            ConfigFiles = new List<ConfigFile>();
        }

        public bool LastOpendConfigFileIsSet()
        {
            return LastOpendConfigFile != null;
        }

        /// <summary>
        /// Returns config file if name matches a config file name
        /// </summary>
        /// <param name="name">config name</param>
        /// <returns>Config file if found.</returns>
        public ConfigFile GetConfigByName(string name)
        {
            foreach (var configFile in ConfigFiles)
            {
                if (configFile.Name.ToLower() == name.ToLower())
                {
                    return configFile;
                }
            }
            return null;
        }

        /// <summary>
        ///  Create a list of all config file names.
        /// </summary>
        /// <returns>All list of config files by name</returns>
        public List<string> NameConfigFiles()
        {
            var nameConfigFiles = new List<string>();
            foreach (var configFile in ConfigFiles)
            {
                nameConfigFiles.Add(configFile.Name);
            }
            return nameConfigFiles;
        }
    }


}