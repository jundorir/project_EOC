const config = {
  development: {
    curChainId: "0x1b354",
    apiBaseURL: "http://dev-empire.mmr.finance:81/index.php/api", //测试环境
  },

  production: {
    curChainId: "0x38",
    apiBaseURL: "https://api.eocryptoken.com/index.php/api",
  },
};

// const env = process.env.NODE_ENV; // development  production
// const env = "production"; // development  production
const env = "development"; // development  production
const { curChainId, apiBaseURL } = config[env];
const exportConfig = {
  env,
  curChainId,
  apiBaseURL,
};

export default exportConfig;

export { env, curChainId, apiBaseURL };
