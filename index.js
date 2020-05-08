const inquirer = require("inquirer");
const fs = require("fs");
const util = require("util");

const writeFileAsync = util.promisify(fs.writeFile);

function promptUser() {
  return inquirer.prompt([
    {
      type: "input",
      name: "title",
      message: "What is the title of your project?",
    },
    {
      type: "input",
      name: "description",
      message: "What is a description of your project and/or its User Story?",
    },
    {
      type: "input",
      name: "installation",
      message: "How is this application installed?",
    },
    {
      type: "input",
      name: "usage",
      message: "How is this project used?"
    },
    {
      type: "input",
      name: "tests",
      message: "What are some tests that can confirm application is running correctly?"
    },
    {
      type: "list",
      name: "license",
      message:
        "Please select which license you would like to use for your project",
      choices: ["Apache 2.0", "GPL v3", "IPL 1.0", "MIT", "MPL 2.0"],
    },
    {
      type: "input",
      name: "email",
      message: "What email address can questions about this project be sent to?",
      default: "Questions and input regarding this project are currently not being monitored"
    },
    {
      type: "confirm",
      name: "collaborators",
      message: "Did you have any collaborators on this project?",
    },
  ]);
}

function createReadMe(answers) {
  const badgeLicense = answers.license.split(" ").join("%20");
  const urlLicense = answers.license.split(" ").join("-");
  let document = `
# ${answers.title}

* [Description](#description)
* [Installation](#installation)
* [Usage](#usage)
* [Tests](#tests)
* [License](#license)

## <a name="description"></a>Project Description

${answers.description}

## <a name="installation"></a>Installation

${answers.installation}

## <a name="usage"></a>Usage

${answers.usage}

## <a name="tests"></a>Tests

${answers.tests}

## <a name="Questions"></a>Questions can be sent to:

${answers.email}

## <a name="license"></a>License

[![License: ${answers.license}](https://img.shields.io/badge/License-${badgeLicense}-blue.svg)](https://opensource.org/licenses/${urlLicense})
`;

  if (answers.partners) {
    let partnerSection = `
## Collaborators

Click to view GitHub profile
    `;

    for (let i = 0; i < answers.partners.length; i++) {
      partnerSection += `\n[${answers.partners[i]}](https://github.com/${answers.partners[i]})`;
    }
    document += partnerSection;
  };

  return document;
}


async function init() {
  try {
    const answers = await promptUser();

    if (answers.collaborators === true) {
      const { partners } = await inquirer.prompt([
        {
          type: "input",
          name: "partners",
          message: "Enter the GitHub usernames of your collaborators (separated with spaces)",
        },
      ]);

      answers.partners = partners.split(" ");
    }

    const readMeInfo = createReadMe(answers);

    await writeFileAsync("README.md", readMeInfo);

    console.log("Successfully wrote to README.md");
  } catch (err) {
    console.log(err);
  }
}

init();
