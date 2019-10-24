#!/usr/bin/env node

import path from 'path';
import { Generilla } from './lib/generilla';

const app = new Generilla(path.join(__dirname, '../generators'));
app.run();
