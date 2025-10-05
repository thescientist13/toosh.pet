import { greenwoodPluginPostCss } from "@greenwood/plugin-postcss";
import type { Config } from "@greenwood/cli";

// https://greenwoodjs.dev/docs/reference/configuration/
const config: Config = {
  prerender: true,
  plugins: [
    greenwoodPluginPostCss(),
  ]
};

export default config;
