using System;
using System.Collections.Generic;
using System.ComponentModel;
using System.Diagnostics;
using System.IO;
using System.Linq;
using System.Reflection;
using System.Threading.Tasks;
using System.Windows;
using System.Windows.Controls;
using System.Windows.Controls.Primitives;
using System.Windows.Data;
using System.Windows.Documents;
using Serilog;

namespace Geonorge.MassivNedlasting.Gui
{
    /// <summary>
    ///     Interaction logic for MainWindow.xaml
    /// </summary>
    public partial class MainWindow
    {
        private AppSettings _appSettings;
        private DatasetService _datasetService;
        private Dataset _selectedDataset;
        private List<DatasetFileViewModel> _selectedDatasetFiles;
        private List<DownloadViewModel> _selectedFilesForDownload;
        private ConfigFile _selectedConfigFile;
        private Visibility _versionStatusMessage;
        private string _currentVersion;
        public bool LoggedIn;


        public MainWindow()
        {
            Log.Logger = new LoggerConfiguration()
                .MinimumLevel.Information()
                .WriteTo.File("log-.txt",
                    rollOnFileSizeLimit: true,
                    shared: true,
                    flushToDiskInterval: TimeSpan.FromSeconds(1))
                .CreateLogger();

            Log.Information("Start application");

            InitializeComponent();


            BtnSelectAll.Visibility = Visibility.Hidden;
            BtnSelectAll.IsChecked = false;
            ToggleSubscribeSelectedDatasetFiles.Visibility = Visibility.Hidden;
            MenuSubscribe.Visibility = Visibility.Hidden;

            var massivNedlastingVersjon = new MassivNedlastingVersion(new GitHubReleaseInfoReader());
            _currentVersion = MassivNedlastingVersion.Current;
            if (massivNedlastingVersjon.UpdateIsAvailable())
            {
                versionStatusMessage.Visibility = Visibility.Visible;
                versionStatusMessage.Text = "Ny versjon tilgjengelig!";
            }
            else
            {
                versionStatusMessage.Visibility = Visibility.Collapsed;
            }

            _appSettings = ApplicationService.GetAppSettings();
            _datasetService = new DatasetService(_appSettings.LastOpendConfigFile);
            _selectedConfigFile = _appSettings.LastOpendConfigFile;
            _datasetService.UpdateProjections();
            _datasetService.ConvertDownloadToDefaultConfigFileIfExists();


            try
            {
                LbDatasets.ItemsSource = _datasetService.GetDatasets();
            }
            catch (Exception)
            {
                MessageBox.Show("Klarer ikke hente datasett... Sjekk internett tilkoblingen din");
            }


            _selectedFilesForDownload = _datasetService.GetSelectedFilesToDownloadAsViewModel();
            _selectedDatasetFiles = new List<DatasetFileViewModel>();

            var viewDatasets = (CollectionView)CollectionViewSource.GetDefaultView(LbDatasets.ItemsSource);
            if (viewDatasets != null) viewDatasets.Filter = UserDatasetFilter;

            LbSelectedFilesForDownload.ItemsSource = _selectedFilesForDownload;

            cmbConfigFiles.ItemsSource = ApplicationService.NameConfigFiles();
            cmbConfigFiles.SelectedItem = _selectedConfigFile.Name;

            SetDownloadUsage();

            RunWatch();
        }

        public void RunWatch()
        {
            var watcher = new FileSystemWatcher();
            watcher.NotifyFilter = NotifyFilters.LastWrite;
            watcher.Path = ApplicationService.GetConfigAppDirectory().FullName;
            watcher.Changed += OnChanged;
            watcher.EnableRaisingEvents = true;
        }

        private void OnChanged(object source, FileSystemEventArgs e)
        {
            try
            {
                _selectedFilesForDownload = _datasetService.GetSelectedFilesToDownloadAsViewModel();
                Dispatcher.Invoke(() =>
                {
                    LbSelectedFilesForDownload.ItemsSource = _selectedFilesForDownload;
                });

            }
            catch (Exception err)
            {
                System.Windows.MessageBox.Show(err.Message);
            }
        }

        private void SetDownloadUsage()
        {
            if (!_selectedConfigFile.DownloadUsageIsSet())
            {
                Log.Information("Set download usage");
                var downloadUsageDialog = new DownloadUsageDialog();
                downloadUsageDialog.ShowDialog();
            }
        }

        private bool UserDatasetFilter(object item)
        {
            if (string.IsNullOrEmpty(SearchDataset.Text))
                return true;
            return (item as Dataset).Title.IndexOf(SearchDataset.Text, StringComparison.OrdinalIgnoreCase) >= 0 ||
                   (item as Dataset).Organization.IndexOf(SearchDataset.Text, StringComparison.OrdinalIgnoreCase) >= 0;
        }

        private bool UserDatasetFileFilter(object item)
        {
            if (string.IsNullOrEmpty(SearchDatasetFiles.Text))
                return true;
            return (item as DatasetFileViewModel).Title.IndexOf(SearchDatasetFiles.Text,
                       StringComparison.OrdinalIgnoreCase) >= 0 ||
                   (item as DatasetFileViewModel).Category.IndexOf(SearchDatasetFiles.Text,
                       StringComparison.OrdinalIgnoreCase) >= 0;
        }


        private async void ShowFiles(object sender, RoutedEventArgs e)
        {
            if (sender is ListBox listBoxItem)
            {
                if (listBoxItem.SelectedItems.Count > 0)
                {
                    var selectedDataset = (Dataset)listBoxItem.SelectedItems[0];
                    if (selectedDataset != null)
                    {
                        _selectedDataset = selectedDataset;
                        progressBar.IsIndeterminate = true;

                        List<DatasetFileViewModel> datasetFiles = await Task.Run(() => GetFilesAsync(selectedDataset));
                        LbSelectedDatasetFiles.ItemsSource = datasetFiles;
                        selectedDataset.Projections = _datasetService.GetAvailableProjections(selectedDataset, datasetFiles);
                        selectedDataset.Formats = _datasetService.GetAvailableFormats(selectedDataset, datasetFiles);

                        var viewDatasetFiles =
                            (CollectionView)CollectionViewSource.GetDefaultView(LbSelectedDatasetFiles.ItemsSource);
                        if (viewDatasetFiles != null) viewDatasetFiles.Filter = UserDatasetFileFilter;

                        SubscribeOnSelectedDataset(selectedDataset.Title);
                        progressBar.IsIndeterminate = false;

                    }
                }

                BtnSelectAll.Visibility = Visibility.Visible;
                ToggleSubscribeSelectedDatasetFiles.Visibility = Visibility.Visible;

                BtnSelectAll.IsChecked = false;
            }
        }

        private void SubscribeOnSelectedDataset(string selectedDatasetTitle)
        {
            var subscribe = false;
            var autoAddFiles = false;
            var autoDeleteFiles = false;

            foreach (var download in _selectedFilesForDownload)
            {
                if (download.DatasetTitle == selectedDatasetTitle)
                {
                    subscribe = download.Subscribe;
                    autoAddFiles = download.AutoAddFiles;
                    autoDeleteFiles = download.AutoDeleteFiles;
                    lbProjections.ItemsSource = subscribe && download.Projections.Any() ? download.Projections : _selectedDataset.Projections;
                    lbFormats.ItemsSource = subscribe && download.Formats.Any() ? download.Formats : _selectedDataset.Formats;
                }
            }

            ToggleSubscribeSelectedDatasetFiles.IsChecked = subscribe;
            BtnAutoDeleteFiles.IsChecked = autoDeleteFiles;
            BtnAutoAddFiles.IsChecked = autoAddFiles;

            MenuSubscribe.Visibility = subscribe ? Visibility.Visible : Visibility.Hidden;
        }

        private List<DatasetFileViewModel> GetFilesAsync(Dataset selctedDataset)
        {
            var selectedDatasetFiles = _datasetService.GetDatasetFiles(selctedDataset);

            foreach (var dataset in _selectedFilesForDownload)
            {
                foreach (var selectedDownloadFile in dataset.Files)
                {
                    foreach (var datasetFile in selectedDatasetFiles)
                        if (selectedDownloadFile.Id == datasetFile.Id)
                        {
                            datasetFile.SelectedForDownload = true;
                            break;
                        }
                }
            }

            if (selectedDatasetFiles.Count == 0) MessageBox.Show("Ingen filer for dette datasettet");
            _selectedDatasetFiles = selectedDatasetFiles;
            return selectedDatasetFiles;
        }

        private void AddRemove_OnChecked(object sender, RoutedEventArgs e)
        {
            var btn = (ToggleButton)sender;
            var datasetFile = (DatasetFileViewModel)btn.DataContext;

            if (btn.IsChecked == true)
            {
                datasetFile.SelectedForDownload = true;
                AddToList(datasetFile);
            }
            else
            {
                RemoveFromList(datasetFile);
                datasetFile.SelectedForDownload = false;
            }
        }

        private void AddToList(DatasetFileViewModel selectedFile)
        {
            if (selectedFile != null)
            {
                var datasetExists = false;
                foreach (var dataset in _selectedFilesForDownload)
                {
                    if ((dataset.DatasetId == selectedFile.DatasetId) || (dataset.DatasetTitle == selectedFile.DatasetId))
                    {
                        dataset.Files.Add(selectedFile);
                        datasetExists = true;
                        break;
                    }
                }

                if (!datasetExists)
                {
                    var downloadViewModel = new DownloadViewModel(_selectedDataset, selectedFile);
                    _selectedFilesForDownload.Add(downloadViewModel);
                }

                BindNewList();
            }
            else
            {
                MessageBox.Show("Kunne ikke legge til fil...");
            }
        }

        private void RemoveFromList(DatasetFileViewModel selectedFile)
        {
            if (selectedFile != null)
            {
                foreach (var dataset in _selectedFilesForDownload)
                {
                    dataset.Files.RemoveAll(f => f.Id == selectedFile.Id);
                }
                var dataSet = _selectedFilesForDownload.Where(d => d.DatasetTitle == selectedFile.DatasetId).FirstOrDefault();
                if (!dataSet.Files.Any())
                    _selectedFilesForDownload.Remove(dataSet);

                BindNewList();
            }
            else
            {
                MessageBox.Show("Kunne ikke fjerne fil...");
            }
        }

        private void BindNewList()
        {
            try
            {
                LbSelectedFilesForDownload.ItemsSource = null;
                LbSelectedFilesForDownload.ItemsSource = _selectedFilesForDownload;
                LbSelectedDatasetFiles.ItemsSource = null;
                LbSelectedDatasetFiles.ItemsSource = _selectedDatasetFiles;
            }
            catch (Exception e)
            {

            }
        }



        private void RemoveFromDownloadList_Click(object sender, RoutedEventArgs e)
        {
            var btn = (Button)sender;
            var selectedDatasetFile = (DatasetFileViewModel)btn.DataContext;
            UpdateSelectedDatasetFiles(selectedDatasetFile);

            foreach (var download in _selectedFilesForDownload)
            {
                if (download.DatasetTitle == selectedDatasetFile.DatasetId)
                {
                    download.Files.Remove(selectedDatasetFile);
                    if (!download.Files.Any())
                    {
                        _selectedFilesForDownload.Remove(download);
                    }
                    break;
                }
            }

            BindNewList();
        }


        private void UpdateSelectedDatasetFiles(DatasetFileViewModel selectedDatasetFile)
        {
            if (_selectedDatasetFiles.Any())
                foreach (var datasetFile in _selectedDatasetFiles)
                    if (datasetFile.Id == selectedDatasetFile.Id)
                    {
                        datasetFile.SelectedForDownload = false;
                        break;
                    }
        }

        private void ClosingWindow(object sender, CancelEventArgs e)
        {
            SaveDownloadList();
            Log.Information("Close application");

        }

        private void SaveDownloadList()
        {
            _datasetService.WriteToConfigFile(_selectedFilesForDownload);
        }

        private void BtnSelectAll_OnClick(object sender, RoutedEventArgs e)
        {
            if (LbSelectedDatasetFiles.Items.IsEmpty) return;
            if (BtnSelectAll.IsChecked == true)
            {
                foreach (DatasetFileViewModel datasetFile in LbSelectedDatasetFiles.Items)
                    if (!datasetFile.SelectedForDownload)
                    {
                        datasetFile.SelectedForDownload = true;
                        AddToList(datasetFile);
                    }
            }
            else
            {
                foreach (var datasetFile in _selectedDatasetFiles)
                    if (datasetFile.SelectedForDownload)
                    {
                        datasetFile.SelectedForDownload = false;
                        RemoveFromList(datasetFile);
                    }
            }

            LbSelectedDatasetFiles.ItemsSource = null;
            LbSelectedDatasetFiles.ItemsSource = _selectedDatasetFiles;
        }

        private void BtnRemoveAll_OnClick(object sender, RoutedEventArgs e)
        {
            if (_selectedFilesForDownload.Any())
            {
                var result = MessageBox.Show("Er du sikker på at du vil slette alle", "Slett alle",
                    MessageBoxButton.YesNo);

                if (result == MessageBoxResult.Yes)
                {
                    _selectedFilesForDownload = new List<DownloadViewModel>();
                    foreach (var datasetfile in _selectedDatasetFiles) datasetfile.SelectedForDownload = false;
                    BindNewList();
                }

                BtnSelectAll.IsChecked = false;
            }
        }

        private void BtnDownload_OnClick(object sender, RoutedEventArgs e)
        {
            SaveDownloadList();

            var executingAssemblyDirectory = GetExecutingAssemblyDirectory();

            var pathToConsoleApp =
                Path.Combine(executingAssemblyDirectory, "..", "Nedlaster", "Geonorge.Nedlaster.exe");
            try
            {
                Log.Information("Start downloader");
                Process.Start(pathToConsoleApp, _appSettings.LastOpendConfigFile.Name);
            }
            catch (Exception er)
            {
                Log.Error(er, "Could not start downloader");
                MessageBox.Show("Finner ikke nedlaster...");
            }
        }

        private static string GetExecutingAssemblyDirectory()
        {
            var codeBase = Assembly.GetExecutingAssembly().CodeBase;
            var uri = new UriBuilder(codeBase);
            var path = Uri.UnescapeDataString(uri.Path);
            return Path.GetDirectoryName(path);
        }


        private void SearchDataset_OnTextChanged(object sender, TextChangedEventArgs e)
        {
            CollectionViewSource.GetDefaultView(LbDatasets.ItemsSource).Refresh();
        }

        private void SearchDatasetFiles_OnTextChanged(object sender, TextChangedEventArgs e)
        {
            if (LbSelectedDatasetFiles != null && LbSelectedDatasetFiles.ItemsSource != null)
                CollectionViewSource.GetDefaultView(LbSelectedDatasetFiles.ItemsSource).Refresh();
        }

        private void BtnSettings_OnClick(object sender, RoutedEventArgs e)
        {
            var loginDialog = new SettingsDialog();
            loginDialog.ShowDialog();
            _appSettings = ApplicationService.GetAppSettings();
            _selectedConfigFile = _appSettings.LastOpendConfigFile;
            cmbConfigFiles.ItemsSource = _appSettings.NameConfigFiles();
            cmbConfigFiles.SelectedItem = _selectedConfigFile.Name;
        }

        private void BtnHelp_OnClick(object sender, RoutedEventArgs e)
        {
            var helpDialog = new HelpDialog();
            helpDialog.ShowDialog();
        }

        private void BtnSave_OnClick(object sender, RoutedEventArgs e)
        {
            SaveDownloadList();
            Log.Information("Save download list");
        }

        private void BtnSubscribe_OnClick(object sender, RoutedEventArgs e)
        {
            var btn = (ToggleButton)sender;
            if (btn == null) return;

            var subscribe = btn.IsChecked.Value;

            var existsInList = false;

            foreach (var download in _selectedFilesForDownload)
            {
                if (download.DatasetTitle == _selectedDataset.Title)
                {
                    existsInList = true;
                    download.Subscribe = subscribe;
                    download.AutoAddFiles = subscribe;
                    download.AutoDeleteFiles = subscribe;
                    if (!download.Files.Any())
                    {
                        _selectedFilesForDownload.Remove(download);
                    }
                    break;
                }
            }

            if (!existsInList && subscribe)
            {
                var download = new DownloadViewModel(_selectedDataset, subscribe);
                _selectedFilesForDownload.Add(download);
            }
            lbProjections.ItemsSource = _selectedDataset.Projections;
            lbFormats.ItemsSource = _selectedDataset.Formats;
            MenuSubscribe.Visibility = subscribe ? Visibility.Visible : Visibility.Hidden;
            MenuSubscribe.IsPopupOpen = subscribe;
            BtnAutoDeleteFiles.IsChecked = subscribe;
            BtnAutoAddFiles.IsChecked = subscribe;

            BindNewList();
        }

        private void BtnAutoDeleteFiles_OnClick(object sender, RoutedEventArgs e)
        {
            var cbDelete = (CheckBox)sender;
            if (cbDelete == null)
            {
                return;
            }

            foreach (var download in _selectedFilesForDownload)
            {
                if (download.DatasetTitle == _selectedDataset.Title)
                {
                    if (cbDelete.IsChecked != null) download.AutoDeleteFiles = cbDelete.IsChecked.Value;
                }
            }
        }

        private void BtnAutoAddFiles_OnClick(object sender, RoutedEventArgs e)
        {
            var cbAdd = (CheckBox)sender;
            if (cbAdd == null)
            {
                return;
            }

            foreach (var download in _selectedFilesForDownload)
            {
                if (download.DatasetTitle == _selectedDataset.Title)
                {
                    if (cbAdd.IsChecked != null) download.AutoAddFiles = cbAdd.IsChecked.Value;
                }
            }
        }


        private void CmbConfigFiles_OnSelectionChanged(object sender, SelectionChangedEventArgs e)
        {
            var cmbConfig = (ComboBox)sender;
            if (cmbConfig?.SelectedItem != null)
            {
                SaveDownloadList();
                _datasetService = new DatasetService(_appSettings.GetConfigByName(cmbConfig.SelectedItem.ToString()));
                _appSettings.LastOpendConfigFile = _appSettings.GetConfigByName(cmbConfig.SelectedItem.ToString());
                ApplicationService.WriteToAppSettingsFile(_appSettings);
                _selectedFilesForDownload = _datasetService.GetSelectedFilesToDownloadAsViewModel();
                LbSelectedFilesForDownload.ItemsSource = _selectedFilesForDownload;
            }

        }

        private void Hyperlink_OnClick(object sender, RoutedEventArgs e)
        {
            Process.Start("https://github.com/kartverket/Geonorge.NedlastingKlient/releases/latest");
        }

        private void LbSelectedFilesForDownload_OnSelectedItemChanged(object sender, RoutedPropertyChangedEventArgs<object> e)
        {
            if (e.NewValue != null)
            {
                var downloadViewModel = e.NewValue as DownloadViewModel;
                if (downloadViewModel != null)
                {
                    downloadViewModel.Expanded = !downloadViewModel.Expanded;
                    BindNewList();
                }
            }
        }

        private void TreeViewItem_Expanded(object sender, RoutedEventArgs e)
        {
            TreeView treeView = sender as TreeView;
            TreeViewItem selectedTreeViewItem = e.OriginalSource as TreeViewItem;
           
            if (selectedTreeViewItem != null && treeView != null)
            {
                foreach (DownloadViewModel treeViewItem in treeView.Items)
                {
                    DownloadViewModel selecedDownloadViewModel = selectedTreeViewItem.DataContext as DownloadViewModel;

                    if (selecedDownloadViewModel != null && treeViewItem.DatasetTitle == selecedDownloadViewModel.DatasetTitle)
                    {
                        treeViewItem.Expanded = true;
                        break;
                    }
                }
            }
        }

        private void TreeViewItem_Collapsed(object sender, RoutedEventArgs e)
        {
            TreeView treeView = sender as TreeView;
            TreeViewItem selectedTreeViewItem = e.OriginalSource as TreeViewItem;

            if (selectedTreeViewItem != null && treeView != null)
            {
                foreach (DownloadViewModel treeViewItem in treeView.Items)
                {
                    DownloadViewModel selecedDownloadViewModel = selectedTreeViewItem.DataContext as DownloadViewModel;

                    if (selecedDownloadViewModel != null && treeViewItem.DatasetTitle == selecedDownloadViewModel.DatasetTitle)
                    {
                        treeViewItem.Expanded = false;
                        break;
                    }
                }
            }
        }

        private void BtnProjection_OnClick(object sender, RoutedEventArgs e)
        {
            var cbProjection = (CheckBox)sender;
            if (cbProjection == null)
            {
                return;
            }

            foreach (var download in _selectedFilesForDownload)
            {
                if (download.DatasetTitle == _selectedDataset.Title)
                {
                    var selectedProjection = cbProjection.Uid;
                    if (cbProjection.IsChecked != null)
                    {
                        foreach (var projection in download.Projections)
                        {
                            if (projection.Name == selectedProjection)
                            {
                                projection.Selected = cbProjection.IsChecked.Value;
                            }
                        }        
                    }

                    break;
                }
            }
        }
        private void BtnFormat_OnClick(object sender, RoutedEventArgs e)
        {
            var cbFormat = (CheckBox)sender;
            if (cbFormat == null)
            {
                return;
            }

            foreach (var download in _selectedFilesForDownload)
            {
                if (download.DatasetTitle == _selectedDataset.Title)
                {
                    var selectedFormat = cbFormat.Uid;
                    if (cbFormat.IsChecked != null)
                    {
                        foreach (var format in download.Formats)
                        {
                            if (format.Name == selectedFormat)
                            {
                                format.Selected = cbFormat.IsChecked.Value;
                            }
                        }
                    }

                    break;
                }
            }
        }
    }
}