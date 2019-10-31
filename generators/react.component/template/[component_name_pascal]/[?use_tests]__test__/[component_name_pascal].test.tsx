/**
 * https://github.com/sapegin/jest-cheat-sheet
 * https://testing-library.com/docs/react-testing-library/cheatsheet
 */

import React from 'react';
import { fireEvent, cleanup, render, prettyDOM, waitForElement } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { <%- component_name_pascal %> } from '../<%- component_name_pascal %>';

describe('<<%- component_name_pascal %> />', () => {
    afterEach(async () => {
        cleanup();
    });

    it('should render itself without errors', async () => {
        const { container, getByTestId } = render(
            <<%- component_name_pascal %> />,
        );

        // // ///////////////////////
        // // a short cheat sheet
        //
        // // how to print out current DOM
        // console.log(prettyDOM(container));
        //
        // // how to search for elements
        // const node = container.querySelector(
        //     '.some-selector'
        // ) as HTMLElement;
        // const anotherNode = getByTestId('search-input') as HTMLElement;
        //
        // // how to fire events
        // fireEvent.click(button);
        // fireEvent.change(input, { target: { value: 'some value' } });
        //
        // // how to wait for async events to change the DOM:
        // const element = await waitForElement(
        //     () => getByTestId(container, 'element'),
        //     { container, timeout: 1000 }
        // );
        //
        // expect(element).toBeInstanceOf(HTMLElement);
        //
        // userEvent.type(input, 'Max Mustermann');
    });
});
