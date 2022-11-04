const { program } = require("commander");
const fs = require("fs-extra");
const path = require("path");
const { exec } = require("child_process");
const packagerepo2 = require('./package.json');

let repo2Path = path.join("/home/mitraksh/dev/mitraksh/scopedtask/repo2");
//define repo1 path and repo1 object path
let repo1Path = path.join("/home/mitraksh/dev/mitraksh/scopedtask/repo1");
let repo1ObjPath = path.join(repo1Path, "myobject.json");
/*
// * pre prcoess arguments function
function processArgs() {
  program.option(`-r2, --repo2 ${repo2_version}`);
  program.parse();

  const options = program.opts();

  return repo2_version;
}

console.log(processArgs()+' process');
*/

// * main function

async function main() {
  //const options = processArgs();
  //console.log(options+' options')
  try {
    exec(
      `cd ${repo2Path} && npm version patch`,
      //&& git commit -am "update version" && git push origin master`,
      //&& cd ${repo1Path} git fetch origin master && git commit -am 'pre relese' && npm version patch && git push origin master`,
      (err, stdout, stderr) => {
        if (err) {
          console.error(err);
        } else if(!err) {
          console.log(`stdout: ${stdout}`);
          console.log(`stderr: ${stderr}`);
          console.log('v+'+repo2_version);
        }
      }
    );
    const repo2_version = packagerepo2.version;
    let result = await fs.readFile(repo1ObjPath, "utf8");
    console.log(result)
    result = JSON.parse(result);
    result.repo2 = repo2_version;
    await fs.writeJSON(repo1ObjPath, result);
    exec(
      `cd ${repo1Path} && git fetch origin master && git commit -am 'pre relese' && npm version patch && git push origin master`,
      (err, stdout, stderr) => {
        if (err) {
          console.error(err);
        } else if(!err) {
          console.log(`stdout: ${stdout}`);
          console.log(`stderr: ${stderr}`);
         console.log('v+'+repo2_version);
        }
      }
    );
  } catch (error) {
    throw new Error(error);
  }
}

main();
