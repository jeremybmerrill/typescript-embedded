import { WeaviateClient, ConnectToLocalOptions } from 'weaviate-client';

interface EmbeddedOptionsConfig {
    host?: string;
    port?: number;
    env?: object;
    version?: string;
    binaryUrl?: string;
}
declare class EmbeddedOptions {
    binaryPath: string;
    persistenceDataPath: string;
    host: string;
    port: number;
    version?: string;
    binaryUrl?: string;
    env: NodeJS.ProcessEnv;
    constructor(cfg?: EmbeddedOptionsConfig);
    parseEnv(cfg?: EmbeddedOptionsConfig): NodeJS.ProcessEnv;
    parseVersion(cfg?: EmbeddedOptionsConfig): string | undefined;
    getBinaryPath(cfg?: EmbeddedOptionsConfig): string;
    getPersistenceDataPath(): string;
}
declare class EmbeddedDB {
    options: EmbeddedOptions;
    pid: number;
    constructor(opt: EmbeddedOptions);
    start(): Promise<void>;
    stop(): Promise<unknown>;
    private resolveWeaviateVersion;
    private ensureWeaviateBinaryExists;
    private ensurePathsExist;
    private downloadBinary;
    private buildBinaryUrl;
    private untarBinary;
    private unzipBinary;
    private waitTillListening;
    private isListening;
}

interface EmbeddedClient extends WeaviateClient {
    embedded: EmbeddedDB;
}
declare const app: {
    client: (embedded: EmbeddedOptions, opts?: ConnectToLocalOptions) => Promise<EmbeddedClient>;
};

export { EmbeddedClient, EmbeddedDB, EmbeddedOptions, EmbeddedOptionsConfig, app as default };
