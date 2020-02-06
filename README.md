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

  <div align="center" style="font-size: 30px;"><font size="7">💻 + 🦍 = ⚡⚡⚡</font></span>

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
  * [Upgrade](#upgrade)
* [Usage](#usage)
  * [Creating a generator](#creating-a-generator)
  * [Using a generator](#using-a-generator)
* [Development](#development)
* [Roadmap](#roadmap)
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
* [Yarn](https://yarnpkg.com/lang/en/docs/install/#mac-stable)

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

5. Create a generator home folder, if there is none
    ~~~sh
    mkdir ~/.generilla
    ~~~
6. You should be able to run the `generilla` command now

### Upgrade

If you followed the way how the installation was done, then do upgrading as following:
```sh
yarn global upgrade @generilla/cli --prefix ~/.node
```
<!-- USAGE -->
## Usage

### Creating a generator

1. Create a sub-folder there, with the following structure
    ~~~
    generator-name/
    └-- template/
    └── index.js
    ~~~

    Inside the `template/` folder you will put the template of the code to be generated.
    The `index.js` file is the generator itself.

    Use [these generators as examples](https://github.com/gannochenko/generators).

### Using a generator

As soon as the generator is there, type `generilla` in the terminal. You should be able to see your generator in the list. After choosing a generator and answering some questions 🕵️ the code will be created in the current folder.

<img src="https://raw.githubusercontent.com/gannochenko/generilla/master/demo/demo_480.gif" alt="Logo" width="480" height="286">

Type `generilla -h` to find out about all available commands.

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
3. Build and link `core` package
    ```sh
    cd packages/core;
    yarn run build;
    yarn link;
    cd ../cli;
    yarn link @generilla/core;
    ```
4. Build and link `cli` package to the global scope (being in the `packages/cli` folder)
    ```sh
    yarn run build;
    yarn link
    ```
    As this is done, the command `generilla` should be available globally
5. Re-build `core` or `cli` packages by typing
    ```sh
    yarn run build;
    ```
    in the corresponding `package/*` folder.
6. Instead of linking `cli` package to the global scope and re-building it manually, you may want to build it every time something gets changed in the code and run it locally after that.
    Then, instead of steps `4` and `5` do:
    ```sh
    cd packages/core;
    yarn run build:watch;
    ```
    In the other terminal then:
    ```sh
    cd packages/cli;
    yarn run build:watch;
    ```
    In one more terminal:
    ```sh
    cd packages/cli;
    yarn start;
    ```
    Use your development version as usual, the generated data will appear in the `_output` folder.

<!-- ROADMAP -->
## Roadmap

* Getting generators directly from GitHub

See the [open issues](https://github.com/gannochenko/generilla/issues) for a list of proposed features (and known issues).

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
