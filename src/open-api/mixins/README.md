# Mixin
To generate mock data we use chance.js [chance.js](https://chancejs.com).

## Usage
You can create your own mixins to extend Chance to fit the needs of your specific application.

An example of a mixin looks like this:

```js
module.exports = {
    name: 'photoUrl',
    fn: (options) => `${options.name}.${options.ext}`
}
```
