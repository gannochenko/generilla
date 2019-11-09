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
  <a href="https://github.com/awesome1888/generilla">
    <img src="images/logo.png" alt="Logo" width="80" height="80">
  </a>
  -->

  <h3 align="center">Generilla</h3>

  <p align="center">
    Simple code generator
    <!--
    <br />
    <a href="https://github.com/awesome1888/generilla"><strong>Explore the docs »</strong></a>
    -->
    <br />
    <br />
    <a href="https://github.com/awesome1888/generilla/issues">Report Bug</a>
    ·
    <a href="https://github.com/awesome1888/generilla/issues">Request Feature</a>
  </p>
</p>



<!-- TABLE OF CONTENTS -->
## Table of Contents

* [About the Project](#about-the-project)
  * [Built With](#built-with)
* [Getting Started](#getting-started)
  * [Prerequisites](#prerequisites)
  * [Installation](#installation)
  * [Development](#development)
* [Usage](#usage)
  * [Creating a generator](#creating-a-generator)
  * [Using a generator](#using-a-generator)
* [Roadmap](#roadmap)
* [Contributing](#contributing)
* [License](#license)
* [Contact](#contact)
* [Acknowledgements](#acknowledgements)



<!-- ABOUT THE PROJECT -->
## About The Project

<!--
[![Preview Screen Shot][product-screenshot]](https://example.com)
-->

`Generilla` is a tool for running `generilla code generators`. See below how to make your own generator with `Generilla`.

### Built With

* [TypeScript](http://www.typescriptlang.org/) - everything (well, almost everything) is type-safe
* [Inquirer](https://www.npmjs.com/package/inquirer)
* [Chalk](https://www.npmjs.com/package/chalk)
* [Execa](https://www.npmjs.com/package/execa)
* [Filget](https://www.npmjs.com/package/figlet)
* [Commander](https://www.npmjs.com/package/commander)
* [EJS](https://www.npmjs.com/package/ejs)

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

### Development

1. Clone the repo
    ```sh
    git clone https://github.com/awesome1888/generilla.git
    ```
2. Install NPM packages
    ```sh
    cd generilla;
    yarn run boostrap;
    ```
3. Link `core` package
    ```sh
    cd packages/core;
    yarn link;
    cd ../cli;
    yarn link @generilla/core;
    ```
4. Link `cli` package to the global scope
    ```sh
    cd packages/cli;
    yarn link
    ```
    As this is done, the command `generilla` should be available

<!-- USAGE -->
## Usage

### Creating a generator

1. Create a generator home folder, if there is none
    ~~~sh
    mkdir ~/.generilla
    ~~~
2. Create a sub-folder there, with the following structure
    ~~~
    generator-name/
    └-- template/
    └── index.js
    ~~~
    
    Inside the `template/` folder you will put the template of the code to be generated.
    The `index.js` file is the generator itself.

    Use [these generators as examples](https://github.com/awesome1888/generators).

### Using a generator

As soon as the generator is there, type `generilla` in the terminal. You should be able to see your generator in the list. After choosing a generator the code will be create in the current folder.

Type `generilla -h` to find out about all available commands.

<!-- ROADMAP -->
## Roadmap

* getting generators directly from GitHub

See the [open issues](https://github.com/awesome1888/generilla/issues) for a list of proposed features (and known issues).

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

<!-- CONTACT -->
## Contact

Sergei Gannochenko - [Linkedin](https://www.linkedin.com/in/gannochenko/)

Project Link: [https://github.com/awesome1888/generilla](https://github.com/awesome1888/generilla)

<!-- ACKNOWLEDGEMENTS -->
## Acknowledgements

<!-- MARKDOWN LINKS & IMAGES -->
<!-- https://www.markdownguide.org/basic-syntax/#reference-style-links -->
[contributors-shield]: https://img.shields.io/github/contributors/awesome1888/generilla.svg?style=flat-square
[contributors-url]: https://github.com/awesome1888/generilla/graphs/contributors
[language-shield]: https://img.shields.io/github/languages/top/awesome1888/generilla.svg?style=flat-square
[language-url]: https://github.com/awesome1888/generilla
[forks-shield]: https://img.shields.io/github/forks/awesome1888/generilla.svg?style=flat-square
[forks-url]: https://github.com/awesome1888/generilla/network/members
[stars-shield]: https://img.shields.io/github/stars/awesome1888/generilla.svg?style=flat-square
[stars-url]: https://github.com/awesome1888/generilla/stargazers
[issues-shield]: https://img.shields.io/github/issues/awesome1888/generilla.svg?style=flat-square
[issues-url]: https://github.com/awesome1888/generilla/issues
[license-shield]: https://img.shields.io/github/license/awesome1888/generilla.svg?style=flat-square
[license-url]: https://github.com/awesome1888/generilla/blob/master/LICENSE.txt
[linkedin-shield]: https://img.shields.io/badge/-LinkedIn-black.svg?style=flat-square&logo=linkedin&colorB=555
[linkedin-url]: https://www.linkedin.com/in/sergey-gannochenko/
[product-screenshot]: images/screenshot.png
