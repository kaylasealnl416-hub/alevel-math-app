#!/bin/bash

set -euo pipefail

bun tests/run-all-tests.js --all "$@"
