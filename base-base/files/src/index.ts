import type { BaseHook } from '@norah1to/setup-cli';

const hook: BaseHook = (helper) => {
  /**
   * Do init here
   */
  return {
    /**
     * Hooks here
     *
     * afterMerge: async () => {
     *   console.log('After merge');
     * },
     */
  };
};

hook.meta = {
  __dir_src__: './src',
  __pathname_entry__: './src/index.ts',
};

export default hook;
