using System;

namespace Geonorge.MassivNedlasting
{
    public interface IReleaseInfoReader
    {
        Version GetLatestVersion();
    }
}
