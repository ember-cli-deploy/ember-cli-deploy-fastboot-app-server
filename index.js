/* eslint-env node */
'use strict';

const fs         = require('fs');
const path       = require('path');
const AdmZip     = require('adm-zip');
const BasePlugin = require('ember-cli-deploy-plugin');
const rimraf     = require('rimraf');
const RSVP       = require('rsvp');

module.exports = {
  name: 'ember-cli-deploy-fastboot-app-server',

  createDeployPlugin: function(options) {
    let DeployPlugin = BasePlugin.extend({
      name: options.name,

      defaultConfig: {
        distDir: function(context) {
          return context.distDir;
        },

        fastbootDistDir: 'tmp/fastboot-deploy',

        revisionKey: function(context) {
          let revisionKey = context.revisionData && context.revisionData.revisionKey;
          return context.commandOptions.revision || revisionKey;
        },

        downloaderManifestContent: function() {
          return function(bucket, key) {
            return `
              {
                "bucket": "${bucket}",
                "key": "${key}"
              }
            `;
          };
        }
      },

      setup: function() {
        let downloaderManifestContent = this.readConfig('downloaderManifestContent');

        return { downloaderManifestContent };
      },

      willBuild: function() {
        let fastbootDistDir = this.readConfig('fastbootDistDir');

        rimraf.sync(fastbootDistDir);

        return RSVP.resolve();
      },

      didPrepare: function() {
        let distDir         = this.readConfig('distDir');
        let revisionKey     = this.readConfig('revisionKey');
        let fastbootDistDir = this.readConfig('fastbootDistDir');

        if (!fs.existsSync(fastbootDistDir)) {
          fs.mkdirSync(fastbootDistDir);
        }

        let archiveName = 'dist-'+revisionKey+'.zip';
        let archivePath = path.join(fastbootDistDir, archiveName);

        let zip = new AdmZip();
        zip.addLocalFolder(distDir);
        zip.writeZip(archivePath);

        return {
          fastbootArchiveName: archiveName,
          fastbootArchivePath: archivePath
        };
      }
    });

    return new DeployPlugin();
  }
};
