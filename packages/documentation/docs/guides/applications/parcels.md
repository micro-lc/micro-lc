---
title: Parcels
sidebar_label: Parcels
sidebar_position: 30
---

Most common integration mode, recommended to embed SPAs. This kind of application are directly managed by the orchestrator,
which needs to be supplied with the assets entry point.

> A single-spa parcel is a framework-agnostic component. It is a chunk of functionality meant to be mounted manually by an
> application, without having to worry about which framework was used to implement the parcel or application. A parcel can
> be as large as an application or as small as a component and written in any language as long as it exports the correct
> lifecycle events.
> 
> — [single-spa documentation](https://single-spa.js.org/docs/parcels-overview/#parcel-lifecycles)

An entry is an object with keys `html`, `scripts`, and `styles`. At least one between `html` and `scripts` is mandatory.
By polymorphism, we allow entry to be a string which will be interpreted as an HTML asset entry.

:::danger Important takeaway
Up to now, only JavaScript **UMD scripts** can be used as application assets.
:::

Parcels use
similar methodology as registered applications but are mounted by a manual function call rather than the activity function.
 In a single-spa world, your SPA contains many registered applications and potentially many
parcels. Typically, we recommend you mount a parcel within the context of an application because the parcel will be
unmounted with the application.

## Lifecycle methods

### Bootstrap

This lifecycle function will be called once, right before the parcel is mounted for the first time.

```js
function bootstrap(props) {
  return Promise.resolve().then(() => {
    // This is where you do one-time initialization
    console.log('bootstrapped!');
  });
}
```

### Mount

If the parcel is not mounted this lifecycle function is called when ever `mountParcel` is called. When called, this 
function should create DOM elements, DOM event listeners, etc. to render content to the user.

```js
function mount(props) {
  return Promise.resolve().then(() => {
    // This is where you tell a framework (e.g., React) to render some ui to the dom
    console.log('mounted!');
  });
}
```

### Unmount

This lifecycle function will be called whenever the parcel is mounted and one of the following cases is true:

- `unmount()` is called
- The parent parcel or application is unmounted

When called, this function should clean up all DOM elements, DOM event listeners, leaked memory, globals, observable 
subscriptions, etc. that were created at any point when the parcel was mounted.

```js
function unmount(props) {
  return Promise.resolve().then(() => {
    // This is where you tell a framework (e.g., React) to unrender some ui from the dom
    console.log('unmounted!');
  });
}
```

### Update (optional)

The update lifecycle function will be called whenever the user of the parcel calls `parcel.update()`. Since this 
lifecycle is optional, the user of a parcel needs to check whether the parcel has implemented the update lifecycle before
attempting to make the call.

## Properties

## Routing injection
