import { EmbeddedDB, EmbeddedOptions } from './embedded';
import weaviate, { ConnectToLocalOptions, WeaviateClient } from 'weaviate-client';

export interface EmbeddedClient extends WeaviateClient {
  embedded: EmbeddedDB;
}

const app = {
  client: async function (embedded: EmbeddedOptions, opts?: ConnectToLocalOptions): Promise<EmbeddedClient> {
    const client = await weaviate.connectToLocal(opts);
//   client: function (embedded: EmbeddedOptions, conn?: ConnectionParams): EmbeddedClient {
//     if (!conn) conn = { host: '127.0.0.1:6789', scheme: 'http' };
//     const client = weaviate.client(conn);
    const embeddedClient: EmbeddedClient = {
      ...client,
      embedded: new EmbeddedDB(embedded),
    };
    return embeddedClient;
  },
};

export default app;
export * from './embedded';
