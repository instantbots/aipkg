const { Command } = require('cmnd');

const loadPackage = require('../helpers/load_package.js');
const localServer = require('../helpers/local_server.js');

class ServeCommand extends Command {

  constructor() {
    super('serve');
  }

  help () {
    return {
      description: 'Starts a development server using package.json["scripts"]["start"]',
      args: [],
      flags: {},
      vflags: {
        port: 'specify a port to run on'
      }
    };
  }

  async run (params) {

    const Funct = await loadPackage(params, true);

    localServer.run({ port: 8100 });

    return void 0;

  }

}

module.exports = ServeCommand;
