using System.Collections.Generic;
using FluentAssertions;
using Geonorge.MassivNedlasting.Gui;
using Xunit;

namespace Geonorge.MassivNedlasting.Test
{
    public class DatasetServiceTest
    {

        [Fact]
        public void ShouldFetchDatasetFromGeonorge()
        {
            List<Dataset> datasets = new DatasetService().GetDatasets();
            datasets.Count.Should().BeGreaterThan(1);
        }

        [Fact]
        public void ShouldFetchDatasetFile()
        {
            var datasetFile = Helper.NewDatasetFile();
            DatasetFile file = new DatasetService().GetDatasetFile(datasetFile);
            file.Title.Should().Be("GML-format,  3001, Halden");
        }

        [Fact]
        public void ShouldFetchDatasetFiles()
        {
            var download = Helper.NewDownload();
            List<DatasetFile> files = new DatasetService().GetDatasetFiles(download);
            files.Count.Should().BeGreaterThan(1);
        }

        [Fact]
        public void GetDatasetFilesAsViewModel()
        {
            var dataset = Helper.NewDataset();

            List<DatasetFileViewModel> files = new DatasetService().GetDatasetFiles(dataset);
            files.Count.Should().BeGreaterThan(1);
        }

        [Fact]
        public void FetchProjections()
        {
            List<Projections> projections = new DatasetService().FetchProjections();
            projections.Count.Should().BeGreaterThan(1);
        }

        [Fact]
        public void FetchDownloadUsageGroups()
        {
            List<string> userGroups = new DatasetService().FetchDownloadUsageGroups();
            userGroups.Count.Should().BeGreaterThan(1);
        }

        [Fact]
        public void FetchDownloadUsagePurposes()
        {
            List<string> purposes = new DatasetService().FetchDownloadUsagePurposes();
            purposes.Count.Should().BeGreaterThan(1);
        }

        //[Fact]
        //public void ReadFromProjectionFile()
        //{
        //    List<Projections> projections = new DatasetService().ReadFromProjectionFile();
        //    projections.Count.Should().BeGreaterThan(1);
        //}

        //[Fact]
        //public void ReadFromDownloadUsageGroup()
        //{
        //    List<string> userGroups = new DatasetService().ReadFromDownloadUsageGroup();
        //    userGroups.Count.Should().BeGreaterThan(1);
        //}

        //[Fact]
        //public void ReadFromDownloadPurposes()
        //{
        //    List<string> purposes = new DatasetService().ReadFromDownloadUsagePurposes();
        //    purposes.Count.Should().BeGreaterThan(1);
        //}

        //[Fact]
        //public void GetSelectedDatasetFiles()
        //{
        //    List<DatasetFile> selectedDatasetFiles = new DatasetService().GetSelectedDatasetFiles();
        //    selectedDatasetFiles.Count.Should().BeGreaterThan(1);
        //}

        //[Fact]
        //public void GetSelectedFilesToDownload()
        //{
        //    List<Download> selectedFilesToDownload = new DatasetService().GetSelectedFilesToDownload();
        //    selectedFilesToDownload.Count.Should().BeGreaterThan(1);
        //}

        [Fact]
        public void RemoveDuplicatesIterative()
        {
            List<Download> downloadListWithDoplicates = new List<Download>();
            downloadListWithDoplicates.Add(new Download());
            downloadListWithDoplicates.Add(new Download());

            var result = new DatasetService().RemoveDuplicatesIterative(downloadListWithDoplicates);
            result.Count.Should().Be(1);
        }
    }
}
