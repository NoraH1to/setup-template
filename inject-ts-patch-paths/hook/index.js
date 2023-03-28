/**
 * @type {import("@norah1to/setup-cli").InjectHook}
 */
const hook = ({
  hookHelper: {
    helpers: { $, inquirer },
  },
}) => {
  let couldInject = true;
  let tsconfigFilename = 'tsconfig.json';
  return {
    async beforeGenerate() {
      $.verbose = true;
      const { name } = await inquirer.prompt([
        {
          name: 'name',
          default: 'tsconfig.json',
          type: 'input',
          validate(input) {
            return !!input ? true : 'Required';
          },
        },
      ]);
      tsconfigFilename = name;
    },
    afterGenerate({ targetDir }) {
      const tsConfig = targetDir.get(`/${tsconfigFilename}`, { type: 'file' });
      if (!tsConfig) return (couldInject = false);

      const config = tsConfig.getJson();
      const plugins = [
        { transform: 'typescript-transform-paths' },
        { transform: 'typescript-transform-paths', afterDeclarations: true },
      ];

      if (!config.compilerOptions) config.compilerOptions = {};
      if (!config.compilerOptions.plugins)
        config.compilerOptions.plugins = plugins;
      else if (Array.isArray(config.compilerOptions.plugins))
        config.compilerOptions.plugins.push(...plugins);
      else {
        plugins.push(config.compilerOptions.plugins);
        config.compilerOptions.plugins = plugins;
      }

      tsConfig.setContent(JSON.stringify(config));

      const pkgJson = targetDir.get('/package.json', { type: 'file' });
      const pkgConfig = pkgJson.getJson();
      const script = 'ts-patch install -s';
      pkgConfig.scripts = pkgConfig.scripts || {};
      pkgConfig.scripts.prepare
        ? (pkgConfig.scripts.prepare = `${pkgConfig.scripts.prepare} && ${script}`)
        : (pkgConfig.scripts.prepare = script);
    },
    afterOutput() {
      if (!couldInject) return;
      $.verbose = false;
      $`pnpm add ts-patch typescript-transform-paths -D`;
    },
  };
};

export default hook;
