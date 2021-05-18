
using System;
using System.Collections.Generic;
using System.Windows;

namespace Geonorge.MassivNedlasting.Gui
{
    /// <summary>
    /// Interaction logic for Login.xaml
    /// </summary>
    public partial class DownloadUsageDialog
    {
        private List<string> _downloadUsageGroup;
        private List<string> _downloadUsagePurposes;
        private List<PurposeViewModel> _downloadUsagePurposesViewModel;
        private AppSettings _appSettings;

        private ConfigFile _config;
        private readonly DatasetService _datasetService;

        public static readonly DependencyProperty DownloadUsageGroupProperty = DependencyProperty.Register("DownloadUsageGroup", typeof(string), typeof(DownloadUsageDialog),
            new FrameworkPropertyMetadata());


        public static readonly DependencyProperty DownloadUsagePurposeProperty = DependencyProperty.Register("DownloadUsagePurpose", typeof(List<string>), typeof(DownloadUsageDialog),
            new FrameworkPropertyMetadata());

        public string Group { get { return (string)GetValue(DownloadUsageGroupProperty) ?? string.Empty; } set { SetValue(DownloadUsageGroupProperty, value); } }
        public List<string> Purpose { get { return (List<string>)GetValue(DownloadUsagePurposeProperty) ?? new List<string>(); } set { SetValue(DownloadUsagePurposeProperty, value); } }


        public DownloadUsageDialog()
        {
            InitializeComponent();

            _appSettings = ApplicationService.GetAppSettings();
            _datasetService = new DatasetService(_appSettings.LastOpendConfigFile);
            _config = _appSettings.TempConfigFile ?? _appSettings.LastOpendConfigFile;

            try
            {
                _downloadUsageGroup = _datasetService.FetchDownloadUsageGroups();
            }
            catch (Exception e)
            {
                _downloadUsageGroup = _datasetService.ReadFromDownloadUsageGroup();
            }

            try
            {
                _downloadUsagePurposes = _datasetService.FetchDownloadUsagePurposes();
            }
            catch (Exception e)
            {
                _downloadUsagePurposes = _datasetService.ReadFromDownloadUsagePurposes();
            }


            if (_config.DownloadUsageIsSet())
            {
                Group = _config.DownloadUsage.Group;
                Purpose = _config.DownloadUsage.Purpose;
            }

            _downloadUsagePurposesViewModel = new List<PurposeViewModel>();
            foreach (var item in _downloadUsagePurposes)
            {
                _downloadUsagePurposesViewModel.Add(new PurposeViewModel(item, Purpose));
            }
            
            cmbDownloadUsageGroups.ItemsSource = _downloadUsageGroup;
            cmbDownloadUsageGroups.SelectedItem = Group;
            lbPurposes.ItemsSource = _downloadUsagePurposesViewModel;
            //lbPurposes.SelectedValue = Purpose;
        }

        private void BtnDialogOk_Click(object sender, RoutedEventArgs e)
        {
            _config.DownloadUsage = new DownloadUsage();
            bool purposeIsSelected = false;
            bool groupIsSelected = false;

            foreach (var purpose in _downloadUsagePurposesViewModel)
            {
                if (purpose.IsSelected)
                {
                    purposeIsSelected = true;
                    _config.DownloadUsage.Purpose.Add(purpose.Purpose);
                }
            }

            if (cmbDownloadUsageGroups.SelectedItem != null)
            {
                groupIsSelected = true;
                _config.DownloadUsage.Group = cmbDownloadUsageGroups.SelectedItem.ToString();
            }

            if (purposeIsSelected && groupIsSelected)
            {
                if (_appSettings.TempConfigFile != null)
                {
                    _appSettings.TempConfigFile.DownloadUsage.Purpose = _config.DownloadUsage.Purpose;
                    _appSettings.TempConfigFile.DownloadUsage.Group = _config.DownloadUsage.Group;
                }
                else
                {
                    _appSettings.LastOpendConfigFile = _config;
                    foreach (var configFile in _appSettings.ConfigFiles)
                    {
                        if (configFile.Name == _config.Name)
                        {
                            configFile.DownloadUsage = _config.DownloadUsage;
                        }
                    }
                }
                ApplicationService.WriteToAppSettingsFile(_appSettings);
                Close();
            }
            else
            {
                MessageBox.Show("Du må angi brukergruppe og formål.");
            }
        }
    }

}
