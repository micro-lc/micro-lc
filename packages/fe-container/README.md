# Front end container

This package contains the front end core of microlc: a lightweight launcher written in React and Typescript which is responsible for rendering the plugins and for providing a set of core functionalities to the application.

These functionalities are for the most part configurable through a core configuration retrieved by the launcher at runtime. The choice of consuming this configuration at runtime makes the fe-container **multi tenant**: multiple tenants can use the same instance of microlc controlling the rendered plugins and the application theme through different configurations.

The fe-container offers the following functionalities:
- base layout
- user managment
- plugin management
- preferences management
- branding

# Project structure

The root directory for the business logic is `src`.

This folder is divided in:

- `components`: contains all the UI components, made with [React](https://reactjs.org/);
- `containers`: provide the `launcher` components: the entry point of `microlc` provided by Mia-Platform;
- `contexts`: contains the applications contexts, used to save the application states
- `hooks`: includes all the React's custom [hooks](https://reactjs.org/docs/hooks-intro.html) used by components
- `plugin-utils`: where there is the facade used to register and handle the behaviour of each plugin
- `services`: contains all the functions used to interact with external services (eg. APIs)
- `strings`: store the configurations of i18n
- `styles`: collects all the [LESS](http://lesscss.org/) variables, divided by purpose

