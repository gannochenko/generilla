import React, { FunctionComponent } from 'react';

import { FooContainer } from './style';

import { Props } from './type';

export const Foo: FunctionComponent<Props> = ({ children }) => {
    return <FooContainer>{children}</FooContainer>;
};
