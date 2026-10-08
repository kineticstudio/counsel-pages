#!/usr/bin/env node
// Preview the pages: `npm run serve`, then open the address it prints.
// The pages use root paths (/src/, /brand/, /fonts/), so serve from the repo root.
import path from 'node:path';
import {fileURLToPath} from 'node:url';
import {serve} from './server.mjs';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const {url} = await serve([['/', ROOT]], Number(process.env.PORT || 4321));
console.log(`Counsel pages: ${url}/`);
