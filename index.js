//  Packages
var core = require('@actions/core')
var execSync = require('child_process').execSync
code = execSync('npm install exeq --save')
var exeq = require('exeq')

//  Input variables
var CANARY_DEPLOYMENTS = core.getInput('canary-deployments')
var DOMAIN_MANAGER = core.getInput('domain-manager')

//  Installs Serverless and specified plugins
async function installServerlessAndPlugins() {
  await exeq(
    `echo Installing Serverless and plugins...`,
    // `npm i serverless -g`,
    `npm i serverless@3.21.0 -g`,
    `npm i serverless-plugin-canary-deployments`,
    // `npm i serverless-python-requirements`
    `npm i serverless-python-requirements@5.4.0`
  )
}

//  Runs Serverless deployment using AWS Credentials if specified, else SERVERLESS ACCESS KEY
async function runServerlessDeploy() {
  await exeq(
    `echo Running sls deploy...`,
    `echo Stage ${process.env.STAGE}`,
    `echo Region ${process.env.REGION}`,
    `if [ ${process.env.AWS_ACCESS_KEY_ID} ] && [ ${process.env.AWS_SECRET_ACCESS_KEY} ]; then
      echo Running sls config credentials is not supported in Serverless V4
      npx sls config credentials --provider aws --key ${process.env.AWS_ACCESS_KEY_ID} --secret ${process.env.AWS_SECRET_ACCESS_KEY} --verbose
    fi`,
    `echo pwd`,
    `pwd`,
    `echo ls -lag`,
    `ls -lag`,
    // `cd platform-metrics-main-local-restapi-python-serverless-com`,
    //`echo cd ${repo-directory}`,
    `echo cd ${process.env.REPO_DIRECTORY}`,
    `cd ${process.env.REPO_DIRECTORY}`,
    `echo ls -lag`,
    `ls -lag`,
    //`echo npm list hapi- Before`,
    //`npm list hapi`,
    //`echo running npm i hapi hapi to try to solve TypeError: Os.tmpDir is not a function in platform-metrics-main-local-restapi-python-serverless-com`,
    // serverless-offline-python@3.22.3 -> hapi@14.2.0 TypeError: Os.tmpDir is not a function
    //`npm install @hapi/hapi@21.3.10`,
    //`echo npm list hapi- After`,
    //`npm list hapi`,
    `echo npx sls deploy ...`,
    // `sls deploy --verbose`
    // `npx sls deploy --verbose`
    `npx sls deploy  --region ${process.env.REGION} --stage ${process.env.STAGE} --verbose`,
    `echo After npx sls deploy ...`
  )
}

//  Runs all functions sequentially
async function handler() {
  try {
    // await installServerlessAndPlugins()
    await runServerlessDeploy()
  } catch (error) {
    core.setFailed(error.message);
  }
}

//  Main function
if (require.main === module) {
  handler()
}
