# kontent-custom-element-tester
Make testing Kontent custom elements a little easier

# Setup
Run `npm install`

# Configuration
The configuration file allows a few different options for configuring a server and ngrok tunnel

## `addr` (OPTIONAL)
If `addr` property is present in the config object it will be used as an argument to ngrok

If it is a string then the value will be used without modification.

If it is a function, then the function will be called with the `port` configuration property and the result of the function will be used.

The default value is `''`.

## `port` (OPTIONAL)
The port number to use when creating an ngrok tunnel and/or starting an express server.

The default value is `8000`.

## `express` (OPTIONAL)
If the `express` property is present AND also contains a `staticFilesPath` sub-property, then an express server will be created, pointing to the specified static path to host. This can be used to setup and host a simple HTML file and custom element quickly.

The default value is `null`.

## `kontent` (REQUIRED)
The `kontent` property is required and needs to also contain the `projectId` for your project, the `apiKey` for the Management API, and an `elementCodename` for the test model that will be created for testing your custom element.

# Running
Run with `node ./index.js`

## Using another config file/object
To use a separate config file, pass `--config="<my config file path>"` as an argument to the script.

ex. `node ./index.js -- --config="~/myConfig.js"`

