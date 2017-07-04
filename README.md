# ember-cli-deploy-fastboot-app-server

> An ember-cli-deploy plugin to deploy Ember FastBoot apps that are deployed via [fastboot-app-server](https://github.com/ember-fastboot/fastboot-app-server)


This plugin relies on a FastBoot-app build being present in `context.distDir`. When you are building your application with [ember-cli-deploy-build](https://github.com/ember-cli-deploy/ember-cli-deploy-build) this will work out of the box. Otherwise you have to create your app build manually before running `ember deploy`.

## What is an ember-cli-deploy plugin?

A plugin is an addon that can be executed as a part of the ember-cli-deploy pipeline. A plugin will implement one or more of the ember-cli-deploy's pipeline hooks.

For more information on what plugins are and how they work, please refer to the [Plugin Documentation][2].

## Quick Start
To get up and running quickly, do the following:

- Ensure [ember-cli-deploy-build][4] is installed and configured.
- Ensure [ember-cli-deploy-revision-data][6] is installed and configured.
- Ensure [ember-cli-deploy-display-revisions](https://github.com/duizendnegen/ember-cli-deploy-display-revisions) is installed and configured.
- Ensure one of the compatible fastboot-app-server companion deploy plugins (e.g. [ember-cli-deploy-fastboot-app-server-aws][1]) is installed

- Install this plugin

```bash
$ ember install ember-cli-deploy-fastboot-app-server
```
- Run the pipeline

```bash
$ ember deploy production
```

## ember-cli-deploy Hooks Implemented

For detailed information on what plugin hooks are and how they work, please refer to the [Plugin Documentation][2].

- `configure`
- `setup`
- `willBuild`
- `prepare`

## Configuration Options


For detailed information on how configuration of plugins works, please refer to the [Plugin Documentation][2].

### distDir

The root directory where the FastBoot build will be searched in. By default, this option will use the `distDir` property of the deployment context.

*Default:* `context.distDir`

### fastbootDistDir

The root directory where the zipped FastBoot-build will be copied to.

*Default:* `tmp/fastboot-deploy`

### revisionKey

The unique revision number for the version of the app. By default this option will use either the `revision` passed in from the command line or the `revisionData.revisionKey` property from the deployment context.

*Default:* `context.commandOptions.revision || context.revisionData.revisionKey`

### downloaderManifestContent

A function that gets added to the deploy context so that other plugins can update an app-manifest file that is used by [fastboot-app-server notifiers](https://github.com/ember-fastboot/fastboot-app-server#notifiers) and [-downloaders](https://github.com/ember-fastboot/fastboot-app-server#downloaders) to update the FastBoot-app served via `fastboot-app-server`.

*Default:*

```js
return function(bucket, key) {
  return `
    {
      "bucket": "${bucket}",
      "key": "${key}"
    }
  `;
}
```

### What does this plugin do exactly?
This plugin is meant to be used in combination with [fastboot-app-server](https://github.com/ember-fastboot/fastboot-app-server) and follows the deployment instructions from the [FastBoot-docs](https://ember-fastboot.com/docs/deploying#custom-server). It will zip the application-build and update the deployment context with the necessary artifacts for other `ember-cli-deploy-fastboot-app-server`-plugins to finish the deployment (e.g. upload the zipped application build to a S3-bucket).

## Prerequisites

The following properties are expected to be present on the deployment `context` object:

- `distDir`                     (provided by [ember-cli-deploy-build][4])
- `project.name()`              (provided by [ember-cli-deploy][5])
- `revisionKey`                 (provided by [ember-cli-deploy-revision-data][6])
- `commandLineArgs.revisionKey` (provided by [ember-cli-deploy][5])
- `deployEnvironment`           (provided by [ember-cli-deploy][5])

## Running Tests

- `yarn test`

[1]: https://github.com/lukemelia/ember-cli-deploy-lightning-pack "ember-cli-deploy-lightning-pack"
[2]: http://ember-cli.github.io/ember-cli-deploy/plugins "Plugin Documentation"
[3]: https://www.npmjs.com/package/redis "Redis Client"
[4]: https://github.com/ember-cli-deploy/ember-cli-deploy-build "ember-cli-deploy-build"
[5]: https://github.com/ember-cli/ember-cli-deploy "ember-cli-deploy"
[6]: https://github.com/ember-cli-deploy/ember-cli-deploy-revision-data "ember-cli-deploy-revision-data"
[7]: https://docs.aws.amazon.com/AWSJavaScriptSDK/guide/node-configuring.html#Setting_AWS_Credentials "Setting AWS Credentials"
