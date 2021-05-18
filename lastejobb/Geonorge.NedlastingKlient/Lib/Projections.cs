using System.Linq;

namespace Geonorge.MassivNedlasting.Gui
{
    public class Projections
    {

        public Projections(dynamic item)
        {
            Epsg = "EPSG:" + item["epsgcode"];
            Name = item["label"];
        }

        public Projections()
        {
            
        }

        public string Epsg { get; set; }
        public string Name { get; set; }
    }

    public class ProjectionsViewModel
    {
        public ProjectionsViewModel(string epsg, string name, bool selected)
        {
            Selected = selected;
            Epsg = epsg;
            Name = name;
        }

        public bool Selected { get; set; }
        public string Epsg { get; set; }
        public string Name { get; set; }
    }
}