<div align="center">

[![Node.js CI](https://github.com/ConservationColorado/conservationcolorado.github.io/actions/workflows/node.js-ci.yml/badge.svg)](https://github.com/ConservationColorado/conservationcolorado.github.io/actions/workflows/node.js-ci.yml)
[![Build and deploy tech.conservationco.org](https://github.com/ConservationColorado/conservationcolorado.github.io/actions/workflows/hugo-build-and-deploy.yml/badge.svg)](https://github.com/ConservationColorado/conservationcolorado.github.io/actions/workflows/hugo-build-and-deploy.yml)

</div>

# Conservation Colorado's Technology Blog

<div align="center">

<img src="docs/light-theme-preview.png" alt="Image preview of tech.conservationco.org open on multiple devices">

</div>

Welcome! This repository contains code for Conservation Colorado's technology blog,
[tech.conservationco.org](https://tech.conservationco.org).

We use this inclusive, free, and trustworthy space to share ways you can better use technology in your work.
We also showcase ways we solve problems within the organization using software engineering and technology!

This site is built using HTML, SCSS, JavaScript, and Hugo (Doks starter theme).

## Running the site locally

To run the site on your computer, first, clone this repository:

```shell
git clone git@github.com:ConservationColorado/conservationcolorado.github.io
```

Then, you'll want to install dependencies using `npm`:

```shell
npm install
```

To start the server locally on `http://localhost:1313`, again use `npm`:

```shell
npm run start
```

## Deployment

The latest revision of the site is built and deployed automatically on push to `main`. It's available online at
[tech.conservationco.org](https://tech.conservationco.org).
