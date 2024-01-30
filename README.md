# ST Schema Simple Example

This application is about the simplest possible implementation of an ST Schema
cloud-to-cloud device integration. It's built using the
[ST Schema SDK for NodeJs](https://github.com/SmartThingsCommunity/st-schema-nodejs). This example creates a single simulated dimmer device
named _Test Dimmer_. The state of the dimmer is saved in memory to keep the
implementation as simple as possible, so restarting the server will reset it's
switch status to 'off' and switch dimmer level to 100%.

Note that ST Schema requires your cloud application to support [OAuth 2](https://oauth.net/2/) for authentication.
This example does not include an OAuth server, but it does include instructions for
remixing a [Glitch dummy OAuth server](https://glitch.com/~st-dummy-oauth-server) to handle that part of the login process

## Files

- connector.js -- The ST Schema connector app built with the [st-schema](https://www.npmjs.com/package/st-schema) SDK
- index.js -- An [AWS Lambda](https://aws.amazon.com/lambda/) handler that hosts the connector.
- server.js -- An [express](https://www.npmjs.com/package/express) web server that hosts the connector

## Getting Started

We are using Glitch for our test device.

### Running in Glitch

#### Prerequisites

- A [Glitch](https://glitch.com/about/) account
- A [Samsung Developer Workspace account](https://smartthings.developer.samsung.com/workspace/)
- The SmartThings mobile app (available from the [iOS App Store](https://apps.apple.com/us/app/smartthings/id1222822904)
or [Google Play Store](https://play.google.com/store/apps/details?id=com.samsung.android.oneconnect))

#### Instructions

1. Remix the [st-schema-simple-example](https://glitch.com/~st-schema-simple-example-js) project.

1. Set the values in the `.env` file using `.env-example` as a guide. 

1. Once the remixed app is up and running copy its URL.

1. Register the webhook url in SmartThings Developer Workspace and deploy it for testing.

1. Install the SmartThings mobile app from the [iOS App Store](https://apps.apple.com/us/app/smartthings/id1222822904)
or [Google Play Store](https://play.google.com/store/apps/details?id=com.samsung.android.oneconnect),
log in with the same email address and password used for your developer workspace account, and 
create a location (if you have not already done so)

1. Put the SmartThings mobile app in [developer mode](https://smartthings.developer.samsung.com/docs/guides/testing/developer-mode.html) and tap the "+" button at the top to
add a device. Scroll down to _My Testing Devices_ tap on it, and select your connector. Complete
the OAuth login process and return to the Devices page. You should be prompted to assign
a device named _Test Dimmer_ to a room. 


## Configuring the Dummy OAuth Server

ST Schema connectors require an OAuth2 connection journey. Since this example 
app does not include OAuth support you must use some other server to complete
that journey. It can be any server supporting OAuth2 as long as it is configured
with the same client ID and client secret as the ST Schema connector you registered
in the Developer Workspace. For convenience we've provided a dummy OAuth server
that accepts any username and password and can be configured with your client ID and
secret.

1. Remix the [st-dummy-oauth-server](https://glitch.com/~st-dummy-oauth-server) project



## Testing the device

Tap the _Test Dimmer_ device icon in the main devices view and it should turn on and off. You should see ST Schema requests
and responses logged to the console. Remove the `.enableEventLogging(2)` line from `connector.js` to stop these
messages. Go into the detail view of the device to see the brightness control. Sliding this control will also 
result in calls to your connector and messages logged to the console.

