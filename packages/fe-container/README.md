# Front end container

This package contains the front end core of microlc: a lightweight launcher written in React and Typescript which is responsible for rendering the plugins and for providing a set of core functionalities to the application.

These functionalities are for the most part configurable through a core configuration retrieved by the launcher at runtime. The choice of consuming this configuration at runtime makes the fe-container **multi tenant**: multiple tenants can use the same instance of microlc controlling the rendered plugins and the application theme through different configurations.

The fe-container offers the following functionalities:
- base layout
- user managment
- plugin management
- preferences management
- branding
