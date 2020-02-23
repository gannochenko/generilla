<!-- PROJECT SHIELDS -->
<!--
*** Reference links are enclosed in brackets [ ] instead of parentheses ( ).
*** See the bottom of this document for the declaration of the reference variables
*** for contributors-url, forks-url, etc. This is an optional, concise syntax you may use.
*** https://www.markdownguide.org/basic-syntax/#reference-style-links
-->
[![Contributors][contributors-shield]][contributors-url]
[![Stargazers][stars-shield]][stars-url]
[![Issues][issues-shield]][issues-url]
[![MIT License][license-shield]][license-url]
[![Language][language-shield]][language-url]
[![LinkedIn][linkedin-shield]][linkedin-url]


<!-- PROJECT LOGO -->
<br />
<p align="center">
  <!--
  <a href="https://github.com/gannochenko/generilla">
    <img src="images/logo.png" alt="Logo" width="80" height="80">
  </a>
  -->

  <h3 align="center">💻 + 🦍 = 📃📃📃</h3>
  <h3 align="center">Generilla</h3>

  <p align="center">
    Simple code generator for JS/JS applications
    <!--
    <br />
    <a href="https://github.com/gannochenko/generilla"><strong>Explore the docs »</strong></a>
    -->
    <br />
    <br />
    <a href="https://github.com/gannochenko/generilla/issues">Report Bug</a>
    ·
    <a href="https://github.com/gannochenko/generilla/issues">Request Feature</a>
  </p>
</p>



<!-- TABLE OF CONTENTS -->
## Table of Contents

* [About the Project](#about-the-project)
* [Getting Started](#getting-started)
  * [Prerequisites](#prerequisites)
  * [Installation](#installation)
  * [Upgrading](#upgrading)
* [Manage generators](#manage-generators)
  * [Creating a local generator](#creating-a-local-generator)
  * [Linking a local generator](#linking-a-local-generator)
  * [Linking a remote generator](#linking-a-remote-generator)
  * [Upgrading a remote generator](#upgrading-a-remote-generator)
  * [Removing a generator](#removing-a-generator)
* [Using a generator](#using-a-generator)
* [Roadmap](#roadmap)
* [Development](#development)
* [Contributing](#contributing)
* [License](#license)
* [Built With](#built-with)
* [Contact](#contact)


<!-- ABOUT THE PROJECT -->
## About The Project

<!--
[![Preview Screen Shot][product-screenshot]](https://example.com)
-->

`Generilla` is a tool for running `generilla code generators`. See below how to make your own generator with `Generilla`.

<!-- GETTING STARTED -->
## Getting Started

### Prerequisites

* [Node](https://nodesource.com/blog/installing-node-js-tutorial-using-nvm-on-mac-os-x-and-ubuntu/)
* [Yarn](https://yarnpkg.com/lang/en/docs/install/#mac-stable) or NPM (comes with Node)
* [Git](https://git-scm.com/book/en/v2/Getting-Started-Installing-Git)

### Installation

To avoid problems with permissions and `sudo`, it is possible to install the package locally and then add it's folder to `PATH` variable.

1. Create `~/.node` folder
    ```sh
    mkdir ~/.node
    ```
2. Install the package
    ```sh
    yarn global add @generilla/cli --prefix ~/.node
    ```
3. Add `~/.node` folder to `PATH`
    ```sh
    export PATH=${PATH}:${HOME}/.node/bin
    ```
4. Add the command above to `~/.bashrc` (or `~/.bash_profile` in case of MacOS)

5. You should be able to run the `generilla` CLI command now

### Upgrading

If you followed the way how the installation was done, then do upgrading as following:
```sh
yarn global upgrade @generilla/cli --prefix ~/.node
```

## Manage generators

### Creating a local generator

Generilla allows to bootstrap a skeleton generator to boost up the progress. Type
~~~bash
generilla scaffold
~~~
to create a new generator in the current folder.

You will see the following file structure:

~~~
generator-name/
└-- template/  <-- file templates
└── index.js   <-- generator logic
~~~

#### Generator lifecycle

If you open `index.js` for editing, you will see a lifecycle of a generator.
The typical lifecycle of a generator is the following:

1. run `async onBeforeExecution()`
2. ask questions returned by `async getQuestions()`
3. refine answers by running `async refineAnswers()`
4. install dependencies, if `async getDependencies()` returned a non-empty list
5. install dev dependencies, if `async getDevDependencies()` returned a non-empty list
6. run `async onAfterExecution()`

All of these methods are optional, use them only when you need them.

#### Templating mechanism

Inside of each file in `template/` folder you may use [ejs template syntax](https://ejs.co/).

For example, let's say you have two questions: `use_react` and `generator_name`.
Then in any file you can write something like<br /> `Hello, this is <%- generator_name %> speaking!`.

Furthermore, you can inject these templates into the name of the files, by naming the files like this:<br />
`hello-[generator_name].js`. All symbols, except `[a-zA-Z0-9_-\.]` will be omitted.

You can also conditionally enable or disable rendering of files or sub-folders, by giving names like this:<br />
`[?use_react]react/` or `[?use_react][generator_name].saga.ts`.

#### Provided tools

Each function in the lifecycle has access to the following properties of the generator object:
* `this.answers` - list of answers provided by a user
* `this.originalAnswers` - list of answers before running `refineAnswers()`
* `this.context` - an object than contains the following data:
    * `generatorPath` - a folder where the generator is located
    * `destinationPath` - a folder where the output will be placed (by default it is a current folder)
* `this.util` - an object that contains references to some tools:
    * `inquirer` - a reference to [inquirer](https://www.npmjs.com/package/inquirer)
    * `execa` - a reference to [execa](https://www.npmjs.com/package/execa)
    * `ejs` - a reference to [ejs](https://www.npmjs.com/package/ejs)
    * `caseFormatter` - a reference to [caseFormatter](https://www.npmjs.com/package/case-formatter-js)
    * `makeTemplate()` - an internal tool for processing folders other than `template/`
        ~~~js
            const template = this.util.makeTemplate(absolutePathToOtherTemplateFolder);
            await template.copy(absoluteDestinationPath, answers);
        ~~~

#### Custom dependecies

Each generator may have `package.json` next to `index.js` file. In this case, after linking a generator `generilla` will automatically run

~~~bash
yarn
~~~

or

~~~bash
npm install
~~~

on it.

If you need more examples, check out [these generators](https://github.com/gannochenko/generators).

### Linking a local generator

A generator created with `generilla scaffold` appears in the generator list automatically.
If you have another generator made manually, you can add it by typing
~~~bash
generilla generator add <absolute-path-to-generator>
~~~

You can type afterwards 
~~~bash
generilla list
~~~
to see if the generator is really there.

### Linking a remote generator

If you have a generator that is hosted as a GitHUB repository, it is possible to link it by typing

~~~bash
generilla generator add https://github.com/joe/generator
~~~

If you have a mono-repository with several generators laying in sub-folders, the following also works:

~~~bash
generilla generator add https://github.com/joe/generators/tree/master/generator/foo/bar
~~~

Note that currently only `master` branch is supported.

You can also use this syntax:

~~~bash
generilla generator add https://github.com/joe/generators.git|/generator/foo/bar
~~~

or:

~~~bash
generilla generator add git@github.com:joe/generators.git|master|/awesome.generator/foo/bar
~~~

Whatever works for you better.

ℹ️ If there is a `package.json` file located next to the `index.js` file, then when the remote generator is linked, `Generilla` will try to install the dependencies automatically.

### Upgrading a remote generator

To pull new changes made on the remotely linked generator, type

~~~bash
generilla generator update <wildcard>
~~~

Where `<wildcard>` is a wildcard matched against the generator `name` or `id`.

For instance, to update all remote generators, type

~~~bash
generilla generator update \*
~~~

or

~~~bash
generilla generator update gen-*
~~~

### Removing a generator

To remove one or several generators of any type, use

~~~bash
generilla generator remove <wildcard>
~~~

Local generators will not be removed physically, they get un-symlinked.

## Using a generator

One way or another, as soon as the generator is in the list, type 
~~~bash
generilla
~~~

You should be able to see your generator in the list. After choosing a generator and answering some questions 🕵️ the output will be generated in the current folder.

<img src="https://raw.githubusercontent.com/gannochenko/generilla/master/demo/demo_480.gif" alt="Logo" width="480" height="286">

Type `generilla -h` to find out about all available commands.

<!-- ROADMAP -->
## Roadmap

* Bugfixing :)
* Better edge cases handling.
* Allow `generilla` to run a generator without linking it, like this: `generilla run /path/to/generator`.
* Enable making of `self-executable` generators, that are distributed as an `npm package` and export a CLI command that runs `generilla run <generator>`.

See the [open issues](https://github.com/gannochenko/generilla/issues) for a list of proposed features (and known issues).

<!-- DEVELOPMENT -->
### Development

1. Clone the repo
    ```sh
    git clone https://github.com/gannochenko/generilla.git
    ```
2. Install NPM packages
    ```sh
    cd generilla;
    yarn;
    yarn run boostrap;
    ```
3. Link the `core` package
    ```sh
    cd packages/core;
    yarn link;
    cd ../cli;
    yarn link @generilla/core;
    ```
4. Go back to `core` and start watching for changes
    ````bash
    cd ../core;
    yarn run build:watch;
    ````
5. In the other terminal go to `cli` and run `yarn start`
    ````bash
    cd ../cli;
    ````
    `yarn start` executes main cli binary.
    Use the development version as usual, for example `yarn start list` will be the same as `generilla list` and so on.
    The generated data will appear in the `_output` folder, and linked generators - in `_generators` folder.

<!-- CONTRIBUTING -->
## Contributing

Contributions are what make the open source community such an amazing place to be learn, inspire, and create. Any contributions you make are **greatly appreciated**.

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

<!-- LICENSE -->
## License

Distributed under the MIT License. See `LICENSE` for more information.

<!-- BUILTWITH -->
### Built With

* [TypeScript](http://www.typescriptlang.org/)
* [Inquirer](https://www.npmjs.com/package/inquirer)
* [Chalk](https://www.npmjs.com/package/chalk)
* [Execa](https://www.npmjs.com/package/execa)
* [Filget](https://www.npmjs.com/package/figlet)
* [Commander](https://www.npmjs.com/package/commander)
* [EJS](https://www.npmjs.com/package/ejs)

<!-- CONTACT -->
## Contact

Sergei Gannochenko - [Linkedin](https://www.linkedin.com/in/gannochenko/)

Project Link: [https://github.com/gannochenko/generilla](https://github.com/gannochenko/generilla)

<!-- MARKDOWN LINKS & IMAGES -->
<!-- https://www.markdownguide.org/basic-syntax/#reference-style-links -->
[contributors-shield]: https://img.shields.io/github/contributors/gannochenko/generilla.svg?style=flat-square
[contributors-url]: https://github.com/gannochenko/generilla/graphs/contributors
[language-shield]: https://img.shields.io/github/languages/top/gannochenko/generilla.svg?style=flat-square
[language-url]: https://github.com/gannochenko/generilla
[forks-shield]: https://img.shields.io/github/forks/gannochenko/generilla.svg?style=flat-square
[forks-url]: https://github.com/gannochenko/generilla/network/members
[stars-shield]: https://img.shields.io/github/stars/gannochenko/generilla.svg?style=flat-square
[stars-url]: https://github.com/gannochenko/generilla/stargazers
[issues-shield]: https://img.shields.io/github/issues/gannochenko/generilla.svg?style=flat-square
[issues-url]: https://github.com/gannochenko/generilla/issues
[license-shield]: https://img.shields.io/github/license/gannochenko/generilla.svg?style=flat-square
[license-url]: https://github.com/gannochenko/generilla/blob/master/LICENSE.txt
[linkedin-shield]: https://img.shields.io/badge/-LinkedIn-black.svg?style=flat-square&logo=linkedin&colorB=555
[linkedin-url]: https://www.linkedin.com/in/sergey-gannochenko/
[product-screenshot]: images/screenshot.png
