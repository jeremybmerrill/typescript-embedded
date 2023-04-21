import { homedir } from 'os';
import { join } from 'path';
import { EmbeddedDB, EmbeddedOptions } from './embedded';

describe('embedded', () => {
  jest.setTimeout(60 * 1000);

  it('creates EmbeddedOptions with defaults', () => {
    const opt = new EmbeddedOptions();

    expect(opt.binaryPath).toEqual(join(homedir(), '.cache/weaviate-embedded-1.18.1'));
    expect(opt.persistenceDataPath).toEqual(join(homedir(), '.local/share/weaviate'));
    expect(opt.host).toEqual('127.0.0.1');
    expect(opt.port).toEqual(6666);
    expect(opt.env).toHaveProperty('CLUSTER_HOSTNAME', 'Embedded_at_6666');
  });

  it('creates EmbeddedOptions with custom options', () => {
    const opt = new EmbeddedOptions({
      host: 'somehost.com',
      port: 7777,
      version: '1.18.1-alpha.0',
      env: {
        DEFAULT_VECTORIZER_MODULE: 'text2vec-contextionary',
        ENABLE_MODULES: 'text2vec-contextionary',
        CONTEXTIONARY_URL: 'contextionary:9999',
        QUERY_DEFAULTS_LIMIT: 100,
      },
    });

    // eslint-disable-next-line prettier/prettier
    expect(opt.env).toHaveProperty('DEFAULT_VECTORIZER_MODULE', 'text2vec-contextionary');
    expect(opt.env).toHaveProperty('ENABLE_MODULES', 'text2vec-contextionary');
    expect(opt.env).toHaveProperty('CONTEXTIONARY_URL', 'contextionary:9999');
    expect(opt.env).toHaveProperty('QUERY_DEFAULTS_LIMIT', 100);
    expect(opt.env).toHaveProperty('CLUSTER_HOSTNAME', 'Embedded_at_7777');
    expect(opt.host).toEqual('somehost.com');
    expect(opt.port).toEqual(7777);
  });

  it('overrides default env vars with inherited exported ones', () => {
    process.env.CLUSTER_HOSTNAME = 'custom-hostname';
    const opt = new EmbeddedOptions();
    expect(opt.env).toHaveProperty('CLUSTER_HOSTNAME', 'custom-hostname');
  });

  it('failed to create EmbeddedOptions with invalid version', () => {
    return expect(() => {
      const opt = new EmbeddedOptions({
        version: '123',
      });
    }).toThrow("invalid version: 123. version must resemble '{major}.{minor}.{patch}, or 'latest'");
  });

  if (process.platform == 'linux') {
    it('starts/stops EmbeddedDB with default options', async () => {
      const db = new EmbeddedDB(new EmbeddedOptions());
      await db.start();
      db.stop();
    });

    it('starts/stops EmbeddedDB with custom options', async () => {
      const db = new EmbeddedDB(
        new EmbeddedOptions({
          port: 7878,
          version: '1.18.1',
          env: {
            QUERY_DEFAULTS_LIMIT: 50,
            DEFAULT_VECTORIZER_MODULE: 'text2vec-openai',
          },
        })
      );
      await db.start();
      db.stop();
    });

    it('starts/stops EmbeddedDB with latest version', async () => {
      const db = new EmbeddedDB(
        new EmbeddedOptions({
          version: 'latest',
        })
      );
      await db.start();
      db.stop();
    });

    it('starts/stops EmbeddedDB with binaryUrl', async () => {
      let binaryUrl = '';
      const url = 'https://api.github.com/repos/weaviate/weaviate/releases/latest';
      await fetch(url, {
        method: 'GET',
        headers: { 'content-type': 'application/json' },
      })
        .then((res: Response) => {
          if (res.status != 200) {
            fail(new Error(`unexpected status code: ${res.status}`));
          }
          return res.json();
        })
        .then((body: any) => {
          binaryUrl = body.assets[0].browser_download_url as string;
        })
        .catch((e: any) => fail(new Error(`unexpected failure: ${JSON.stringify(e)}`)));

      const db = new EmbeddedDB(new EmbeddedOptions({ binaryUrl: binaryUrl }));
      await db.start();
      db.stop();
    });
  } else {
    console.warn(`Skipping because EmbeddedDB does not support ${process.platform}`);
  }
});
