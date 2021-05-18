using System;
using System.IO;
using System.Linq;
using System.Net.Http;
using System.Reflection;
using System.Text;
using System.Threading.Tasks;
using Geonorge.MassivNedlasting;
using Serilog;

namespace Geonorge.Nedlaster
{
    /// <summary>
    /// Download file with progress event
    /// 
    /// https://stackoverflow.com/a/43169927/725492
    /// </summary>
    public class FileDownloader
    {
        private static readonly ILogger Log = Serilog.Log.ForContext(MethodBase.GetCurrentMethod().DeclaringType);

        public delegate void ProgressChangedHandler(long? totalFileSize, long totalBytesDownloaded,
            double? progressPercentage);

        private static readonly HttpClient Client = new HttpClient(){Timeout = TimeSpan.FromMilliseconds(30000) };

        public event ProgressChangedHandler ProgressChanged;
        
        public async Task<string> StartDownload(DownloadRequest downloadRequest, AppSettings appSettings)
        {
            string fileName = null;
            SetClientRequestHeaders(downloadRequest, appSettings);

            using (var response = await Client.GetAsync(downloadRequest.DownloadUrl, HttpCompletionOption.ResponseHeadersRead))
            {
                if (response.StatusCode == System.Net.HttpStatusCode.Unauthorized)
                {
                    Log.Error("Download failed: You need to authorize access before downloading file");
                }
                else if (!response.IsSuccessStatusCode)
                {
                    var message = $"Download failed for url: {downloadRequest.DownloadUrl}, - response from server was: {response.StatusCode} - {response.ReasonPhrase}";
                    Log.Error(message);
                    Console.WriteLine(message);
                    throw new Exception(message);
                }
                else
                {
                    using (var contentStream = await response.Content.ReadAsStreamAsync())
                    {
                        string destinationFilePath = downloadRequest.GetDestinationFilePath(response);
                        fileName = downloadRequest.GetDestinationFileName(response);
                        var totalBytes = response.Content.Headers.ContentLength;
                        await ProcessContentStream(totalBytes, contentStream, destinationFilePath + Constants.TempFileSuffix);
                        File.Copy(destinationFilePath + Constants.TempFileSuffix, destinationFilePath, true);
                        File.Delete(destinationFilePath + Constants.TempFileSuffix);
                    }
                }
            }
            return fileName;
        }


        private static void SetClientRequestHeaders(DownloadRequest downloadRequest, AppSettings appSettings)
        {
            if (!Client.DefaultRequestHeaders.Any())
            {
            Client.DefaultRequestHeaders.UserAgent.ParseAdd($"GeonorgeNedlastingsklient/{Assembly.GetExecutingAssembly().GetName().Version.ToString()}");
            }

            if (downloadRequest.MustAuthenticate)
            {
                var byteArray = Encoding.ASCII.GetBytes(appSettings.Username + ":" + ProtectionService.GetUnprotectedPassword(appSettings.Password));
                Client.DefaultRequestHeaders.Authorization = new System.Net.Http.Headers.AuthenticationHeaderValue("Basic", Convert.ToBase64String(byteArray));
            }
        }

        private async Task ProcessContentStream(long? totalDownloadSize, Stream contentStream, string destinationFilePath)
        {
            var totalBytesRead = 0L;
            var readCount = 0L;
            var buffer = new byte[8192];
            var isMoreToRead = true;


            using (var fileStream = new FileStream(destinationFilePath, FileMode.Create, FileAccess.Write,
                FileShare.None, 8192, true))
            {
                do
                {
                    var bytesRead = await contentStream.ReadAsync(buffer, 0, buffer.Length);
                    if (bytesRead == 0)
                    {
                        isMoreToRead = false;
                        TriggerProgressChanged(totalDownloadSize, totalBytesRead);
                        continue;
                    }

                    await fileStream.WriteAsync(buffer, 0, bytesRead);

                    totalBytesRead += bytesRead;
                    readCount += 1;

                    if (readCount % 100 == 0)
                        TriggerProgressChanged(totalDownloadSize, totalBytesRead);
                } while (isMoreToRead);
            }
        }

        private void TriggerProgressChanged(long? totalDownloadSize, long totalBytesRead)
        {
            if (ProgressChanged == null || !totalDownloadSize.HasValue)
                return;

            double? progressPercentage = null;
            if (totalDownloadSize.HasValue)
                progressPercentage = Math.Round((double) totalBytesRead / totalDownloadSize.Value * 100, 2);

            ProgressChanged(totalDownloadSize, totalBytesRead, progressPercentage);
        }

    }
}