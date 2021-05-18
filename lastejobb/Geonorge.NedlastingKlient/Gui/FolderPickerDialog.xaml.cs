using System.Windows;

namespace Geonorge.MassivNedlasting.Gui
{
    /// <summary>
    /// Interaction logic for FolderPickerDialog.xaml
    /// </summary>
    public partial class FolderPickerDialog
    {

        public static readonly DependencyProperty DirectoryPathProperty = DependencyProperty.Register("DirectoryPath", typeof(string), typeof(FolderPickerDialog),
            new FrameworkPropertyMetadata());

        public string DirectoryPath { get { return (string)GetValue(DirectoryPathProperty) ?? string.Empty; } set { SetValue(DirectoryPathProperty, value); } }


        public FolderPickerDialog()
        {
            InitializeComponent();
        }

        private void FolderButton_OnClick(object sender, RoutedEventArgs e)
        {
            using (var folderDialog = new System.Windows.Forms.FolderBrowserDialog())
            {
                if (!string.IsNullOrEmpty(DirectoryPath))
                {
                    folderDialog.SelectedPath = DirectoryPath;
                }
                folderDialog.ShowDialog();
                DirectoryPath = folderDialog.SelectedPath;
            }
        }
    }
}
