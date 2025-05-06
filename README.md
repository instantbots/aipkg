# Instant.bot Package Manager
## Extend AI agents with tools, instantly

`ibp` is the official CLI for publishing [Instant.bot](https://instant.bot) packages.
You can use this utility to publish new packages to the Instant.bot package registry,
available at [instant.bot/packages](https://instant.bot/packages).

[Instant.bot](https://instant.bot) enables you to rapidly build custom
chatbots and AI agents that can be extended with custom tools. It provides four
major features;

1. Chat with and develop your agent in real time from the web
2. Extend your agent with [hosted tool packages](https://instant.bot/packages)
3. Write your own private tool packages for your agents
4. Deploy your agent to third-party services like Discord and Slack

## What is the Instant.bot Package Registry?

The Instant.bot Package Registry is a **serverless hosting platform and registry** for
building tools that extend AI chatbots and agents.

**Instant.bot packages are just REST API servers.**
Every package is an [Instant API](https://github.com/instant-dev/api) project,
which is a simple way to export and auto-document JavaScript functions as REST endpoints
that can be called via any HTTP client.

Authentication to your published packagesare handled via **API keychains** which
are delegated via [Instant.bot](https://instant.bot).

**NOTE:** While in beta, only Instant.bot agents can use your published tools.
We'll be opening up the gateway to programmatic access in the coming months.

## Instant.bot Package vs. MCP

Reminder, **Instant.bot packages are just REST API servers.**

MCP, or Model Context Protocol, is a standard for passing tool and prompt context
between AI models and service providers. Instant.bot packages are **not**
MCP compatible out of the box, as they are simply REST APIs. However, it is our goal to add
MCP bindings to the [Instant API](https://github.com/instant-dev/api) framework which
powers all Instant.bot packages. When formalized, this will allow you to use
Instant.bot packages with any MCP-compatible client or service provider.
Contributors welcome!

## Quickstart

Visit [instant.bot/signup](https://instant.bot/signup) to register.
Creating a new bot is easy, you can then use this CLI to develop
and publish custom packages to extend your bots.

```shell
$ npm i ibp -g
$ mkdir new-project
$ cd new-project
$ ibp init  # initialize project in this directory
$ ibp login # log in to Instant.bot Package Registry with your Instant.bot account
$ ibp serve # run your tool package on a local server to test
$ ibp run / # test a single endpoint (like curl)
$ ibp up    # publish to development environment
$ ibp up --env staging    # publish to staging environment
$ ibp up --env production # publish to production environment
```

You can run `ibp help` at any time to see available commands.

# Table of contents

1. [How does Instant.bot work?](#how-does-instant-bot-work)
   1. [How is hosting billed?](#how-is-hosting-billed)
1. [Building custom packages for your bots](#building-custom-packages-for-your-bots)
   1. [Initialize a project](#initialize-a-project)
      1. [Defining tools aka endpoints](#defining-tools-aka-endpoints)
      1. [Endpoint name, description, types](#endpoint-name-description-types)
   1. [Deploy an Instant.bot Package](#deploy-an-instant-tool-package)
      1. [Public packages](#public-packages)
      1. [Private packages](#private-packages)
1. [Additional utilities](#additional-utilities)
   1. [Generate endpoints](#generate-endpoints)
   1. [Generate tests](#generate-tests)
   1. [Run tests](#run-tests)
   1. [Environment variables](#environment-variables)
1. [Roadmap](#roadmap)
1. [Contact](#contact)

# How does Instant.bot work?

Instant.bot provides hosting for both (1) your agent and (2) your tool packages.
Your agent is a chatbot that you can chat with directly via the Instant.bot web interface.
Tool packages are REST APIs that can be used by your agent. You can publish tool packages
for use by your agent and others or keep them private.

When you ask your agent a question that requires a tool call, Instant.bot will
automatically route the request to the appropriate tool from the Instant.bot Package Registry
and call the tool on your behalf.

## How is hosting billed?

Model usage (generating responses) is a subscription-based service. However,
for development purposes, you can use our lowest-tier model indefinitely in rate-limited mode
on the free tier **but only while on the web interface**.

Tools cost money to run, and are billed as serverless functions
at a rate of [$0.50 of credits per 1,000 GB-s](https://instant.bot/pricing) of usage.
Credits are prepaid, and during our beta period all users get a one-time bonus of $1.00
in free usage credits.

GB-s represents a "gigabyte-second" and is calculated by the function RAM × execution time.
For example, a function with 512 MB (0.5 GB) of RAM running for 200ms would use:

- Used GB-s = 0.5GB × 0.2s = 0.1 GB-s
- Used credits = $0.50 / 1,000 GB-s × 0.1 GB-s = $0.00005

# Building custom packages for your bots

Building bots on [Instant.bot](https://instant.bot) is straightforward. Extending
with custom tool packages can be done online via the web interface, or if you prefer
working with your own editor, you can use this CLI.

## Initialize a project

To initialize a new Instant.bot package:

```shell
$ npm i ibp -g
$ mkdir new-project
$ cd new-project
$ ibp init
```

You'll be walked through the process. The `ibp` CLI will automatically check for
updates to core packages, so make sure you update when available. To play around with your
Instant.bot package locally;

```shell
$ ibp serve
```

Will start an HTTP server. To execute a standalone endpoint / tool:

```shell
$ ibp run /
```

### Defining tools aka endpoints

Defining custom tools is easy. You'll find the terms **tool** and
**endpoint** used interchangeably as they all refer
to the same thing: your bot executing custom code in the cloud.

A **tool** is just an **endpoint** hosted by the Instant.bot Package Registry.

All endpoints for Instant.bot packages live in the `functions/` directory.
Each file name maps to the endpoint route e.g. `functions/hello.js`
routes to `localhost:8000/hello`. You can export custom `GET`, `POST`, `PUT`
and `DELETE` functions from every file. Here's an example "hello world" endpoint:

```javascript
// functions/hello.js

/**
 * A basic hello world function
 * @param {string} name Your name
 * @returns {string} message The return message
 */
export async function GET (name = 'world') {
  return `hello ${name}`!
};
```

You can write any code you want and install any NPM packages you'd like to
your tool package.

### Endpoint name, description, types

Using the comment block above every exported method (e.g. GET) you can
define your endpoint. Instant.bot packages use an open source specification called
[Instant API](https://github.com/instant-dev/api) to export JavaScript
functions as type safe web APIs. You can learn more about how to properly
define and document the shape (parameters) of your API there.

## Deploy an Instant.bot Package

### Public packages

**NOTE:** You **will not** be charged for other people using your public actions.
They are billed directly from their account.

By default all packages are created as public projects. Public
projects are namespaced to your username, e.g. `@my-username/project`.
This can be found in the `"name"` field of `instant.package.json`.

Note that the code for public projects will be shared publicly for anybody
to see, and the expectation is that others can use this code in their bots
as well.
they will be billed from their balance.

To deploy a public project to a `development` environment, you can use:

```shell
$ ibp up
```

You can also publish to `staging` and `production` using:

```shell
$ ibp up --env staging
$ ibp up --env production
```

### Private packages

**NOTE:** You **_WILL_** be charged by anybody accessing your private
packages. However, all code and endpoints will not be publicly available;
you must share the URL with somebody in order for them to use it.

You can publish private project by prepending `private/` on the
`"name"` field in `instant.package.json`, e.g.

```json
{
  "name": "private/@my-username/private-package"
}
```

You then deploy as normal. These packages will be visible by you in the
registry but nobody else.

# Additional utilities

There are a few additional utilities you may find useful with this package;

## Generate endpoints

```shell
# generates functions/my-endpoint/example.js
$ ibp g:endpoint my-endpoint/example
```

## Generate tests

```shell
# Generate blank tests or ones for an endpoint
$ ibp g:test my_test # OR ...
$ ibp g:test --endpoint my-endpoint/example
```

## Run tests

You can write tests for your tools to verify they work. Simply run;

```shell
$ ibp test
```

And voila!

## Environment variables

You can store environment variables with your packages in;

```
.env
.env.production
.env.staging
```

These files **will not** be published for everybody to see, so
you can use them to hide secrets within your code. However, be
careful when using environment variables with public packages:
if you ever return them in an endpoint response, or connect to
sensitive data, there's a chance you may expose that information
to another user of the platform.

# Roadmap

There's a lot to build! [Instant.bot](https://instant.bot) is still in early beta. Coming soon;

- Deploy to Slack
- Uploading image support
- Knowledge bases
- Much more!

Submit requests via Discord at [discord.gg/instant](https://discord.gg/instant)!

# Contact

The best place for help and support is Discord at [discord.gg/instant](https://discord.gg/instant),
but feel free to bookmark all of these links.

| Destination | Link |
| ----------- | ---- |
| Instant.bot | [instant.bot](https://instant.bot) |
| GitHub | [github.com/instantbots](https://github.com/instantbots) |
| Discord | [discord.gg/instant](https://discord.gg/instant) |
| X / instantbots | [x.com/instantbots](https://x.com/instantbots) |
| X / Keith Horwood | [x.com/keithwhor](https://x.com/keithwhor) |
