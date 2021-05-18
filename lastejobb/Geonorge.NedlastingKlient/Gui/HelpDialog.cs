using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Reflection;
using System.Text;
using System.Threading.Tasks;
using System.Web.Configuration;
using System.Windows;
using System.Windows.Controls;
using System.Windows.Data;
using System.Windows.Documents;
using System.Windows.Input;
using System.Windows.Media;
using System.Windows.Media.Imaging;
using System.Windows.Shapes;

namespace Geonorge.MassivNedlasting.Gui
{
    /// <summary>
    /// Interaction logic for Window1.xaml
    /// </summary>
    public partial class HelpDialog : Window
    {
        public string vnr = WebConfigurationManager.AppSettings["BuildVersionNumber"];

        public HelpDialog()
        {
            InitializeComponent();
            var massivNedlastingVersjon = new MassivNedlastingVersion(new GitHubReleaseInfoReader());
            var currentVersion = MassivNedlastingVersion.Current;
            if (massivNedlastingVersjon.UpdateIsAvailable())
            {
                versionStatusMessage.Visibility = Visibility.Visible;
                versionStatusMessage.Text = "Ny versjon tilgjengelig!";
            }
            else
            {
                versionStatusMessage.Visibility = Visibility.Collapsed;
            }
            txtVersion.Text = currentVersion;
        }

        private void Hyperlink_Click(object sender, RoutedEventArgs e)
        {
            Process.Start("https://www.geonorge.no/verktoy/APIer-og-grensesnitt/massivnedlastingsklient/");
        }

        private void VersionHyperlink_OnClick(object sender, RoutedEventArgs e)
        {
            Process.Start("https://github.com/kartverket/Geonorge.NedlastingKlient/releases/latest");
        }
    }
}
