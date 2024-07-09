# Welcome to the front-end template!

Here you'll find the base of <strong>monday.com front-end apps</strong> that we'll create at Worktables.

## Getting started

First you'll need to clone this repository to your machine (if don't have it already). To do so, run this command:<br>

```
git clone https://github.com/worktables/front-end-template
```

After cloning the project, open it in your IDE and then install all the dependencies running:<br>

```
yarn install
```

Some packages may be outdated, so you can update them by with the following command:<br>

```
yarn upgrade
```

Delete the existing git configuration file running this command:<br>

```
sudo rm -rf .git
```

To run the project use the command below:<br>

```
yarn dev
```

## Project structure

### `lib` folder

The `lib` folder contains all the third-party packages configurations (e.g. monday, zustand, etc.).

### `store` folder

The `store` folder is where all the [Zustand stores](https://docs.pmnd.rs/zustand/getting-started/introduction) are created and configured. By default, a <strong>context store</strong> is present in the project, you can find it by accessing `.src/store/context.ts`.

### `styles` folder

The `styles` folder should contain all the **styling** files. A file named `global.css` is present in the project by default. In this file you can define the global styles for the app.

### `tailwind.config.js` file

This template uses [TailwindCSS](https://tailwindcss.com/) as the styling library. All the pages and components should use the library.

This template extends some of the [monday's component library](https://style.monday.com/?path=/docs/welcome--docs) colors, but if you need to add more colors, you can do that by adding it in the `tailwind.config.js` file, present in the root directory of the project.

## How to build the project

To successfully build your front-end project, you'll need to follow the guide below.

### Step 1 - Modify Vite configuration file

In the `vite.config.ts` file there is a configuration object called <strong>`define`</strong>, this object needs o be commented before running the build script.

Your Vite configuration file should look like this:

```javascript
// vite.config.ts

import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
  },
  // define: {
  //   global: {},
  // },
});
```

### Step 2 - Run build script

The next step to generate the build is to <strong>run the build command</strong>, you can do so by running the `yarn build` command in your terminal.

### Step 3 - Zip the `dist` folder

Once the build has been completed, a folder named `dist` will show in your project's root directory. You'll need to compress this folder to be able to upload it to monday.com.

### Step 4 - Reset the Vite configuration file

After building and compressing, you need make sure to configure your `vite.config.ts` back to the default values, so you can run the app locally when you want to.
