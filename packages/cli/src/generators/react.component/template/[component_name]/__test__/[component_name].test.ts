/**
 * https://github.com/sapegin/jest-cheat-sheet
 * https://testing-library.com/docs/react-testing-library/cheatsheet
 */

import React from 'react';
import { fireEvent, cleanup, render, prettyDOM } from '@testing-library/react';

import { <!- component_name -> } from '../<!- component_name ->';

describe('<<!- component_name -> />', () => {
    afterEach(async () => {
        cleanup();
    });

    it('should render itself without errors', async () => {
        render(
            <<!- component_name -> />,
        );
    });
});
