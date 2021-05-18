using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net.Http;
using System.Reflection;
using System.Text;
using System.Threading.Tasks;
using Geonorge.MassivNedlasting.Gui;
using Geonorge.Nedlaster;
using Newtonsoft.Json;
using Newtonsoft.Json.Converters;
using Newtonsoft.Json.Linq;
using Serilog;

namespace Geonorge.MassivNedlasting
{
    public class DatasetService
    {

        private static readonly ILogger Log = Serilog.Log.ForContext(MethodBase.GetCurrentMethod().DeclaringType);
        private static readonly HttpClient HttpClient = new HttpClient();
        private ConfigFile _configFile;

        public DatasetService()
        {
            _configFile = ConfigFile.GetDefaultConfigFile();
            HttpClient.DefaultRequestHeaders.UserAgent.ParseAdd($"GeonorgeNedlastingsklient/{Assembly.GetExecutingAssembly().GetName().Version.ToString()}");
        }



        /// <summary>
        /// Use selected config file when using download service. 
        /// </summary>
        /// <param name="configFile">Selected config file</param>
        public DatasetService(ConfigFile configFile)
        {
            _configFile = configFile;
            Log.Debug("New datast service. Selected congif file is " + _configFile.Name);
            HttpClient.DefaultRequestHeaders.UserAgent.ParseAdd($"GeonorgeNedlastingsklient/{Assembly.GetExecutingAssembly().GetName().Version.ToString()}");
        }

        /// <summary>
        /// Return datasets from feeds "https://nedlasting.geonorge.no/geonorge/Tjenestefeed_daglig.xml" and "https://nedlasting.ngu.no/api/atomfeeds"
        /// </summary>
        /// <returns></returns>
        public List<Dataset> GetDatasets()
        {
            List<Dataset> geonorgeDatasets;
            List<Dataset> nguDatasets;

            geonorgeDatasets = GetDatasetsFromUrl("https://nedlasting.geonorge.no/geonorge/Tjenestefeed_daglig.xml");
            nguDatasets = GetDatasetsFromUrl("https://nedlasting.ngu.no/api/atomfeeds");

            return geonorgeDatasets.Concat(nguDatasets).OrderBy(o => o.Title).ToList();
        }

        public List<Dataset> GetDatasetsFromUrl(string url)
        {
            var getFeedTask = HttpClient.GetStringAsync(url);
            Log.Debug("Fetch datasets from " + url);
            return new AtomFeedParser().ParseDatasets(getFeedTask.Result);
        }

        /// <summary>
        /// Parse dataset file from feed and return as DatasetFile
        /// </summary>
        /// <param name="originalDatasetFile">local dataset file</param>
        /// <returns></returns>
        public DatasetFile GetDatasetFile(DatasetFile originalDatasetFile)
        {
            var getFeedTask = HttpClient.GetStringAsync(originalDatasetFile.DatasetUrl);
            Log.Debug("Fetch dataset file from " + originalDatasetFile.DatasetUrl);
            return new AtomFeedParser().ParseDatasetFile(getFeedTask.Result, originalDatasetFile);
        }

        /// <summary>
        /// Parse dataset files from feed
        /// </summary>
        /// <param name="download">Local dataset</param>
        /// <returns></returns>
        public List<DatasetFile> GetDatasetFiles(Download download)
        {
            try
            {
                var getFeedTask = HttpClient.GetStringAsync(download.DatasetUrl);
                Log.Debug("Fetch dataset files from " + download.DatasetUrl);
                List<DatasetFile> datasetFiles = new AtomFeedParser().ParseDatasetFiles(getFeedTask.Result, download.DatasetTitle, download.DatasetUrl).OrderBy(d => d.Title).ToList();

                return datasetFiles;
            }
            catch (Exception e)
            {
                Log.Error(e, "Could not get dataset files");
                return new List<DatasetFile>();
            }
        }

        /// <summary>
        /// Parse dataset files and return as view model
        /// </summary>
        /// <param name="dataset"></param>
        /// <param name="propotions"></param>
        /// <returns></returns>
        public List<DatasetFileViewModel> GetDatasetFiles(Dataset dataset)
        {
            var getFeedTask = HttpClient.GetStringAsync(dataset.Url);
            List<DatasetFile> datasetFiles = new AtomFeedParser().ParseDatasetFiles(getFeedTask.Result, dataset.Title, dataset.Url).OrderBy(d => d.Title).ToList();
            Log.Debug("Fetch dataset files from " + dataset.Url);
            return ConvertToViewModel(datasetFiles);
        }

        /// <summary>
        /// Fetch projections from epsg-registry - https://register.geonorge.no//epsg-koder
        /// </summary>
        /// <returns></returns>
        public List<Projections> FetchProjections()
        {
            List<Projections> projections = new List<Projections>();

            var url = "https://register.geonorge.no/api/epsg-koder.json";

            var c = new System.Net.WebClient { Encoding = Encoding.UTF8 };

            var json = c.DownloadString(url);
            Log.Debug("Fetch projection from https://register.geonorge.no/api/epsg-koder.json");
            dynamic data = JObject.Parse(json);
            if (data != null)
            {
                var result = data["containeditems"]; ;
                foreach (var item in result)
                {
                    projections.Add(new Projections(item));
                }
                Task.Run(() => WriteToProjectionFile(projections));
            }
            else
            {
                Log.Debug("Projection is empty");
            }

            return projections;
        }


        /// <summary>
        /// Fetch a list of download usage group from metadata-codelist registry - https://register.geonorge.no/api/metadata-kodelister/brukergrupper.json
        /// </summary>
        /// <returns></returns>
        public List<string> FetchDownloadUsageGroups()
        {
            List<string> groups = new List<string>();

            var url = "https://register.geonorge.no/api/metadata-kodelister/brukergrupper.json";
            var c = new System.Net.WebClient { Encoding = Encoding.UTF8 };

            var json = c.DownloadString(url);
            Log.Debug("Fetch download usage group from https://register.geonorge.no/api/metadata-kodelister/brukergrupper.json");

            dynamic data = JObject.Parse(json);
            if (data != null)
            {
                var result = data["containeditems"]; ;
                foreach (var item in result)
                {
                    groups.Add(item.label.ToString());
                }
                Task.Run(() => WriteToUsageGroupFile(groups));
            }
            else
            {
                Log.Debug("Download usage group is empty");
            }
            return groups;
        }

        /// <summary>
        /// Fetch a list of download puroses from metadata-codelist registry - https://register.geonorge.no/api/metadata-kodelister/formal.json
        /// </summary>
        /// <returns></returns>
        public List<string> FetchDownloadUsagePurposes()
        {
            List<string> purposes = new List<string>();

            var url = "https://register.geonorge.no/api/metadata-kodelister/formal.json";
            var c = new System.Net.WebClient { Encoding = Encoding.UTF8 };

            var json = c.DownloadString(url);
            Log.Debug("Fetch download usage purpose from https://register.geonorge.no/api/metadata-kodelister/formal.json");
            dynamic data = JObject.Parse(json);
            if (data != null)
            {
                var result = data["containeditems"]; ;
                foreach (var item in result)
                {
                    purposes.Add(item.label.ToString());
                }
                Task.Run(() => WriteToUsagePurposeFile(purposes));
            }
            else
            {
                Log.Debug("Download usage purpose is empty");
            }
            return purposes;
        }



        /// <summary>
        /// Returns a list of projections. 
        /// </summary>
        /// <returns></returns>
        public List<string> ReadFromDownloadUsageGroup()
        {
            try
            {
                using (var r = new StreamReader(ApplicationService.GetUserGroupsFilePath()))
                {
                    var json = r.ReadToEnd();
                    var userGroups = JsonConvert.DeserializeObject<List<string>>(json);
                    Log.Debug("Read from download usage group file");
                    r.Close();
                    return userGroups;
                }
            }
            catch (Exception e)
            {
                Log.Error(e, "Read from download usage group file");
                return new List<string>();
            }
        }


        /// <summary>
        /// Returns a list of projections. 
        /// </summary>
        /// <returns></returns>
        public List<string> ReadFromDownloadUsagePurposes()
        {
            try
            {
                using (var r = new StreamReader(ApplicationService.GetPurposesFilePath()))
                {
                    var json = r.ReadToEnd();
                    var upurposes = JsonConvert.DeserializeObject<List<string>>(json);
                    Log.Debug("Read from download usage purpose file");
                    r.Close();
                    return upurposes;
                }
            }
            catch (Exception e)
            {
                Log.Error(e, "Read from download usage purpose file");
                return new List<string>();
            }
        }


        /// <summary>
        /// Writes the information about the selected files to the local download list. 
        /// </summary>
        public void WriteToDownloadLogFile(DownloadLog downloadLog)
        {
            var serializer = new JsonSerializer();
            serializer.Converters.Add(new JavaScriptDateTimeConverter());
            serializer.NullValueHandling = NullValueHandling.Ignore;
            try
            {
                using (var w = new StreamWriter(ApplicationService.GetDownloadLogFilePath(_configFile.LogDirectory)))
                {
                    w.WriteLine("SELECTED DATASETS: " + downloadLog.TotalDatasetsToDownload);
                    w.WriteLine("-------------------------------");
                    w.WriteLine();

                    w.WriteLine("FILES UPDATED: " + downloadLog.Updated.Count());

                    DownloadLog(downloadLog.Updated, w);

                    w.WriteLine();

                    w.WriteLine("FILES NOT UPDATED: " + downloadLog.NotUpdated.Count());
                    DownloadLog(downloadLog.NotUpdated, w);

                    w.WriteLine();

                    w.WriteLine("FAILED: " + downloadLog.Faild.Count());
                    DownloadLog(downloadLog.Faild, w);

                    Log.Debug("Write to download log file");
                }
            }
            catch (Exception e)
            {
                Log.Error(e, "Write to download log file");
            }
        }


        /// <summary>
        /// Writes the information about the selected files to the local download list. 
        /// </summary>
        public void WriteToConfigFile(List<Download> downloads)
        {
            var serializer = new JsonSerializer();
            serializer.Converters.Add(new JavaScriptDateTimeConverter());
            serializer.NullValueHandling = NullValueHandling.Ignore;

            try
            {
                using (var outputFile = new StreamWriter(_configFile.FilePath, false))
                using (JsonWriter writer = new JsonTextWriter(outputFile))
                {
                    serializer.Serialize(writer, downloads);
                    Log.Debug("Write to config file, " + _configFile.FilePath);
                    writer.Close();
                }
            }
            catch (Exception e)
            {
                Log.Error(e, "Write to config file, " + _configFile.FilePath);
            }
        }

        /// <summary>
        /// Write selected files to download to config file. 
        /// </summary>
        /// <param name="selectedFilesToDownloadViewModel"></param>
        public void WriteToConfigFile(List<DownloadViewModel> selectedFilesToDownloadViewModel)
        {
            var selectedFilesToDownload = ConvertToModel(selectedFilesToDownloadViewModel);
            WriteToConfigFile(selectedFilesToDownload);
        }



        /// <summary>
        /// Writes the information about the selected files to the local download list. 
        /// </summary>
        /// <param name="datasetFilesViewModel"></param>
        public void WriteToDownloadHistoryFile(List<Download> downloads)
        {
            var downloadHistory = new List<DownloadHistory>();
            foreach (var dataset in downloads)
            {
                foreach (var datasetFile in dataset.Files)
                {
                    downloadHistory.Add(new DownloadHistory(datasetFile.Url, datasetFile.FilePath, datasetFile.DownloadedDate, datasetFile.LastUpdated));
                }
            }

            var serializer = new JsonSerializer();
            serializer.Converters.Add(new JavaScriptDateTimeConverter());
            serializer.NullValueHandling = NullValueHandling.Ignore;

            try
            {
                using (var outputFile = new StreamWriter(ApplicationService.GetDownloadHistoryFilePath(_configFile.Name), false))
                using (JsonWriter writer = new JsonTextWriter(outputFile))
                {
                    serializer.Serialize(writer, downloadHistory);
                    Log.Debug("Write to download history file " + _configFile.Name + "-downloadHistory.json");
                    writer.Close();
                }
            }
            catch (Exception e)
            {
                Log.Error(e, "Write to download history file " + _configFile.Name + "-downloadHistory.json");
            }
        }


        private void DownloadLog(List<DatasetFileLog> datasetFileLogs, TextWriter w)
        {
            w.WriteLine("-------------------------------");
            foreach (var item in datasetFileLogs.OrderBy(d => d.DatasetId))
            {
                w.Write(item.DatasetId + ";");
                w.Write(item.Name.Replace(",", ";") + ";" + item.Projection);
                w.WriteLine();
                if (item.Message != null) w.WriteLine(" Message: " + item.Message);
                w.WriteLine();
            }
        }

        private List<Download> ConvertToModel(List<DownloadViewModel> selectedFilesForDownload)
        {
            var downloads = new List<Download>();
            foreach (var downloadViewModel in selectedFilesForDownload)
            {
                var download = new Download(downloadViewModel);
                downloads.Add(download);
            }
            return downloads;
        }


        /// <summary>
        /// Returns a list of dataset files to download. 
        /// </summary>
        /// <returns></returns>
        public List<Download> GetSelectedFilesToDownload(ConfigFile configFile = null)
        {
            var downloadFilePath = _configFile != null ? _configFile.FilePath : ApplicationService.GetDownloadFilePath();
            try
            {
                using (var r = new StreamReader(downloadFilePath))
                {
                    var json = r.ReadToEnd();
                    var selecedForDownload = JsonConvert.DeserializeObject<List<Download>>(json);
                    r.Close();
                    selecedForDownload = RemoveDuplicatesIterative(selecedForDownload);
                    selecedForDownload = ConvertToNewVersionOfDownloadFile(selecedForDownload);
                    //selecedForDownload = GetAvailableProjections(selecedForDownload);
                    Log.Debug("Get selected files to download");
                    return selecedForDownload;
                }
            }
            catch (Exception e)
            {
                Log.Error(e, "Could not get selected files to download");
                return new List<Download>();
            }
        }

        public List<Download> GetAvailableProjections(List<Download> datasets)
        {
            foreach (var dataset in datasets)
            {
                var datasetFiles = GetDatasetFiles(dataset);
                var availableProjections = datasetFiles.GroupBy(p => p.Projection).Select(p => p.Key).ToList();
                if (dataset.Projections.Any())
                {
                    List<string> newItems = availableProjections.Where(p => dataset.Projections.All(p2 => p2.Name != p)).ToList();

                    foreach (var projection in newItems)
                    {
                        dataset.Projections.Add(new ProjectionsViewModel(projection, projection, true));
                    }
                }
                else
                {
                    foreach (var projection in availableProjections)
                    {
                        dataset.Projections.Add(new ProjectionsViewModel(projection, projection, true));
                    }
                }
            }

            return datasets;
        }

        public List<ProjectionsViewModel> GetAvailableProjections(Dataset dataset, List<DatasetFileViewModel> datasetFiles)
        {
            var availableProjections = datasetFiles.GroupBy(p => p.Category).Select(p => p.Key).ToList();
            if (dataset.Projections.Any())
            {
                List<string> newItems = availableProjections.Where(p => dataset.Projections.All(p2 => p2.Name != p)).ToList();

                foreach (var projection in newItems)
                {
                    dataset.Projections.Add(new ProjectionsViewModel(projection, projection, true));
                }
            }
            else
            {
                foreach (var projection in availableProjections)
                {
                    dataset.Projections.Add(new ProjectionsViewModel(projection, projection, true));
                }
            }

            return dataset.Projections;
        }

        public List<FormatsViewModel> GetAvailableFormats(Dataset dataset, List<DatasetFileViewModel> datasetFiles)
        {
            var availableFormats = datasetFiles.GroupBy(p => p.Format).Select(p => p.Key).ToList();
            if (dataset.Formats.Any())
            {
                List<string> newItems = availableFormats.Where(f => dataset.Formats.All(f2 => f2.Name != f)).ToList();

                foreach (var format in newItems)
                {
                    dataset.Formats.Add(new FormatsViewModel(format, format, true));
                }
            }
            else
            {
                foreach (var format in availableFormats)
                {
                    dataset.Formats.Add(new FormatsViewModel(format, format, true));
                }
            }

            return dataset.Formats;
        }

        private List<Download> ConvertToNewVersionOfDownloadFile(List<Download> downloads)
        {
            var newListOfDatasetForDownload = new List<Download>();
            var datasetFilesSelectedForDownload = GetSelectedDatasetFilesFromDownloadFile();
            foreach (var download in downloads)
            {
                if (!download.Files.Any() && !download.Subscribe)
                {
                    Log.Debug("Convert to new version of download file");
                    download.Files = ConvertToNewVersionOfDownloadFile(download, datasetFilesSelectedForDownload);
                    newListOfDatasetForDownload.Add(download);
                }
                else
                {
                    // if dataset file hase items, it is the new version of download file. 
                    return downloads;
                }
            }

            return newListOfDatasetForDownload;
        }

        private List<DatasetFile> GetSelectedDatasetFilesFromDownloadFile()
        {
            var downloadFileInfo = new FileInfo(ApplicationService.GetOldDownloadFilePath());
            if (downloadFileInfo.Exists)
            {
                try
                {
                    using (var r = new StreamReader(ApplicationService.GetOldDownloadFilePath()))
                    {
                        var json = r.ReadToEnd();
                        var selecedForDownload = JsonConvert.DeserializeObject<List<DatasetFile>>(json);
                        Log.Debug("Get selected dataset from download.json");
                        r.Close();
                        return selecedForDownload;
                    }
                }
                catch (Exception e)
                {
                    Log.Error(e, "Could not read from old config file, download.json");
                    return new List<DatasetFile>();
                }
            }
            return new List<DatasetFile>();
        }


        private List<Download> GetSelectedDatasetFilesFromDownloadFileAsDownloadModel()
        {
            var downloadFileInfo = new FileInfo(ApplicationService.GetOldDownloadFilePath());
            if (downloadFileInfo.Exists)
            {
                Log.Information("Old version of config file - download exists");
                try
                {
                    using (var r = new StreamReader(ApplicationService.GetOldDownloadFilePath()))
                    {
                        var json = r.ReadToEnd();
                        var selecedForDownload = JsonConvert.DeserializeObject<List<Download>>(json);
                        r.Close();
                        return selecedForDownload;
                    }
                }
                catch (Exception e)
                {
                    Log.Error(e, "Could not read from old config file, download.json");
                    return new List<Download>();
                }
            }
            return new List<Download>();
        }


        /// <summary>
        /// Part of converting from old version of config file. 
        /// </summary>
        /// <param name="items"></param>
        /// <returns></returns>
        public List<Download> RemoveDuplicatesIterative(List<Download> items)
        {
            Log.Debug("Remove duplicate iteratives of datasets");
            var result = new List<Download>();
            var set = new HashSet<string>();
            for (int i = 0; i < items.Count; i++)
            {
                if (string.IsNullOrWhiteSpace(items[i].DatasetTitle))
                {
                    if (!set.Contains(items[i].DatasetId))
                    {
                        result.Add(items[i]);
                        set.Add(items[i].DatasetId);
                    }
                }
                else
                {
                    if (!set.Contains(items[i].DatasetTitle))
                    {
                        result.Add(items[i]);
                        set.Add(items[i].DatasetId);
                    }
                }
            }
            return result;
        }


        /// <summary>
        /// Returns a list of downloded datasets. 
        /// </summary>
        /// <returns></returns>
        public DownloadHistory GetFileDownloaHistory(string url)
        {
            var downloadHistoryFilePath = ApplicationService.GetDownloadHistoryFilePath(_configFile.Name);
            try
            {
                using (var r = new StreamReader(downloadHistoryFilePath))
                {
                    var json = r.ReadToEnd();
                    var downloadHistories = JsonConvert.DeserializeObject<List<DownloadHistory>>(json);
                    Log.Debug("Read from download history file, " + _configFile.Name + "- downloadHistory.json");
                    r.Close();
                    if(downloadHistories != null)
                    { 
                        DownloadHistory downloadHistory = downloadHistories.FirstOrDefault(d => d.Id == url);
                        return downloadHistory;
                    }
                    return null;
                }
            }
            catch (FileNotFoundException e)
            {
                Log.Error("Could not find " + _configFile.Name + "- downloadHistory.json");
                return null;
            }
        }

        /// <summary>
        /// Returns selected files to download as downlaod view models
        /// </summary>
        /// <returns></returns>
        public List<DownloadViewModel> GetSelectedFilesToDownloadAsViewModel()
        {
            List<Download> selectedFiles = GetSelectedFilesToDownload(_configFile);
            return ConvertToViewModel(selectedFiles, true);
        }


        private List<DatasetFileViewModel> ConvertToViewModel(List<DatasetFile> datasetFiles, bool selectedForDownload = false)
        {
            var selectedFilesViewModel = new List<DatasetFileViewModel>();
            foreach (var selectedFile in datasetFiles)
            {
                string epsgName = GetEpsgName(selectedFile);
                DatasetFileViewModel selectedFileViewModel = new DatasetFileViewModel(selectedFile, epsgName, selectedForDownload);
                selectedFilesViewModel.Add(selectedFileViewModel);
            }
            return selectedFilesViewModel;
        }

        private List<DownloadViewModel> ConvertToViewModel(List<Download> datasetToDownload, bool selectedForDownload = false)
        {
            var selectedFilesViewModel = new List<DownloadViewModel>();
            foreach (var dataset in datasetToDownload)
            {
                DownloadViewModel selectedFileViewModel = new DownloadViewModel(dataset, selectedForDownload);
                selectedFilesViewModel.Add(selectedFileViewModel);
            }
            return selectedFilesViewModel;
        }

        private List<DatasetFile> ConvertToNewVersionOfDownloadFile(Download dataset, List<DatasetFile> datasetFilesSelectedForDownload)
        {
            foreach (var file in datasetFilesSelectedForDownload)
            {
                // TODO gamle dewnload filer har ikke dataset uuid.. 
                if ((file.DatasetId == dataset.DatasetTitle) || (file.DatasetId == dataset.DatasetId))
                {
                    dataset.Files.Add(file);
                }
            }
            return dataset.Files;
        }


        /// <summary>
        /// Write list of projections to file in case epsg-registry won't respond
        /// </summary>
        /// <param name="projections"></param>
        public void WriteToProjectionFile(List<Projections> projections)
        {
            var serializer = new JsonSerializer();

            serializer.Converters.Add(new JavaScriptDateTimeConverter());
            serializer.NullValueHandling = NullValueHandling.Ignore;

            try
            {
                using (var outputFile = new StreamWriter(ApplicationService.GetProjectionFilePath(), false))
                using (JsonWriter writer = new JsonTextWriter(outputFile))
                {
                    serializer.Serialize(writer, projections);
                    Log.Debug("Write to projection file");
                    writer.Close();
                }
            }
            catch (Exception e)
            {
                Log.Error(e, "Write to projection file");
            }
        }

        /// <summary>
        /// Write list of download usage to file in case registry api won't respond
        /// </summary>
        /// <param name="userGroups">list of user groups</param>
        public void WriteToUsageGroupFile(List<string> userGroups)
        {
            var serializer = new JsonSerializer();

            serializer.Converters.Add(new JavaScriptDateTimeConverter());
            serializer.NullValueHandling = NullValueHandling.Ignore;

            try
            {
                using (var outputFile = new StreamWriter(ApplicationService.GetUserGroupsFilePath(), false))
                using (JsonWriter writer = new JsonTextWriter(outputFile))
                {
                    serializer.Serialize(writer, userGroups);
                    Log.Debug("Write to download usage file");
                    writer.Close();
                }
            }
            catch (Exception e)
            {
                Log.Error(e, "Write to download usage file");
            }
        }

        /// <summary>
        /// /// Write list of download usage to file in case registry api won't respond
        /// </summary>
        /// <param name="userPurposes">list of purposes</param>
        public void WriteToUsagePurposeFile(List<string> userPurposes)
        {
            var serializer = new JsonSerializer();

            serializer.Converters.Add(new JavaScriptDateTimeConverter());
            serializer.NullValueHandling = NullValueHandling.Ignore;

            try
            {
                using (var outputFile = new StreamWriter(ApplicationService.GetPurposesFilePath(), false))
                using (JsonWriter writer = new JsonTextWriter(outputFile))
                {
                    serializer.Serialize(writer, userPurposes);
                    Log.Debug("Write to download usage purpose file");
                    writer.Close();
                }
            }
            catch (Exception e)
            {
                Log.Error(e, "Write to download usage purpose file");
            }
        }



        private static string GetEpsgName(DatasetFile selectedFile)
        {
            var projection = ApplicationService.GetProjections().FirstOrDefault(p => p.Epsg == selectedFile.Projection);
            return projection != null ? projection.Name : selectedFile.Projection;
        }

        /// <summary>
        /// Post selected download usage to "Nedlasting api" 
        /// </summary>
        /// <param name="downloadUsage"></param>
        public void SendDownloadUsage(DownloadUsage downloadUsage)
        {
            try
            {
                if (downloadUsage != null && downloadUsage.Entries.Any())
                {
                    var json = JsonConvert.SerializeObject(downloadUsage);
                    var stringContent = new StringContent(json, Encoding.UTF8, "application/json");

                    string token = !string.IsNullOrWhiteSpace(AppSettings.StatisticsToken) ? AppSettings.StatisticsToken : AppSettings.TestStatisticsToken;
                    string downloadUsageUrl = !string.IsNullOrWhiteSpace(AppSettings.NedlatingsApiDownloadUsage) ? AppSettings.NedlatingsApiDownloadUsage : AppSettings.NedlatingsApiDownloadUsageDev;

                    HttpClient hc = new HttpClient();
                    hc.DefaultRequestHeaders.Add("Authorization", "Bearer " + token);
                    var respons = hc.PostAsync(downloadUsageUrl, stringContent).Result;
                }
            }
            catch (Exception e)
            {
                Log.Error(e, "Sending download usage");
            }
        }

        /// <summary>
        /// Move content from old config file to default config file. 
        /// </summary>
        public void ConvertDownloadToDefaultConfigFileIfExists()
        {
            var selecedForDownload = GetSelectedDatasetFilesFromDownloadFileAsDownloadModel();
            if (selecedForDownload.Any())
            {
                Log.Information("Convert from download.json to default.json");
                selecedForDownload = RemoveDuplicatesIterative(selecedForDownload);
                selecedForDownload = ConvertToNewVersionOfDownloadFile(selecedForDownload);

                if (_configFile.IsDefault())
                {
                    WriteToConfigFile(selecedForDownload);
                    File.Delete(ApplicationService.GetOldDownloadFilePath());
                }
            }
        }

        public void UpdateProjections()
        {
            try
            {
                FetchProjections();
            }
            catch (Exception e)
            {
                Log.Error(e, "Could not fetch projections");
            }
        }
    }
}