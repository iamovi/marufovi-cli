#!/usr/bin/env node

import inquirer from 'inquirer';
import shell from 'shelljs';

import { categories } from './main/categories.js';
import { repositoriesByCategory, otherUrls } from './main/repositories.js';

const mainMenu = async () => {
  let keepRunning = true;

  while (keepRunning) {
    const categoryChoice = await inquirer.prompt({
      type: 'list',
      name: 'category',
      message: 'Choose a category:',
      choices: categories.concat('Exit'),
    });

    if (categoryChoice.category === 'Exit') {
      keepRunning = false;
      break;
    }

    if (categoryChoice.category === 'others') {
      const urlChoice = await inquirer.prompt({
        type: 'list',
        name: 'url',
        message: 'Choose a URL:',
        choices: Object.keys(otherUrls).concat('Go Back'),
      });

      if (urlChoice.url === 'Go Back') {
        continue;
      }

      if (urlChoice.url === 'gmail') {
        console.log('Gmail: fornet.ovi@gmail.com');
      } else {
        // Open the selected URL in the browser
        shell.exec(`open ${otherUrls[urlChoice.url]}`);
      }
      continue;
    }

    const repoChoice = await inquirer.prompt({
      type: 'list',
      name: 'repository',
      message: 'Choose a repository:',
      choices: repositoriesByCategory[categoryChoice.category].concat('Go Back'),
    });

    if (repoChoice.repository === 'Go Back') {
      continue;
    }

    const actionChoice = await inquirer.prompt({
      type: 'list',
      name: 'action',
      message: 'Choose an action:',
      choices: ['Open', 'Clone', 'Go Back'],
    });

    const selectedRepository = repoChoice.repository;

    if (actionChoice.action === 'Open') {
      shell.exec(`open https://github.com/iamovi/${selectedRepository}`);
    } else if (actionChoice.action === 'Clone') {
      const cloneUrl = `https://github.com/iamovi/${selectedRepository}.git`;
      const cloneSuccess = shell.exec(`git clone ${cloneUrl}`).code === 0;

      if (cloneSuccess) {
        console.log(`Successfully cloned ${selectedRepository} repository.`);
      } else {
        console.error(`Failed to clone ${selectedRepository} repository.`);
      }
    } else if (actionChoice.action === 'Go Back') {
      continue;
    }
  }
};

mainMenu();
