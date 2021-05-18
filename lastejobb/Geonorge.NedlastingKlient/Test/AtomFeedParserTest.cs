using System;
using System.Collections.Generic;
using System.IO;
using System.Runtime.CompilerServices;
using FluentAssertions;
using Geonorge.MassivNedlasting;
using Xunit;

namespace Geonorge.MassivNedlasting.Test
{
    public class AtomFeedParserTest
    {

        [Fact]
        public void ShouldParseAtomFeed()
        {
            List<Dataset> result = new AtomFeedParser().ParseDatasets(File.ReadAllText("Tjenestefeed.xml"));
            result.Count.Should().Be(3);
        }

        [Fact]
        public void ShouldParseDatasetFileAtomFeed()
        {
            var dataset = Helper.NewDataset();
            List<DatasetFile> result = new AtomFeedParser().ParseDatasetFiles(File.ReadAllText("AdministrativeEnheterFylker_AtomFeedGEOJSON.fmw.xml"), dataset.Title, dataset.Url);
            result.Count.Should().Be(10);
        }
    }
}
