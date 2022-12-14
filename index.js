import readline from 'readline';
import fs from 'fs';

import express from 'express';
import ngrok from 'ngrok';
import { createManagementClient } from '@kentico/kontent-management';

function getHostAddress(config) {
  const port = config.port ?? 8000; // Port value or default to 8000
  const addr = config.addr ?? port;
  if (typeof addr === 'function') {
    return addr(port);
  }

  return addr;
}

async function startNgrok(config) {
  // start and wait for Ngrok
  const tunnel = getHostAddress(config);
  const ngrokArg = typeof tunnel === 'string' ? { addr: tunnel } : tunnel;
  console.log(`Starting ngrok with argument '${tunnel}'`)
  const url = await ngrok.connect(ngrokArg);

  return url;
}

function waitForInput() {

  function askQuestion(query) {
    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
    });

    return new Promise(resolve => rl.question(query, ans => {
      rl.close();
      resolve(ans);
    }))
  }


  return askQuestion("Press a key to exit");
}

async function createOrUpdateKontent(ngrokUrl, config) {
  // Get elementCodename or default from config
  const elementCodename = config.elementCodename || 'custom_element';
  
  // create and/or update custom element type with new properties
  console.log(`Creating or updating custom element test model '${config.kontent.modelCodename}'`);
  const client = createManagementClient({ projectId: config.kontent.projectId, apiKey: config.kontent.apiKey });
  const types = await client.listContentTypes().toPromise();
  if (!types.data.items.some((type) => type.codename === config.kontent.modelCodename)) {
    await client.addContentType()
      .withData((builder) => {
        return {
          name: 'Custom Element Tester',
          codename: config.kontent.modelCodename,
          elements: [
            builder.customElement({
              name: 'Custom Element',
              type: 'custom',
              source_url: ngrokUrl,
              json_parameters: "",
              codename: elementCodename,
            }),
          ],
        };
      })
      .toPromise();
  } else {
    await client.modifyContentType()
      .byTypeCodename(config.kontent.modelCodename)
      .withData([
        {
          op: 'replace',
          path: `/elements/codename:${elementCodename}/source_url`,
          value: ngrokUrl,
        },
      ])
      .toPromise();
  }

  console.log(`Kontent URL: https://app.kontent.ai/${config.kontent.projectId}/`);
}

function startExpressServer(config) {
    const expressPort = config.port ?? 8000;
    console.log(`Starting Express server on port ${expressPort} with static files folder '${config.express.staticFilesPath}'.`);
    const app = express();
    app.use(express.static(config.express.staticFilesPath));
    app.listen(config.port, () => {
      console.log(`Custom Open Search element page listening on port ${expressPort}`);
    });

    // TODO: Listen on app exit?
    // Disconnect Ngrok
    // await ngrok.disconnect();
}

function getConfigPath() {
  const configArg = process.argv.find(arg => arg.includes('--config='));
  const defaultConfigPath = './kcet.config.js';
  
  if (configArg) {
    return configArg
      .substring(configArg.indexOf('=') + 1)
      .trim(`"`)
      .trim(`'`) || defaultConfigPath;
  }

  return defaultConfigPath;
}

function validateConfigFile(filePath) {
  if (!fs.existsSync(path)) {
    console.log(`Config file ${filePath} does not exist.`)
    return false;
  }

  return true;
}

async function main(config) {
  // TODO: Validate conig...

  const ngrokUrl = await startNgrok(config);
  await createOrUpdateKontent(ngrokUrl, config);

  // TODO:
  //  - open browser and navigate to custom element instance

  if (config.express && config.express.staticFilesPath) {
    startExpressServer(config);
  } else {
    await waitForInput();

    // Disconnect Ngrok
    await ngrok.disconnect();
  }
}

const configPath = getConfigPath();

if (validateConfigFile(configPath)) {
  const { default: config } = await import(configPath);
  await main(config);
}
