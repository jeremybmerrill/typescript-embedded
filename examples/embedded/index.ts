import weaviate, { EmbeddedOptions } from 'weaviate-ts-embedded';

const client = weaviate.client(
  new EmbeddedOptions({
    port: 9898,
  }),
  {
    scheme: 'http',
    host: 'localhost:9898',
  }
);

console.log('Weaviate binary:', client.embedded?.options.binaryPath);
console.log('Data path:', client.embedded?.options.persistenceDataPath);

await client.embedded.start();

console.info('\nEmbedded DB started\n');

// Create object with autoschema
const result = await client.data
  .creator()
  .withClassName('Wine')
  .withProperties({
    name: 'Pinot noir',
    description: 'Smooth taste',
  })
  .do();
console.log(result);

// Dump all objects
const objects = await client.data.getter().do();
console.log(objects);

// Dump metadata
const metadata = await client.misc.metaGetter().do();
console.log(metadata);

console.info('\nStopping...');
client.embedded.stop();
console.info('Exiting...');
