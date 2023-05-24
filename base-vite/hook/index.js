/**
 * @type {import("@norah1to/setup-cli").BaseHook}
 */
const hook = ({ hookHelper }) => {
  const { $, path } = hookHelper.helpers;
  const { __dir_target_root__ } = hookHelper.env;
  return {
    beforeGenerate: async () => {
      const cwd = process.cwd();
      try {
        $.verbose = true;
        await $`pnpm create vite ${path.parse(__dir_target_root__).name}`;
      } finally {
        $.verbose = false;
        await $.cd(cwd);
      }
    },
  };
};

hook.meta = {
  __dir_src__: './src',
  __pathname_entry__: './src/main.ts',
};

export default hook;
