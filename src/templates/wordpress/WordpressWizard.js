function getQuestions() {
  return [
    {
      type: 'list',
      name: 'database',
      message: 'Choose DB',
      choices: [
        { name: 'MySQL', value: 'mysql' },
        { name: 'MariaDB', value: 'mariadb' },
      ],
    },
    {
      type: 'confirm',
      name: 'phpmyadmin',
      message: 'Do you want phpMyAdmin?',
    },
  ];
}

function makeOptions(answers) {
  const options = {
    database: answers.database,
    phpmyadmin: answers.phpmyadmin,
  };

  return options;
}

export default { getQuestions, makeOptions };
