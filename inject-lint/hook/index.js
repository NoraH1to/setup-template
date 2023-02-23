const dpClone = (target) => {
  const res = {};
  for (const key of Object.keys(target)) {
    const t = target[key];
    if (Array.isArray(t)) res[key] = t.slice();
    else if (typeof t === 'object') res[key] = dpClone(t);
    else res[key] = t;
  }
  return res;
};

const dpMergePackageJson = (source, target) => {
  const res = dpClone(source);
  for (const key of Object.keys(target)) {
    const s = source[key];
    const t = target[key];
    if (
      !Array.isArray(s) &&
      !Array.isArray(t) &&
      typeof s === 'object' &&
      typeof t === 'object'
    ) {
      res[key] = dpMergePackageJson(s, t);
    } else {
      if (key === 'prepare' && s && t) res[key] = `${s} && ${t}`;
      else res[key] = t;
    }
  }
  return res;
};

/**
 * @type {import("@norah1to/setup-cli").InjectHook}
 */
const hook = ({ hookHelper }) => {
  const { inquirer, $, globby, normalizePath, path, fs } = hookHelper.helpers;
  const { __dir_target_root__ } = hookHelper.env;
  let needCustom;
  return {
    beforeMerge: async () => {
      needCustom = (
        await inquirer.prompt([
          {
            name: 'needCustom',
            message: 'Custom Eslint',
            type: 'confirm',
            default: false,
          },
        ])
      ).needCustom;
    },
    onMerging({ src, dest }) {
      if (src.filename === 'package.json')
        return JSON.stringify(
          dpMergePackageJson(dest.getJson(), src.getJson())
        );
      return src.getContent();
    },
    afterMerge: async () => {
      if (needCustom) {
        const cwd = process.cwd();
        try {
          await $.cd(__dir_target_root__);
          $.verbose = true;
          await $`pnpm create @eslint/config`;
          if (
            (
              await globby(
                normalizePath(path.join(__dir_target_root__, '.eslintrc*'))
              )
            ).length > 1
          )
            fs.rmSync(path.join(__dir_target_root__, '.eslintrc.cjs'));
        } finally {
          $.verbose = false;
          await $.cd(cwd);
        }
      }
    },
  };
};

export default hook;
