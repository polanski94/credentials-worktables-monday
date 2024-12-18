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

### Run build script

The build workflow was created to automate the build process, so you don't need to worry about the old Vite configuration file.

You just need to <strong>run the build command</strong>, by running the `yarn build` command in your terminal.

### The zip `dist` structure

> [!NOTE]  
> On windows the zip process requires the `7z` command to be installed on your machine. The script will automatically install it if it's not present. But you may need to add to your system environment variables.

The script will create a zip file with the `dist` folder, this zip file will be named `dist-current.zip`.

If you want to keep track of the previous builds, the script will rename the current zip file to `dist-old-<timestamp>.zip`.

### Upload to monday.com

After building step is completed, you'll need to upload the zip file to monday.com.

> [!NOTE]  
> Some files name may conflict with the monday.com's compilation process, so you may need to rename them. For example, the `worktables_logo_blue@0.5x.png` file should be renamed to `worktables_logo_blue05.png`.
