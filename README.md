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
* [Usage](#usage)
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

<!-- GETTING STARTED -->
## Getting Started

### Prerequisites

This is an example of how to list things you need to use the software and how to install them.
* yarn

### Installation

To avoid problems with permissions and `sudo`, we install the package locally and then add it's folder to `PATH` variable.

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
    cd packages/core;
    yarn link
    ```
    As this is done, the command `generilla` should be available

<!-- ROADMAP -->
## Roadmap

* soon this feature will be done
* and this
* and this too

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

Special thanks to:

* [Unsplash](https://unsplash.com)

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
