using System.Linq;

namespace Geonorge.MassivNedlasting.Gui
{
    public class Formats
    {

        public Formats(dynamic item)
        {
            Code = item["label"];
            Name = item["label"];
        }

        public Formats()
        {

        }

        public string Code { get; set; }
        public string Name { get; set; }
    }

    public class FormatsViewModel
    {
        public FormatsViewModel(string code, string name, bool selected)
        {
            Selected = selected;
            Code = code;
            Name = name;
        }

        public bool Selected { get; set; }
        public string Code { get; set; }
        public string Name { get; set; }
    }
}