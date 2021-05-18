using System;
using System.Collections.Generic;
using System.Reflection;
using System.Text;
using Serilog;

namespace Geonorge.MassivNedlasting
{
    public class MassivNedlastingVersion
    {
        private static readonly ILogger Log = Serilog.Log.ForContext(MethodBase.GetCurrentMethod().DeclaringType);

        private readonly IReleaseInfoReader _releaseInfoReader;

        public MassivNedlastingVersion(IReleaseInfoReader releaseInfoReader)
        {
            _releaseInfoReader = releaseInfoReader;
        }

        public static string Current => GetCurrent().ToString();

        public static Version GetCurrent()
        {
            return Assembly.GetExecutingAssembly().GetName().Version;
        }

        public Version GetLatest()
        {
            try
            {
                Version latestVersion = _releaseInfoReader.GetLatestVersion();

                ApplicationService.SetTimeLastCheckForUpdate(DateTime.Now);

                return latestVersion;
            }
            catch (Exception e)
            {
                Log.Error("Could not get latest version: " + e.Message);

                return null;
            }
        }

        public bool UpdateIsAvailable()
        {
            return GetCurrent().CompareTo(GetLatest()) < 0;
        }

        public DateTime? GetTimeLastCheckForUpdate()
        {
            return ApplicationService.GetTimeLastCheckForUpdate();
        }
    }
}
