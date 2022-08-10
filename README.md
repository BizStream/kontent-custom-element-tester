# kontent-custom-element-tester
Make testing Kontent.ai custom elements a little easier by doing the following:

1. Use a running service for hosting the Custom Element
  - Specify an address or port to use one already running (ex. for React apps, etc.)
  - OR Specify some options to automatically start an Express server to serve static files (ex. for a simple HTML file with a Custom Element)
2. Use the address of the Custom Element to automatically create an `ngrok` tunnel
3. Use said `ngrok` tunnel and Kontent.ai keys to create/update a test model with Custom Element property

If there is no model with the specified Kontent.ai codename, one will be created with a Custom Element and the address pointed to our `ngrok` tunnel. If there is a model already, anytime this utility is run the tunnel address will be updated accordingly with any updated `ngrok` tunnel address.

NOTE: Even though this utility does create the Content *Model*, you will need to create the Content *Item*.

# Setup
Run `npm install`

# Configuration
The configuration file allows a few different options for configuring a server and ngrok tunnel. The file should be a Javascript file that `exports` the configuration object.

### `addr` (OPTIONAL)
If `addr` property is present in the config object it will be used as an argument to ngrok

If it is a string then the value will be used without modification.

If it is a function, then the function will be called with the `port` configuration property and the result of the function will be used.

The default value is `''`.

### `port` (OPTIONAL)
The port number to use when creating an ngrok tunnel and/or starting an express server.

The default value is `8000`.

### `express` (OPTIONAL)
If the `express` property is present AND also contains a `staticFilesPath` sub-property, then an express server will be created, pointing to the specified static path to host. This can be used to setup and host a simple HTML file and custom element quickly.

The default value is `null`.

### `kontent` (REQUIRED)
The `kontent` property is required and needs to also contain the `projectId` for your project, the `apiKey` for the Management API, and an `elementCodename` for the test model that will be created for testing your custom element.

# Running
Run with `node ./index.js`

## Using another config file/object
To use a separate config file, pass `--config="<my config file path>"` as an argument to the script.

ex. `node ./index.js -- --config="~/myConfig.js"`

