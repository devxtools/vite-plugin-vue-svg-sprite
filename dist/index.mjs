import fs from 'fs';
import path from 'path';
import fg from 'fast-glob';

const svgs = fs.readFileSync(path.resolve(__dirname, "components/svgs.js"), "utf-8");
const icon = fs.readFileSync(path.resolve(__dirname, "components/icon.js"), "utf-8");
const moduleIds = {
  svgsSprite: "virtual:svgs-sprite",
  svgIcon: "virtual:svg-icon"
};
function replacePath(code) {
  return code.split("@/utils/sprite").join(path.resolve(__dirname, "utils/sprite").replace(/\\/g, "/"));
}
function getFiles(dir) {
  const svgDir = path.resolve(dir);
  const files = fg.sync("**/*.svg", { cwd: svgDir });
  const objs = [];
  files.forEach((f) => {
    const abs = path.join(svgDir, f).replace(/\\/g, "/");
    const name = f.replace(/.svg/g, "");
    objs.push(`'${name}': () => import('${abs}?raw')`);
  });
  return objs;
}
function index(options) {
  const svgsSprite_resolvedModuleId = "\0" + moduleIds.svgsSprite;
  const svgIcon_resolvedModuleId = "\0" + moduleIds.svgIcon;
  const default_dir = path.resolve(__dirname, "app", "assets", "svg");
  options = Object.assign({
    dir: default_dir,
    lazy: true,
    prefix: "sprite"
  }, options);
  let svgsImportModules = getFiles(options.dir);
  const modulesRegex = new RegExp(`\\/\\*@svg-modules@\\*\\/`, "g");
  const handleHotUpdate = (server, file, event) => {
    if (!file.endsWith(".svg")) return;
    if (process.env.NODE_ENV === "development") {
      console.log(`[virtual:svgs-sprite] ${event}: ${file}`);
    }
    svgsImportModules = getFiles(options.dir);
    const mod = server.moduleGraph.getModuleById(svgsSprite_resolvedModuleId);
    if (mod) {
      server.moduleGraph.invalidateModule(mod);
      server.ws.send({
        type: "update",
        updates: [{
          type: "js-update",
          path: "virtual:svgs-sprite",
          acceptedPath: "virtual:svgs-sprite",
          timestamp: Date.now()
        }]
      });
    }
  };
  return {
    name: "vite-plugin-vue-svg-sprite",
    // 仅在开发环境下启用 HMR
    configureServer(server) {
      if (process.env.NODE_ENV !== "development") return;
      const watcher = server.watcher;
      watcher.on("add", (file) => handleHotUpdate(server, file, "add"));
      watcher.on("unlink", (file) => handleHotUpdate(server, file, "unlink"));
      watcher.on("change", (file) => handleHotUpdate(server, file, "change"));
    },
    transform(code, id) {
      if (id.endsWith("sprite.ts")) {
        const regex = /\/\*! @__PURE__VAR__ \*\//g;
        const _var_code = `export const config = ${JSON.stringify({ prefix: options.prefix })}`;
        code = code.replace(regex, _var_code);
        return code.replace(modulesRegex, `${svgsImportModules.join(",")}`);
      }
    },
    resolveId(id) {
      if (id === moduleIds.svgsSprite) {
        return svgsSprite_resolvedModuleId;
      }
      if (id === moduleIds.svgIcon) {
        return svgIcon_resolvedModuleId;
      }
    },
    load(id) {
      if (id === svgsSprite_resolvedModuleId) {
        const svgsCode = replacePath(svgs);
        return `${svgsCode}`;
      }
      if (id === svgIcon_resolvedModuleId) {
        const IconCode = replacePath(icon);
        return `${IconCode}`;
      }
    }
  };
}

export { index as default };
