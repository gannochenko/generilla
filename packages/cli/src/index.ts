#!/usr/bin/env node

import path from 'path';
import { Generilla } from './lib/generilla';
import { HOME_SUBFOLDER } from './lib/constants';

const env = process.env;

const app = new Generilla(
    env.GENERILLA_GENERATORS_HOME || path.join(env.HOME!, HOME_SUBFOLDER),
);
app.run().catch(error => {
    console.error(error.stack);
});
