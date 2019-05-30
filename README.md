# Banka

A light-weight core banking application.

[![Build Status](https://travis-ci.org/OvieMudi/Banka.svg?branch=develop)](https://travis-ci.com/OvieMudi/Banka?branch=develop) [![Coverage Status](https://coveralls.io/repos/github/OvieMudi/Banka/badge.svg?branch=develop&service=github)](https://coveralls.io/github/OvieMudi/Banka?branch=develop) [![Code Climate](https://codeclimate.com/github/OvieMudi/Banka/badges/gpa.svg)](https://codeclimate.com/github/OvieMudi/Banka)
[![Reviewed by Hound](https://img.shields.io/badge/Reviewed_by-Hound-8E64B0.svg)](https://houndci.com)

## Introduction

Banka is a light-weight core banking application that powers banking operations like

- account creation
- customer deposit and withdrawals

This app is meant to support a single bank, where users can signup and create bank accounts online, but must visit the branch to withdraw or deposit money.

## Getting Started

### Prerequisite

Install [NodeJs](https://nodejs.org/en/download/)

### Installation

To get this application running on your local computer, run the following commands.

```
# Clone this repository
$ git clone https://github.com/OvieMudi/Banka.git

# Navigate to application folder
$ cd Banka

# Install dependencies
$ npm install

# Create .env file in your root directory to store your environment variables
# .env file content must include DATABASE_URL and SECRET_STRING

# Run the app
$ npm start
```

### Tests

Banka uses the Mocha test framework and Chai assertion library NodeJs to run automated unit tests on all endpoints.

#### Runnig the tests

`npm run test`

## Deployment

Baka API endpoints are deployed on [Heroku](http://calm-dusk-51134.herokuapp.com/v1/api). View the docs [here](http://calm-dusk-51134.herokuapp.com/docs).

The UI page pages are deployed to GitHub Pages. [Check it out](https://oviemudi.github.io/Banka/UI/).

## Technology Stack

- ES6 Javascript (Airbnb style guide)
- Nodejs (Express framework)
- Compiled with [Babel](https://babeljs.io)
- HTML (UI templates)
- CSS

#### Testing tools

- Mocha (Test Framework)
- Chai (Assertion Library)
- Istanbul (code instrumenter)
- NYC (Istanbul's command line interface)
- Postman (Manual Testing of API endpoints)

## Authors

Ovie Udih

### Collaborators

[Shine](https://github.com/Mrshinezee)

### Stakeholders

- [Shine](https://github.com/Mrshinezee)
- [Runor](https://github.com/kampkelly)
