import { type ViteDevServer } from 'vite'
import fs from 'fs';
import path from 'path';
import fg from 'fast-glob'
import { fileURLToPath } from 'url';

const green = '\x1b[32m'

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

  const modulesRegex = new RegExp(`\\/\\*@svg-modules@\\*\\/`, 'g');

  return {
    name: "vite-plugin-vue-svg-sprite",
    configureServer(server: ViteDevServer) {
      if (process.env.NODE_ENV !== 'development') return
      const pagesDir = options.dir!
      server.watcher.add(pagesDir)
      server.watcher.on('all', (event: string, file: string) => {
        if (file.endsWith('.svg') && file.startsWith(pagesDir)) {
          const displayPath = path.relative(process.cwd(), file)
          console.log(`↻ ${green}${event} ${displayPath}`)
          // 让所有虚拟模块失效（强制重新编译）
          const spriteModule = server.moduleGraph.getModuleById(sprite_resolvedModuleId)
          const svgsModule = server.moduleGraph.getModuleById(svgs_resolvedModuleId)
          const iconModule = server.moduleGraph.getModuleById(icon_resolvedModuleId)
          const mods = [spriteModule, svgsModule, iconModule]
          mods.forEach(m => m && server.moduleGraph.invalidateModule(m))
          // 通知客户端刷新
          server.ws.send({ type: 'full-reload', path: '*' })
        }
      })
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
        const svgs_string = getFiles(options.dir as string);
        const regex = /\/\*! __PURE__VAR__ \*\//g;
        const _var_code = `${JSON.stringify({ prefix: options.prefix })}||`;
        const code = sprite.replace(regex, _var_code);
        return code.replace(modulesRegex, `${svgs_string.join(',')}`);
      }
      if (id === svgs_resolvedModuleId) {
        const svgsCode = replacePath(svgs);
        return `${svgsCode}`;
      }
      if (id === icon_resolvedModuleId) {
        const IconCode = replacePath(icon);
        return `${IconCode}`;
      }
    }
  }
}
