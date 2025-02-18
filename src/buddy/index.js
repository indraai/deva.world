#!/usr/bin/env node
"use strict";

// Copyright (c)2025 Quinn Michaels
// Distributed under the MIT software license, see the accompanying
// file LICENSE.md or http://www.opensource.org/licenses/mit-license.php.
import chalk from 'chalk';
import pkg from '../../package.json' with {type: 'json'};
const {version} = pkg;

import data from '../../data/client.json' with {type: 'json'};
const client = data.DATA;

import buddy from './buddy.js';

console.log(chalk.greenBright(`
::::::::::::::::::::::::::::::::::

██████╗ ███████╗██╗   ██╗ █████╗
██╔══██╗██╔════╝██║   ██║██╔══██╗
██║  ██║█████╗  ╚██╗ ██╔╝███████║
██║  ██║██╔══╝   ╚████╔╝ ██╔══██║
██████╔╝███████╗  ╚██╔╝  ██║  ██║
╚═════╝ ╚══════╝   ╚═╝   ╚═╝  ╚═╝

::::::::::::::::::::::::::::::::::
${chalk.blueBright('version:')} ${chalk.yellowBright(version)}
::::::::::::::::::::::::::::::::::
`));

buddy.init(client);
