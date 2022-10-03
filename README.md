# Prebid.js and GPT

## Before testing
Firstly we need to run our server:
node server.js

## Testing
We can use both ways for testing:

### Iframe + SSR Html
We are creating a `<iframe>` element with src attribute that uses our server's Html page and sends params for rendering this to server side. For testing, we should put only iframeClient.js on a site.

### Client side getting information
We are working only in the browser with our SSR render HTML and put data directly to DOM with JS. For testing, we need to put 3 files to a site:  index.html, clientNative.js and style.css.