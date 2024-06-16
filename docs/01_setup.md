# Setup project

## Install SST ion

The CLI currently supports macOS, Linux, and WSL.

```bash
curl -fsSL https://ion.sst.dev/install | bash
```

## SST init

```bash
> mkdir sst-ion-serverless-todoapp
> cd sst-ion-serverless-todoapp
> sst init

#   ███████╗███████╗████████╗
#   ██╔════╝██╔════╝╚══██╔══╝
#   ███████╗███████╗   ██║
#   ╚════██║╚════██║   ██║
#   ███████║███████║   ██║
#   ╚══════╝╚══════╝   ╚═╝

>  No frontend detected. This will...
#    - use the vanilla template
#    - create an sst.config.ts
#
# ✓  Template: vanilla
#
# ✓  Using: aws
#
# ✓  Done 🎉

```

## Package init

```bash
> pnpm init
# Wrote to /home/sick/workspace/sst-ion-serverless-todoapp/package.json
#
# {
#   "name": "sst-ion-serverless-todoapp",
#   "version": "1.0.0",
#   "description": "",
#   "main": "index.js",
#   "scripts": {
#     "test": "echo \"Error: no test specified\" && exit 1"
#   },
#   "keywords": [],
#   "author": "",
#   "license": "ISC"
# }

```

Edit package.json file

```json:package.json
{
  "name": "sst-ion-serverless-todoapp",
  "version": "0.0.0",
  "type": "module",
  "workspaces": ["packages/*"],
  "scripts": {
    "dev": "sst dev",
    "build": "sst build",
    "deploy": "sst deploy",
    "remove": "sst remove",
    "format": "./node_modules/.bin/prettier --write '**/*.{js,jsx,ts,tsx}'",
    "lint": "./node_modules/.bin/eslint . --ext ts,tsx --report-unused-disable-directives --max-warnings 0"
  },
  "engines": {
    "node": ">=16.8.0",
    "npm": "use pnpm",
    "pnpm": ">=7",
    "yarn": "use pnpm"
  }
}
```

## Install dependencies

```bash
pnpm add sst@ion
pnpm add -D \
  typescript \s
  @tsconfig/node20
```

<!--
```
pnpm add -D \
  eslint \
  @typescript-eslint/eslint-plugin \
  @typescript-eslint/parser \
  eslint-config-prettier \
  eslint-plugin-import
```
-->

### Prettier

```bash
pnpm add -D \
  prettier \
  @trivago/prettier-plugin-sort-imports \
```

add .prettier.cjs file

```js:.prettier.cjs
module.exports = {
  printWidth: 80,
  tabWidth: 2,
  trailingComma: "all",
  singleQuote: true,
  semi: true,
  importOrder: ["^[./]"],
  importOrderSeparation: true,
  importOrderSortSpecifiers: true,
  plugins: ["@trivago/prettier-plugin-sort-imports"],
};
```

add prettier ignore

```txt: .prettierignore
.sst
pnpm-lock.yaml
```

### ESLint

```bash
> npx eslint --init
# You can also run this command directly using 'npm init @eslint/config@latest'.
# ✔ How would you like to use ESLint? · problems
# ✔ What type of modules does your project use? · esm
# ✔ Which framework does your project use? · none
# ✔ Does your project use TypeScript? · typescript
# ✔ Where does your code run? · browser, node
# The config that you've selected requires the following dependencies:
#
# eslint@9.x, globals, @eslint/js, typescript-eslint
# ✔ Would you like to install them now? · No / Yes
# ✔ Which package manager do you want to use? · pnpm
# ☕️Installing...
#  WARN  using --force I sure hope you know what you are doing
# Packages: +246
# +++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++++
# Progress: resolved 246, reused 246, downloaded 0, added 246, done
#
# devDependencies:
# + @eslint/js 9.4.0
# + eslint 9.4.0
# + globals 15.3.0
# + typescript-eslint 7.12.0
# WARN  Issues with peer dependencies found
#.
#├─┬ @typescript-eslint/parser 7.12.0
#│ └── ✕ unmet peer eslint@^8.56.0: found 9.4.0
#└─┬ typescript-eslint 7.12.0
#  ├── ✕ unmet peer eslint@^8.56.0: found 9.4.0
#  ├─┬ @typescript-eslint/utils 7.12.0
#  │ └── ✕ unmet peer eslint@^8.56.0: found 9.4.0
#  └─┬ @typescript-eslint/eslint-plugin 7.12.0
#    ├── ✕ unmet peer eslint@^8.56.0: found 9.4.0
#    └─┬ @typescript-eslint/type-utils 7.12.0
#      └── ✕ unmet peer eslint@^8.56.0: found 9.4.0
> pnpm add -D eslint@8.56.0 # downgrade eslint
> pnpm add -D eslint-config-prettier
```

```js:eslint.config.js
import globals from "globals";
import pluginJs from "@eslint/js";
import tseslint from "typescript-eslint";
import eslintConfigPrettier from "eslint-config-prettier";

export default [
  {
    ignores: [
      "**/node_modules/**",
      "**/dist/**",
      ".sst/**",
      ".prettier.js",
      "packages/frontend/**",
    ],
  },
  { languageOptions: { globals: { ...globals.browser, ...globals.node } } },
  pluginJs.configs.recommended,
  ...tseslint.configs.recommended,
  eslintConfigPrettier,
];

```

Edit vscode settings file

```json:.vscode/settings.json
{
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.formatOnSave": true,
  "editor.formatOnPaste": false,
  "editor.linkedEditing": true,
  "eslint.experimental.useFlatConfig": true
}
```

sst.config.ts

```ts:sst.config.ts
// eslint-disable-next-line @typescript-eslint/triple-slash-reference
/// <reference path="./.sst/platform/config.d.ts" />
...
```

## Create vite react project

```bash
mkdir packages
cd packages
pnpm create vite frontend --template react-ts
```

Edit package name

```diff:package.json
{
-  "name": "frontend"
+  "name": "@sst-ion-serverless-todoapp/frontend"
...
}
```

## Pnpm workspace

```yaml:pnpm-workspace.yaml
packages:
  - 'packages/*'
```

on project root

```bash
> pnpm i
```

## deploy site

```typescript:infra/frontend.ts
export const web = new sst.aws.StaticSite("StaticSite", {
  path: "packages/frontend",
  build: {
    output: "dist",
    command: "npm run build",
  },
  environment: {},
});
```

```typescript:infra/index.ts
export * from "./frontend";
```

```typescript:sst.config.ts
// eslint-disable-next-line @typescript-eslint/triple-slash-reference
/// <reference path="./.sst/platform/config.d.ts" />

export default $config({
  app(input) {
    return {
      name: "sst-ion-serverless-todoapp",
      removal: input?.stage === "production" ? "retain" : "remove",
      home: "aws",
    };
  },
  async run() {
    const infra = await import("./infra");
    return {
      url: infra.web.url,
    };
  },
});

```

```bash
npm run deploy
```

## setup backend

```bash
cd packages
mkdir backend
```

```json:package.json
{
  "name": "@sst-ion-serverles-todoapp/backend",
  "version": "0.0.0"
}
```

```bash
cd backend
mkdir src
cd src
mkdir core
```

```typescript:packages/backend/src/core/handler.ts


```
