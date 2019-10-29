import React, { FunctionComponent } from 'react';

import {
    <%- component_name_uc %>Container,
} from './style';

import { Props } from './type';

export const <%- component_name_uc %>: FunctionComponent<Props> = ({
    children,
}) => {
    return (
        <<%- component_name_uc %>Container>
            {children}
        </<%- component_name_uc %>Container>
    );
};
