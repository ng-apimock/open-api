# Resolver
In order to use chance to create mock data, you need to be able to override your schema. Resolvers take care of that.

## Usage
You can create your own resolver.

An example of a mixin looks like this:

```json
{
  "identifier": "Pet",
  "mappers": [
    {
      "property": "name",
      "value": "my-name"
    }
  ]
}
```

This is a simple example. Here the `name` property within Pet will be set to a fixed value -> `my-name`

```json
{
  "identifier": "Pet",
  "mappers": [
    {
      "property": "photoUrls.items",
      "value": [{
        "chance": {
          "photoUrl": {
            "name": "awesome",
            "ext": "png"
          }
        }
      },{
        "chance": {
          "url": {
            "protocol": "http",
            "domain": "localhost",
            "extensions": ["jpg", "png"]
          }
        }
      }]
    }
  ]
}
```
This is an advanced example. Here the `photoUrls` array will be filled with 2 urls.
 - The first is using a self created mixin photoUrl. 
 - The second is using [change url](https://chancejs.com/web/url.html) to generate a url.
