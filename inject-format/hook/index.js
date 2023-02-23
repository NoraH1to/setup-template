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
      res[key] = t;
    }
  }
  return res;
};

/**
 * @type {import("@norah1to/setup-cli").InjectHook}
 */
const hook = () => {
  return {
    onMerging({ src, dest }) {
      if (src.filename === 'package.json')
        return JSON.stringify(
          dpMergePackageJson(dest.getJson(), src.getJson())
        );
      return src.getContent();
    },
  };
};

export default hook;
