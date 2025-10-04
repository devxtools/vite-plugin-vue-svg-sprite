type OPTIONS = {
    dir?: string;
    prefix?: string;
};
declare function export_default(options: OPTIONS): {
    name: string;
    configureServer(server: any): void;
    resolveId(id: string): string | undefined;
    load(id: string): string | undefined;
};

export { export_default as default };
