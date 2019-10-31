import React, { FunctionComponent } from 'react';

import {
    <%- component_name_pascal %>Container,
} from './style';

import { Props } from './type';

export const <%- component_name_pascal %>: FunctionComponent<Props> = ({
    children,
}) => {
    return (
        <<%- component_name_pascal %>Container>
            {children}
        </<%- component_name_pascal %>Container>
    );
};
