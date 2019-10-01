import React, { FunctionComponent } from 'react';

import {
    <%- component_name %>Container,
} from './style';
import {
    Props
} from './type.ts';

export const <%- component_name %>: FunctionComponent<Props> = ({
    children,
}) => {
    return (
        <<%- component_name %>Container>
            {children}
        </<%- component_name %>Container>
    );
};
