#!/usr/bin/env bash

yarn run install-peers;
if ! [ $? -eq 0 ]
then
    exit 1;
fi

yarn run lint;
if ! [ $? -eq 0 ]
then
    exit 1;
fi

yarn run test;
if ! [ $? -eq 0 ]
then
    exit 1;
fi

yarn run build;
if ! [ $? -eq 0 ]
then
    exit 1;
fi

git add -A ./;
git commit -m "another build";

yarn lerna publish --npm-client=yarn;
