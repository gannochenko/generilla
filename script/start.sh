#!/usr/bin/env bash

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )";

GENERILLA_GENERATORS_HOME=${DIR}/generators yarn start;
