# micro-lc

## ci lifecycle

- install => setup repo and fetch dependencies
- lint => (global only) runs linter

- postinstall => build anything might be needed by other packages
- check:types => run tsc
- prebuild => build anything needed for testing
- test:browser => run tests on all browsers
- coverage => run overall coverage (browser runs on chromium only)
- build => create every single artifact that goes into the release

- release => npm release
- pack => creation of docker containers

## local scripts

- cleanup => removes dist node_modules coverage and so on
- test => runs all tests with in-browser on chromium
- test:[browser] => tests on a given browser
