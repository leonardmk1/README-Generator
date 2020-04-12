const fs = require("fs");
const axios = require("axios");
const inquirer = require("inquirer");
let loginName; 
let profilePic;
let githubName; 
let repoNames;

inquirer
  .prompt({
    message: "Enter your GitHub username:",
    name: "username"
  
  })
  .then(function({ username }) {
    console.log("fetching data...")
    const queryUrl = `https://api.github.com/users/${username}`;
    const repoQueryUrl = `https://api.github.com/users/${username}/repos?per_page=100`
    axios.get(queryUrl).then(function(res) {
        loginName = res.data.login;
        profilePic = res.data.avatar_url;
        githubName = res.data.name;
        axios.get(repoQueryUrl).then(function(res) {
         repoNames = res.data.map(function(repo) {
            return repo.name;
          });
          inquirer
          .prompt([{
            type: "list",
            message: "Which repo is this README for?",
            choices: repoNames,
            name: "name"
          },
          {
            message: "Write a description of your porject.",
            name: "description"
          },
          {
            message: "How can a user install your project?",
            name: "installation"
          },
          {
            message: "What can the user expect from your project? (Use examples liberally, and show the expected output of your project.)",
            name: "usage"
          },
          {
            message: "What, if any, license does your project have?",
            name: "license"
          },
          {
            message: "Who are the contributors to your project?",
            name: "contributors"
          },
          {
            message: "Have you ran any tests for your porject?",
            name: "tests"
          },
          {
            message: "If the user has any additional questions, how should they contact you?",
            name: "questions"
          },
        ]).then(function(responses){
          const readMeContent = `# ${responses.name}
Created By: ${githubName}

![](${profilePic})

## Repo Size
![](https://img.shields.io/github/repo-size/${loginName}/${responses.name})    

## Description
${responses.description}

## Table of Contents

- [Repo Size](#repo size)
- [Description](#description)
- [Installation](#installation)
- [Usage](#usage)
- [License](#license)
- [Contributing](#contributing)
- [Tests](#tests)
- [Questions](#questions)


## Installation
${responses.installation}

##  Usage
${responses.usage}

## License
${responses.license}

## Contributing
${responses.contributors}

## Tests
${responses.tests}

## Questions
${responses.questions}

## Video
          `
          fs.writeFile("ReadMe.md", readMeContent, function(err) {
            if (err) {
              throw err;
            }
        })
        })
    });
    })
  });
