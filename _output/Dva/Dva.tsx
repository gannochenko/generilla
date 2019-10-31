import React, { FunctionComponent } from 'react';

import { DvaContainer } from './style';

import { Props } from './type';

export const Dva: FunctionComponent<Props> = ({ children }) => {
    return <DvaContainer>{children}</DvaContainer>;
};
