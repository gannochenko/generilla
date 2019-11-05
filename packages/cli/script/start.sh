#!/usr/bin/env bash

DIR="$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )";

#GENERILLA_GENERATORS_HOME=${DIR}/../../../generators GENERILLA_DST=${DIR}/../../../_output yarn start;
#GENERILLA_DST=${DIR}/../../../_output yarn start run react.component -a '{"component_name":"ggggg","use_tests":true}' -y -o ${DIR}/../../../_output2;
#GENERILLA_DST=${DIR}/../../../_output yarn start run react.component -y -m
#GENERILLA_DST=${DIR}/../../../_output yarn start -m
GENERILLA_DST=${DIR}/../../../_output yarn start list
#GENERILLA_DST=${DIR}/../../../_output yarn start;
#GENERILLA_DST=${DIR}/../../../_output yarn start -h;
