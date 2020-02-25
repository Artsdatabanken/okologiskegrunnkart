const { url } = require("..");

const input = {
  "AO-KS-FS-JM": {
    kode: "AO-KS-FS-JM",
    tittel: { nb: "Jan Mayen" },
    overordnet: [
      {
        kode: "AO-KS-FS",
        tittel: {
          nb: "Fiskerisone"
        }
      },
      {
        kode: "~",
        tittel: {
          nb: "Usynlig rot"
        }
      }
    ]
  },
  "AO-KS-FS": {
    kode: "AO-KS-FS",
    tittel: {
      nb: "Fiskerisone"
    },
    overordnet: [
      {
        kode: "~",
        tittel: {
          nb: "Usynlig rot"
        }
      }
    ]
  },
  "~": {
    kode: "AO-KS-FS",
    tittel: {
      nb: "Rot"
    },
    overordnet: []
  }
};

// Recursively sort objects
test("createUrl", () => {
  new url(input).assignUrls();
  expect(input).toMatchSnapshot();
});
