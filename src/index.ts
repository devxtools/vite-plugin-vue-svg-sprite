import { type ViteDevServer } from 'vite'
import fs from 'fs';
import path from 'path';
import fg from 'fast-glob'
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __es_dirname = path.dirname(__filename);

const sprite = fs.readFileSync(path.resolve(__es_dirname, 'utils/sprite.mjs'), 'utf-8');
const svgs = fs.readFileSync(path.resolve(__es_dirname, 'components/svgs.mjs'), 'utf-8');
const icon = fs.readFileSync(path.resolve(__es_dirname, 'components/icon.mjs'), 'utf-8');

type OPTIONS = {
  dir?: string;
  prefix?: string;
}

const moduleIds = {
  sprite: 'virtual:svgs-sprite',
  svgs: 'virtual:svgs',
  icon: 'virtual:svg-icon',
}

function replacePath(code: string) {
  return code.split('@/utils/sprite').join(path.resolve(__es_dirname, 'utils/sprite').replace(/\\/g, '/'));
}

function getFiles(dir: string) {
  const svgDir = path.resolve(dir);
  const files = fg.sync('**/*.svg', { cwd: svgDir })
  const objs: string[] = [];
  files.forEach(f => {
    const abs = path.join(svgDir, f).replace(/\\/g, '/');
    const name = f.replace(/.svg/g, '');
    objs.push(`'${name}': () => import('${abs}?raw')`)
  })
  return objs;
}

export default function (options: OPTIONS) {
  const sprite_resolvedModuleId = '\0' + moduleIds.sprite;
  const svgs_resolvedModuleId = '\0' + moduleIds.svgs;
  const icon_resolvedModuleId = '\0' + moduleIds.icon;

  const default_dir = path.resolve(__es_dirname, 'app', 'assets', 'svg');
  options = Object.assign({
    dir: default_dir,
    lazy: true,
    prefix: 'sprite'
  }, options);

  let svgsImportModules = getFiles(options.dir as string);
  const modulesRegex = new RegExp(`\\/\\*@svg-modules@\\*\\/`, 'g');

  // HMR 处理
  const handleHotUpdate = (server: ViteDevServer, file: string, event: string)=>  {
    if (!file.endsWith('.svg')) return
    if (process.env.NODE_ENV === 'development') {
      console.log(`[virtual:svgs-sprite] ${event}: ${file}`)
    }
    svgsImportModules = getFiles(options.dir!)
    const mod = server.moduleGraph.getModuleById(svgs_resolvedModuleId)
    if (mod) {
      server.moduleGraph.invalidateModule(mod)
      server.ws.send({
        type: 'update',
        updates: [{
          type: 'js-update',
          path: 'virtual:svgs-sprite',
          acceptedPath: 'virtual:svgs-sprite',
          timestamp: Date.now()
        }]
      })
    }
  }
 
  return {
    name: "vite-plugin-vue-svg-sprite",
    // 仅在开发环境下启用 HMR
    configureServer(server) {
      if (process.env.NODE_ENV !== 'development') return

      const watcher = server.watcher // Vite 内置的 chokidar watcher
      watcher.on('add', file => handleHotUpdate(server, file, 'add'))
      watcher.on('unlink', file => handleHotUpdate(server, file, 'unlink'))
      watcher.on('change', file => handleHotUpdate(server, file, 'change'))
    },
    resolveId(id: string) {
      if (id === moduleIds.sprite) {
        return sprite_resolvedModuleId;
      }
      if (id === moduleIds.svgs) {
        return svgs_resolvedModuleId;
      }
      if (id === moduleIds.icon) {
        return icon_resolvedModuleId;
      }
    },
    load(id: string) {
      if (id === sprite_resolvedModuleId) {
        const regex = /\/\*! __PURE__VAR__ \*\//g;
        const _var_code = `${JSON.stringify({ prefix: options.prefix })}||`;
        const code = sprite.replace(regex, _var_code);
        return code.replace(modulesRegex, `${svgsImportModules.join(',')}`);
        // return `${sprite}`;
      }
      if (id === svgs_resolvedModuleId) {
        const svgsCode = replacePath(svgs);
        return `${svgsCode}`;
      }
      if (id === icon_resolvedModuleId) {
        const IconCode = replacePath(icon);
        return `${IconCode}`;
      }
    },
  }
}
