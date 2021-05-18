using System;
using System.Collections.Generic;
using System.Net;
using System.Reflection;
using System.Text;
using System.Text.RegularExpressions;
using Serilog;
using RestSharp;

namespace Geonorge.MassivNedlasting
{
    public class GitHubReleaseInfoReader : IReleaseInfoReader
    {
        private static readonly ILogger Log = Serilog.Log.ForContext(MethodBase.GetCurrentMethod().DeclaringType);
        private readonly RestClient _restClient;
        private readonly GitHubReleaseInfo _latestReleaseInfo;

        public GitHubReleaseInfoReader()
        {
            ServicePointManager.SecurityProtocol = SecurityProtocolType.Tls12;

            _restClient = new RestClient("https://api.github.com/");

            _latestReleaseInfo = ReadGitHubLatestReleaseInfo();
        }

        private GitHubReleaseInfo ReadGitHubLatestReleaseInfo()
        {
            var request = new RestRequest("repos/kartverket/Geonorge.NedlastingKlient/releases/latest");
            //var request = new RestRequest("kartverket/Geonorge.NedlastingKlient/releases/latest");

            request.AddCookie("logged_in", "no");

            IRestResponse<GitHubReleaseInfo> gitHubResponse = _restClient.Execute<GitHubReleaseInfo>(request);

            if (gitHubResponse.Data == null)
                Log.Error("Unable to retrieve necessary data from GitHub. Please check your internet connection.");

            return gitHubResponse.Data;
        }

        public Version GetLatestVersion()
        {
            if (_latestReleaseInfo?.TagName == null)
                throw new Exception("Missing or unexpected data from GitHub");

            if (!Regex.IsMatch(_latestReleaseInfo.TagName, @"^v\d+.\d+.\d+$") && !Regex.IsMatch(_latestReleaseInfo.TagName, @"^v\d+.\d"))
                throw new Exception("Unexpected tag-name format");

            string versionNumber = _latestReleaseInfo.TagName.TrimStart('v') + ".0";

            return new Version(versionNumber);
        }

        private class GitHubReleaseInfo
        {
            public string TagName { get; set; }
        }
    }
}
