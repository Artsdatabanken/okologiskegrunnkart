
using System;
using System.Collections.Generic;
using System.Windows;

namespace Geonorge.MassivNedlasting.Gui
{
    /// <summary>
    /// Interaction logic for Login.xaml
    /// </summary>
    public partial class SettingsDialog
    {
        private AppSettings _appSettings;
        private List<string> _configFiles;

        public SettingsDialog()
        {
            _appSettings = ApplicationService.GetAppSettings();

            InitializeComponent();

            txtUsername.Text = _appSettings.Username;
            txtPassword.Password = ProtectionService.GetUnprotectedPassword(_appSettings.Password);
            ConfigFilesList.ItemsSource = ApplicationService.NameConfigFiles();
        }
        

        private void BtnDialogOk_Click(object sender, RoutedEventArgs e)
        {
            _appSettings.Password = ProtectionService.CreateProtectedPassword(txtPassword.Password);
            _appSettings.Username = txtUsername.Text;
            ApplicationService.WriteToAppSettingsFile(_appSettings);

            Close();
        }

        private void ButtonEditConfig_OnClick(object sender, RoutedEventArgs e)
        {
            var configDialog = new ConfigDialog();
            configDialog.ShowDialog();
            ConfigFilesList.ItemsSource = ApplicationService.NameConfigFiles();
            _appSettings = ApplicationService.GetAppSettings();
        }
    }

}
