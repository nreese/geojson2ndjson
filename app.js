const fs = require("fs");

const OUTPUT_FILE = './ndjson.txt';

fs.readFile('./feature_collection.json', 'utf8', (err, data) => {
  if (err) {
    console.log(`Unable to read file, error: ${err.message}`);
    return;
  }

  let featureCollection;
  try {
    featureCollection = JSON.parse(data);
  } catch (parseErr) {
    console.log(`Unable to parse file contents into JSON, error: ${parseErr.message}`);
    return;
  }

  console.log(featureCollection.features.length);

  const writeStream = fs.createWriteStream(OUTPUT_FILE);

  featureCollection.features.forEach(feature => {
    const obj = {
      geometry: feature.geometry
    };
    Object.keys(feature.properties).forEach(property => {
      obj[property] = feature.properties[property]
    });

    writeStream.write(`${JSON.stringify(obj)}\n`, 'utf8');
  });

  // the finish event is emitted when all data has been flushed from the stream
  writeStream.on('finish', () => {
    console.log(`Wrote ${featureCollection.features.length} features to Newline Delimited json to ${OUTPUT_FILE}`);
  });

  writeStream.end();
});
