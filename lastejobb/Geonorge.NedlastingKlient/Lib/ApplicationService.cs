using System;
using System.Collections;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Reflection;
using System.Text;
using System.Threading.Tasks;
using System.Xml.Linq;
using Geonorge.MassivNedlasting.Gui;
using Newtonsoft.Json;
using Newtonsoft.Json.Converters;
using Newtonsoft.Json.Linq;
using Serilog;


namespace Geonorge.MassivNedlasting
{
    /// <summary>
    /// Holds application settings
    /// </summary>
    public class ApplicationService
    {
        private static readonly ILogger Log = Serilog.Log.ForContext(MethodBase.GetCurrentMethod().DeclaringType);


        /// <summary>
        /// Returns path to the config file containing the list of dataset to download. Return default if file name is not set. 
        /// </summary>
        /// <param name="fileName">Name of config file</param>
        /// <returns>Path</returns>
        public static string GetDownloadFilePath(string fileName = null)
        {
            DirectoryInfo configDirectory = GetConfigAppDirectory();

            try
            {
                if (string.IsNullOrWhiteSpace(fileName))
                {
                    return Path.Combine(configDirectory.FullName, "default.json");
                }

                return Path.Combine(configDirectory.FullName, fileName + ".json");
            }
            catch (Exception e)
            {
                Log.Error(e, "Could not get download file path");
                return null;
            }
        }

        /// <summary>
        /// Returns path to the file containing the list of projections in epsg-registry - https://register.geonorge.no/register/epsg-koder
        /// </summary>
        /// <returns></returns>
        public static string GetProjectionFilePath()
        {
            DirectoryInfo appDirectory = GetAppDirectory();

            return Path.Combine(appDirectory.FullName, "projections.json");
        }

        /// <summary>
        /// Returns path to the file containing the list of user group in metadata codelist registry "Brukergruppe" - https://register.geonorge.no/metadata-kodelister/brukergrupper
        /// </summary>
        /// <returns></returns>
        public static string GetUserGroupsFilePath()
        {
            DirectoryInfo appDirectory = GetAppDirectory();

            return Path.Combine(appDirectory.FullName, "usergroup.json");
        }

        /// <summary>
        /// Returns path to the file containing the list of user group in metadata codelist registry "Formål" - https://register.geonorge.no/metadata-kodelister/formal
        /// </summary>
        /// <returns></returns>
        public static string GetPurposesFilePath()
        {
            DirectoryInfo appDirectory = GetAppDirectory();

            return Path.Combine(appDirectory.FullName, "purposes.json");
        }

        /// <summary>
        /// Returns path to the old version, "download.json", of config file.
        /// </summary>
        /// <returns></returns>
        public static string GetOldDownloadFilePath()
        {
            DirectoryInfo appDirectory = GetAppDirectory();

            return Path.Combine(appDirectory.FullName, "download.json");
        }

        /// <summary>
        /// Returns path to the file containing the list of downloaded datasets pr config file
        /// </summary>
        /// <param name="configName">Name of config selected config file.</param>
        /// <returns></returns>
        public static string GetDownloadHistoryFilePath(string configName)
        {
            DirectoryInfo configDirectory = GetConfigAppDirectory();

            return Path.Combine(configDirectory.FullName, configName + "-downloadHistory.json");
        }

        /// <summary>
        /// Returns path to the log file containing the list of downloaded datasets.
        /// </summary>
        /// <returns></returns>
        public static string GetDownloadLogFilePath(string logDirectory)
        {
            var name = DateTime.Now.ToString("yyyy-M-dd--HH-mm-ss");

            return Path.Combine(logDirectory, name + ".txt");
        }

        /// <summary>
        /// App directory is located within the users AppData folder
        /// </summary>
        /// <returns></returns>
        public static DirectoryInfo GetAppDirectory()
        {
            var appDataPath = Environment.GetFolderPath(Environment.SpecialFolder.LocalApplicationData);

            var appDirectory = new DirectoryInfo(appDataPath + Path.DirectorySeparatorChar + "Geonorge"
                                                 + Path.DirectorySeparatorChar + "Nedlasting");

            if (!appDirectory.Exists)
                appDirectory.Create();

            return appDirectory;
        }

        /// <summary>
        /// App directory is located within the users AppData folder
        /// </summary>
        /// <returns></returns>
        public static DirectoryInfo GetLogAppDirectory()
        {
            // TODO brukes til å logge hendelser i applikasjonen utenfor selve nedlastingen.. ?
            var appDirectory = new DirectoryInfo(GetAppDirectory().ToString() + Path.DirectorySeparatorChar + "Log");

            if (!appDirectory.Exists)
                appDirectory.Create();

            return appDirectory;
        }


        /// <summary>
        ///     App directory is located within the users AppData folder
        /// </summary>
        /// <returns></returns>
        public static DirectoryInfo GetConfigAppDirectory()
        {
            try
            {
                var appDirectory =
                    new DirectoryInfo(GetAppDirectory().ToString() + Path.DirectorySeparatorChar + "Config");

                if (!appDirectory.Exists)
                    appDirectory.Create();
                return appDirectory;

            }
            catch (Exception e)
            {
                Log.Error(e, "Could not get app directory");
                return null;
            }
        }

        /// <summary>
        /// Get application settings
        /// </summary>
        /// <returns>Return applications if set, else return default settings. </returns>
        public static AppSettings GetAppSettings()
        {
            var appSettingsFileInfo = new FileInfo(GetAppSettingsFilePath());
            if (!appSettingsFileInfo.Exists)
            {
                var defaultConfigFile = ConfigFile.GetDefaultConfigFile();
                var configFiles = new List<ConfigFile> { defaultConfigFile };
                Log.Information("Create app settings file");
                WriteToAppSettingsFile(new AppSettings()
                {
                    LastOpendConfigFile = defaultConfigFile,
                    ConfigFiles = configFiles
                });
            }

            SetDefaultIfSettingsNotSet();

            return JsonConvert.DeserializeObject<AppSettings>(File.ReadAllText(GetAppSettingsFilePath()));
            ;
        }


        /// <summary>
        /// Default download directory path. 
        /// </summary>
        /// <returns>Directory path</returns>
        public static string GetDefaultDownloadDirectory()
        {
            string myDocuments = Environment.GetFolderPath(Environment.SpecialFolder.MyDocuments);

            DirectoryInfo downloadDirectory = new DirectoryInfo(Path.Combine(myDocuments, "Geonorge-nedlasting"));
            if (!downloadDirectory.Exists)
                downloadDirectory.Create();

            return downloadDirectory.FullName;
        }

        /// <summary>
        /// Default log directory path
        /// </summary>
        /// <returns>Log path</returns>
        public static string GetDefaultLogDirectory()
        {
            string myDocuments = Environment.GetFolderPath(Environment.SpecialFolder.MyDocuments);

            DirectoryInfo logDirectory = new DirectoryInfo(Path.Combine(myDocuments, "Log"));
            if (!logDirectory.Exists)
                logDirectory.Create();

            return logDirectory.FullName;
        }

        /// <summary>
        /// Write application settings to settings file
        /// </summary>
        /// <param name="appSettings">Application settings</param>
        public static void WriteToAppSettingsFile(AppSettings appSettings)
        {
            var serializer = new JsonSerializer();
            serializer.Converters.Add(new JavaScriptDateTimeConverter());
            serializer.NullValueHandling = NullValueHandling.Ignore;

            using (var outputFile = new StreamWriter(GetAppSettingsFilePath(), false))
            {
                using (JsonWriter writer = new JsonTextWriter(outputFile))
                {
                    serializer.Serialize(writer, appSettings);
                    Log.Debug("Write to appsettings file");
                    writer.Close();
                }
            }
        }

        /// <summary>
        /// List with names of all config files 
        /// </summary>
        /// <returns></returns>
        public static List<string> NameConfigFiles()
        {
            var configFiles = GetAppSettings().ConfigFiles;
            var nameConfigFiles = new List<string>();
            foreach (var configFile in configFiles)
            {
                nameConfigFiles.Add(configFile.Name);
            }

            return nameConfigFiles;
        }

        /// <summary>
        /// Application settings file path
        /// </summary>
        /// <returns></returns>
        private static string GetAppSettingsFilePath()
        {
            return Path.Combine(GetAppDirectory().FullName, "settings.json");
        }

        /// <summary>
        /// If application settings is not set, return default
        /// </summary>
        private static void SetDefaultIfSettingsNotSet()
        {
            AppSettings appSetting =
                JsonConvert.DeserializeObject<AppSettings>(File.ReadAllText(GetAppSettingsFilePath()));

            if (!appSetting.LastOpendConfigFileIsSet() || !appSetting.ConfigFiles.Any())
            {
                Log.Debug("Set default app setting information");

                appSetting.LastOpendConfigFile = appSetting.LastOpendConfigFile ?? ConfigFile.GetDefaultConfigFile();
                appSetting.ConfigFiles =
                    appSetting.ConfigFiles ?? new List<ConfigFile> { ConfigFile.GetDefaultConfigFile() };

                WriteToAppSettingsFile(appSetting);
            }
        }


        /// <summary>
        /// Set time last check for update
        /// </summary>
        /// <param name="timeLastCheckForUpdate"></param>
        public static void SetTimeLastCheckForUpdate(DateTime timeLastCheckForUpdate)
        {
            AppSettings appSetting =
                JsonConvert.DeserializeObject<AppSettings>(File.ReadAllText(GetAppSettingsFilePath()));
            appSetting.LastCheckForUpdate = timeLastCheckForUpdate.ToString("yyyy-MM-ddTHH:mm:ss");
            WriteToAppSettingsFile(appSetting);
        }


        /// <summary>
        /// Set time last check for update
        /// </summary>
        /// <returns></returns>
        public static DateTime? GetTimeLastCheckForUpdate()
        {
            AppSettings appSetting =
                JsonConvert.DeserializeObject<AppSettings>(File.ReadAllText(GetAppSettingsFilePath()));
            return DateTime.Parse(appSetting.LastCheckForUpdate);
        }

        /// <summary>
        /// Returns a list of projections. 
        /// </summary>
        /// <returns></returns>
        public static List<Projections> GetProjections()
        {
            try
            {
                using (var r = new StreamReader(GetProjectionFilePath()))
                {
                    var json = r.ReadToEnd();
                    var propotions = JsonConvert.DeserializeObject<List<Projections>>(json);
                    Log.Debug("Read from projection file");
                    r.Close();
                    return propotions;
                }
            }
            catch (Exception e)
            {
                Log.Error(e, "Read from projection file");
                return new List<Projections>();
            }
        }

    }
}