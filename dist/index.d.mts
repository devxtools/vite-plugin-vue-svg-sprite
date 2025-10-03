import { PluginOption } from 'vite';

type OPTIONS = {
    dir?: string;
    prefix?: string;
};
declare function export_default(options: OPTIONS): PluginOption;

export { export_default as default };
