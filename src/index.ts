import { type PluginOption, type ViteDevServer } from 'vite'
import fs from 'fs';
import path from 'path';
import fg from 'fast-glob'

const svgs = fs.readFileSync(path.resolve(__dirname, 'components/svgs.js'), 'utf-8');
const icon = fs.readFileSync(path.resolve(__dirname, 'components/icon.js'), 'utf-8');

type OPTIONS = {
  dir?: string;
  prefix?: string;
}

const moduleIds = {
  svgsSprite: 'virtual:svgs-sprite',
  svgIcon: 'virtual:svg-icon',
}

function replacePath(code: string) {
  return code.split('@/utils/sprite').join(path.resolve(__dirname, 'utils/sprite').replace(/\\/g, '/'));
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

export default function (options: OPTIONS): PluginOption {
  const svgsSprite_resolvedModuleId = '\0' + moduleIds.svgsSprite;
  const svgIcon_resolvedModuleId = '\0' + moduleIds.svgIcon;

  const default_dir = path.resolve(__dirname, 'app', 'assets', 'svg');
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
    const mod = server.moduleGraph.getModuleById(svgsSprite_resolvedModuleId)
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
    transform(code, id) {
      if (id.endsWith('sprite.ts')) {
        const regex = /\/\*! @__PURE__VAR__ \*\//g;
        const _var_code = `export const config = ${JSON.stringify({ prefix: options.prefix })}`;
        code = code.replace(regex, _var_code);
        return code.replace(modulesRegex, `${svgsImportModules.join(',')}`);
      }
    },
    resolveId(id: string) {
      if (id === moduleIds.svgsSprite) {
        return svgsSprite_resolvedModuleId;
      }
      if (id === moduleIds.svgIcon) {
        return svgIcon_resolvedModuleId;
      }
    },
    load(id: string) {
      if (id === svgsSprite_resolvedModuleId) {
        const svgsCode = replacePath(svgs);
        return `${svgsCode}`;
      }
      if (id === svgIcon_resolvedModuleId) {
        const IconCode = replacePath(icon);
        return `${IconCode}`;
      }
    },
  }
}