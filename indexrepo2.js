const { program } = require("commander");
const fs = require("fs-extra");
const path = require("path");
const { exec } = require("child_process");
const packagerepo2 = require('./package.json');

let repo2Path = path.join(__dirname,"../");
//define repo1 path and repo1 object path
let repo1Path = path.join(_dirname,"../repo1");
let repo1ObjPath = path.join(repo1Path, "myobject.json");

// * main function

async function main() {
  try {
    exec(
      `cd ${repo2Path} && npm version patch && npm publish`,
      //&& git commit -am "update version" && git push origin master`,
      //&& cd ${repo1Path} git fetch origin master && git commit -am 'pre relese' && npm version patch && git push origin master`,
      (err, stdout, stderr) => {
        if (err) {
          console.error(err);
          return err;
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
      `cd ${repo1Path}  && git commit -am 'pre relese' && npm version patch && git push origin master`,
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
