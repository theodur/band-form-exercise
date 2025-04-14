# A form for touring bands!

## Overview

For this exercise, you'll create a simple form that allows users to purchase tickets to a concert for a given band.

You'll find included in this repo:

1. Three JSON files (located in `src/band-json/`) that represent the data structure that the form should be able to accommodate
2. A Wireframe ("BandTickets_Anonymous.png") that should help guide you as a loose representation of what the form should be structured like
3. A starter React project

We'd like you to build on the included React project that has been scaffolded using `create-react-app`. Feel free to add any javascript libraries that you typically use or think are a good fit for this project. For styling, you're welcome to write custom CSS, use a component library, or do some combination of both.

## Demo

A live demo of this exercise is hosted at https://theodur.github.io/band-form-exercise/. Stock images are pulled from [Lorem Picsum](https://picsum.photos/).

## Running locally

### Install dependencies
```bash
npm install
```

### Start development server
```bash
npm run start
```

### Run unit tests
```bash
npm run test
```

## Acceptance Criteria

The acceptance criteria for this exercise is that after consuming any of the JSON objects from the band-json directory, the form should include:

1. The band name, description, location, date, and image to learn about the concert
2. A list of ticket types that includes their metadata and the ability to add any number of tickets of each type
3. A total amount section that adds up the ticket prices
4. Some basic inputs for adding credit card and personal information
5. A button to purchase the tickets

## Some Things To Consider

When the "Get Tickets" button is clicked, you can add a `console.log()` or an `alert()` with the data that would be sent to a hypothetical backend server. This exercise is specifically geared towards candidates applying for a Front End focused role at ATS, which is why we are asking for folks not to add any data persistence or backend logic.

The tour date cost is listed as cents, so `500` would be `$5`.

The wireframe is a rough estimate of the layout of the form that we expect, but it's not necessary to match it exactly. The most important parts are the general page structure (two columns, with the description area on the left), and an approximate location of where the various page elements should be.
