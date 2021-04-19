# Microlc Plugin Template walkthrough

[![Build Status][github-actions-svg]][github-actions]
[![Coverage Status][coverall-svg]][coverall-io]

This walkthrough will explain you how to correctly create a microservice that renders a React based webpage from the DevOps Console.

## Create a microservice

In order to do so, access to [Mia-Platform DevOps Console](https://console.cloud.mia-platform.eu/login), create a new project and go to the **Design** area.  
From the Design area of your project select _Microservices_ and then create a new one, you have now reached [Mia-Platform Marketplace](https://docs.mia-platform.eu/development_suite/api-console/api-design/marketplace/)!  
In the marketplace you will see a set of Examples and Templates that can be used to set-up microservices with a predefined and tested function.  

For this walkthrough select the following template: **React Template**.
Give your microservice the name you prefer, in this walkthrough we'll refer to it with the following name: **react-service**. Then, fill the other required fields and confirm that you want to create a microservice.  
A more detailed description on how to create a Microservice can be found in [Microservice from template - Get started](https://docs.mia-platform.eu/development_suite/api-console/api-design/custom_microservice_get_started/#2-service-creation) section of Mia-Platform documentation.

## Expose an endpoint to your microservice

In order to access to your new microservice it is necessary to create an endpoint that targets it.  
In particular, in this walkthrough you will create an endpoint to your microservice *react-service*. To do so, from the Design area of your project select _Endpoints_ and then create a new endpoint.
Now you need to choose a path for your endpoint and to connect this endpoint to your microservice. Give to your endpoint the following path: **/react**. Then, specify that you want to connect your endpoint to a microservice and, finally, select *react-service*.  
Step 3 of [Microservice from template - Get started](https://docs.mia-platform.eu/development_suite/api-console/api-design/custom_microservice_get_started/#3-creating-the-endpoint) section of Mia-Platform documentation will explain in detail how to create an endpoint from the DevOps Console.

## Save your changes

After having created an endpoint to your microservice you should save the changes that you have done to your project in the DevOps console.  
Remember to choose a meaningful title for your commit (e.g "created service react_service"). After some seconds you will be prompted with a popup message which confirms that you have successfully saved all your changes.  
Step 4 of [Microservice from template - Get started](https://docs.mia-platform.eu/development_suite/api-console/api-design/custom_microservice_get_started/#4-save-the-project) section of Mia-Platform documentation will explain how to correctly save the changes you have made on your project in the DevOps console.

## Deploy

Once all the changes that you have made are saved, you should deploy your project through the DevOps Console. Go to the **Deploy** area of the DevOps Console.  
Once here select the environment and the branch you have worked on and confirm your choices clicking on the *deploy* button. When the deploy process is finished you will receveive a pop-up message that will inform you.  
Step 5 of [Microservice from template - Get started](https://docs.mia-platform.eu/development_suite/api-console/api-design/custom_microservice_get_started/#5-deploy-the-project-through-the-api-console) section of Mia-Platform documentation will explain in detail how to correctly deploy your project.

## Try it

Now, if you copy/paste the following url in the search bar of your browser (remember to replace `<YOUR_PROJECT_HOST>` with the real host of your project):

```shell
curl <YOUR_PROJECT_HOST>/react/
```

you should see a react-based webpage with a link to a [React](https://reactjs.org/) tutorial.

Congratulations! You have successfully learnt how to use our _MicroLC Plugin_ Template on the DevOps Console!

## Plugin bootstrap for microlc
To make your plugin visible to our micro frontends container microlc it is mandatory to export three different lifecycle hooks inside the index.js file: 
- bootstrap: it will only be called once when your application is initialized. Next time your application re-enters, the mount hook will be called directly, and bootstrap will not be triggered repeatedly.  Usually, we can do some initialization of global variables here, such as application-level caches that will not be destroyed during the unmount phase.
- mount: the method is called every time the application enters, usually we trigger the application's rendering method here.
- unmount:  Methods that are called each time the application is switched/unloaded.

There is the possibility to inject two different variables: 
- `basePath`: the path under which the plugin is loaded
- `currentUser`: object containing the properties of the user currently contextualized




[github-actions]: https://github.com/mia-platform-marketplace/microlc-plugin-template/actions
[github-actions-svg]: https://github.com/mia-platform-marketplace/microlc-plugin-template/workflows/Node.js%20CI/badge.svg
[coverall-svg]: https://coveralls.io/repos/github/mia-platform-marketplace/microlc-plugin-template/badge.svg?branch=master
[coverall-io]: https://coveralls.io/github/mia-platform-marketplace/microlc-plugin-template?branch=master
