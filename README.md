# RPG
Api for a random phone number generator

## Requirements
- Node.js v8.x or higher
- npm or yarn

## Installation
```
$ git clone https://github.com/d3mola/RPG.git
$ cd random-phone-generator
$ yarn
$ yarn dev               # Start the development environment
$ yarn start                   # Run the production build
$ yarn test                    # Run tests
```

You can access the API via http://localhost:8080/api/

Usage

| HTTP VERB | Description | Endpoints |
| --- | --- | --- |
| `POST` | Creates a phone number | /api/numbers |
| `GET` | Retrieves a list of all phone numbers in asceding order | /api/numbers |
| `GET` | Retrieves a list of all phone numbers in descending order | /api/numbers?order=desc |
