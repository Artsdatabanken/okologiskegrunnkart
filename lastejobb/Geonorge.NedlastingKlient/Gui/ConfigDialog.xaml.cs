
using System;
using System.Collections.Generic;
using System.Linq;
using System.Reflection;
using System.Text.RegularExpressions;
using System.Threading.Tasks;
using System.Windows;
using System.Windows.Controls;
using System.Windows.Forms.VisualStyles;
using Serilog;

namespace Geonorge.MassivNedlasting.Gui
{
    /// <summary>
    /// Interaction logic for Login.xaml
    /// </summary>
    public partial class ConfigDialog
    {
        private AppSettings _appSettings;
        private bool _editConfig = true;
        private bool _newConfig = false;
        private ConfigFile _selectedConfigFile;

        private static readonly ILogger Log = Serilog.Log.ForContext(MethodBase.GetCurrentMethod().DeclaringType);

        public static readonly DependencyProperty DownloadDirectoryPathProperty = DependencyProperty.Register("DownloadDirectoryPath", typeof(string), typeof(SettingsDialog),
            new FrameworkPropertyMetadata());

        public static readonly DependencyProperty LogDirectoryPathProperty = DependencyProperty.Register("LogDirectoryPath", typeof(string), typeof(SettingsDialog),
            new FrameworkPropertyMetadata());

        public string DownloadDirectory { get { return (string)GetValue(DownloadDirectoryPathProperty) ?? string.Empty; } set { SetValue(DownloadDirectoryPathProperty, value); } }
        public string LogDirectory { get { return (string)GetValue(LogDirectoryPathProperty) ?? string.Empty; } set { SetValue(LogDirectoryPathProperty, value); } }


        public ConfigDialog()
        {
            _appSettings = ApplicationService.GetAppSettings();
            if (_appSettings.TempConfigFile != null)
            {
                _appSettings.TempConfigFile = null;
                ApplicationService.WriteToAppSettingsFile(_appSettings);
            }
            _selectedConfigFile = _appSettings.LastOpendConfigFile;
            _appSettings.TempConfigFile = null;

            DownloadDirectory = _selectedConfigFile.DownloadDirectory;
            LogDirectory = _selectedConfigFile.LogDirectory;

            InitializeComponent();

            ConfigFilesList.ItemsSource = ApplicationService.NameConfigFiles();
            ConfigFilesList.SelectedItem = _selectedConfigFile.Name;
            ConfigNameTextBox.Text = _selectedConfigFile.Name;

            GetDownloadUsage();
        }

        private void GetDownloadUsage()
        {
            if (_selectedConfigFile.DownloadUsage == null)
            {
                var downloadUsageDialog = new DownloadUsageDialog();
                downloadUsageDialog.ShowDialog();
                _appSettings = ApplicationService.GetAppSettings();
                _selectedConfigFile = _appSettings.LastOpendConfigFile;
            }
            ShowDownloadUsage();
        }

        private void ConfigFilesList_OnSelectionChanged(object sender, SelectionChangedEventArgs e)
        {
            var cmbConfig = (ComboBox)sender;
            if (cmbConfig != null && !string.IsNullOrWhiteSpace(cmbConfig.Text) && cmbConfig.SelectedItem != null)
            {
                _appSettings.LastOpendConfigFile = _appSettings.GetConfigByName(cmbConfig.SelectedItem.ToString());
                ShowSelectedConfigFile();
            }
        }


        private void BtnNewConfigFile_OnClick(object sender, RoutedEventArgs e)
        {
            _appSettings.TempConfigFile = new ConfigFile();
            ApplicationService.WriteToAppSettingsFile(_appSettings);
            StatusNewConfigFile();

            _selectedConfigFile = new ConfigFile();
            DownloadDirectory = string.Empty;
            LogDirectory = string.Empty;
            FolderPickerDialogBox.DirectoryPath = null;
            FolderPickerDialogBoxLog.DirectoryPath = null;
            btnNew.IsEnabled = false;

            HideDownloadUsage();
        }

        private void BtnEditDownloadUsage_OnClick(object sender, RoutedEventArgs e)
        {
            ApplicationService.WriteToAppSettingsFile(_appSettings);
            var downloadUsageDialog = new DownloadUsageDialog();
            downloadUsageDialog.ShowDialog();
            _appSettings = ApplicationService.GetAppSettings();
            if (_newConfig && _appSettings.TempConfigFile != null)
            {
                _selectedConfigFile.DownloadUsage = _appSettings.TempConfigFile.DownloadUsage;
                //_appSettings.TempConfigFile = null;
            }
            else if (_editConfig)
            {
                _selectedConfigFile = _appSettings.LastOpendConfigFile;
            }
            GetDownloadUsage();
        }

        private void BtnDialogDelete_Click(object sender, RoutedEventArgs e)
        {
            var result = MessageBox.Show("Er du sikker på at du vil slette " + _selectedConfigFile.Name, "Slett",
                MessageBoxButton.YesNo);

            if (result == MessageBoxResult.Yes)
            {
                if (_appSettings.ConfigFiles.Count > 1)
                {
                    foreach (var configFile in _appSettings.ConfigFiles)
                    {
                        if (_selectedConfigFile.Id == configFile.Id)
                        {
                            var remove = _appSettings.ConfigFiles.Remove(_selectedConfigFile);
                            break;
                        }
                    }

                    _appSettings.LastOpendConfigFile = _appSettings.ConfigFiles.FirstOrDefault();
                    ApplicationService.WriteToAppSettingsFile(_appSettings);
                    ShowSelectedConfigFile();
                }

                StatusEditConfigFile();
            }
        }

        private void BtnDialogSave_Click(object sender, RoutedEventArgs e)
        {
            if (NewConfigFileIsValid())
            {
                if (_editConfig)
                {
                    foreach (var config in _appSettings.ConfigFiles)
                    {
                        if (config.Id == _selectedConfigFile.Id)
                        {
                            var oldName = config.Name;
                            config.Name = CleanName();
                            if (config.Name != oldName) ChangeNameOnConfigFile(config, config.Name);
                            config.FilePath = ApplicationService.GetDownloadFilePath(config.Name);
                            config.DownloadDirectory = FolderPickerDialogBox.DirectoryPath;
                            config.LogDirectory = FolderPickerDialogBoxLog.DirectoryPath;
                            _appSettings.LastOpendConfigFile = config;
                            break;
                        }
                    }
                }
                else
                {
                    var configFile = NewConfigFile();
                    _appSettings.ConfigFiles.Add(configFile);
                    _appSettings.LastOpendConfigFile = configFile;
                    _selectedConfigFile = configFile;
                    _appSettings.TempConfigFile = null;

                }
            }
            else
            {
                return;
            }

            _appSettings.TempConfigFile = null;
            ApplicationService.WriteToAppSettingsFile(_appSettings);
            ShowSelectedConfigFile();
            StatusEditConfigFile();
        }

        private static void ChangeNameOnConfigFile(ConfigFile config, string oldName)
        {
            try
            {
                System.IO.File.Move(config.FilePath, ApplicationService.GetDownloadFilePath(config.Name));
                System.IO.File.Move(ApplicationService.GetDownloadHistoryFilePath(oldName), ApplicationService.GetDownloadFilePath(config.Name));
            }
            catch (Exception ex)
            {
                Log.Error(ex, "Could not rename config file or download-history file");
            }
        }

        private string CleanName()
        {
            try
            {
                return Regex.Replace(ConfigNameTextBox.Text, @"[^a-zA-Z0-9 -]", "",
                    RegexOptions.None, TimeSpan.FromSeconds(1.5));
            }
            catch (RegexMatchTimeoutException)
            {
                return string.Empty;
            }
        }

        private void StatusEditConfigFile()
        {
            _editConfig = true;
            _newConfig = false;
        }

        private void StatusNewConfigFile()
        {
            _editConfig = false;
            _newConfig = true;
        }

        private ConfigFile NewConfigFile()
        {
            return new ConfigFile()
            {
                DownloadDirectory = FolderPickerDialogBox.DirectoryPath,
                LogDirectory = FolderPickerDialogBoxLog.DirectoryPath,
                Name = CleanName(),
                FilePath = ApplicationService.GetDownloadFilePath(ConfigNameTextBox.Text),
                DownloadUsage = _selectedConfigFile.DownloadUsage
            };
        }


        private void ShowDownloadUsage()
        {
            DownloadUsageGroupLayout.Visibility = Visibility.Visible;
            DownloadUsagePurposeLayout.Visibility = Visibility.Visible;
            DownloadUsagePurpose.ItemsSource = _selectedConfigFile.DownloadUsage.Purpose;
            DownloadUsageGroup.Text = _selectedConfigFile.DownloadUsage.Group;
        }

        private void HideDownloadUsage()
        {
            ConfigNameTextBox.Text = "";
            DownloadUsageGroupLayout.Visibility = Visibility.Hidden;
            DownloadUsageGroup.Text = "";
            DownloadUsagePurposeLayout.Visibility = Visibility.Hidden;
            DownloadUsagePurpose.ItemsSource = null;
        }

        private bool NameIsValid()
        {
            foreach (var config in _appSettings.ConfigFiles)
            {
                if (config.Name == ConfigNameTextBox.Text && config.Id != _selectedConfigFile.Id)
                {
                    return false;
                }
            }
            return true;
        }

        private bool NewConfigFileIsValid()
        {
            var errorList = new List<string>();
            bool valid = true;

            if (!NameIsValid())
            {
                valid = false;
                errorList.Add("* Navn finnes fra før");
            }
            if (string.IsNullOrWhiteSpace(FolderPickerDialogBox.DirectoryPath))
            {
                // Feilmelding
                valid = false;
                errorList.Add("* Nedlastingsmappe er ikke angitt");
            }
            if (string.IsNullOrWhiteSpace(FolderPickerDialogBoxLog.DirectoryPath))
            {
                // Feilmelding
                valid = false;
                errorList.Add("* Logg mappe er ikke angitt");
            }
            if (string.IsNullOrWhiteSpace(ConfigNameTextBox.Text))
            {
                // Feilmelding
                valid = false;
                errorList.Add("* Navn er ikke angitt");
            }
            if (string.IsNullOrWhiteSpace(DownloadUsageGroup.Text))
            {
                // Feilmelding
                valid = false;
                errorList.Add("* Brukergruppe og formål er ikke angitt");
            }

            if (!valid)
            {
                ShowValidation(errorList);
            }
            else
            {
                HideValidation();
            }
            return valid;
        }

        private void ShowValidation(List<string> errorList)
        {
            Validation.Visibility = Visibility.Visible;
            ErrorList.ItemsSource = errorList;
        }

        private void HideValidation()
        {
            Validation.Visibility = Visibility.Collapsed;
            ErrorList.ItemsSource = null;
        }

        private void ShowSelectedConfigFile()
        {
            _selectedConfigFile = _appSettings.LastOpendConfigFile;
            ConfigFilesList.ItemsSource = ApplicationService.NameConfigFiles();
            FolderPickerDialogBoxLog.DirectoryPath = _selectedConfigFile.LogDirectory;
            FolderPickerDialogBox.DirectoryPath = _selectedConfigFile.DownloadDirectory;
            if (ConfigFilesList.SelectedItem != _selectedConfigFile.Name)
            {
                ConfigFilesList.SelectedItem = _selectedConfigFile.Name;
            }

            ConfigNameTextBox.Text = _selectedConfigFile.Name;
            HideValidation();
            btnNew.IsEnabled = true;
            GetDownloadUsage();

        }
    }
}
