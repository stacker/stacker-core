function getQuestions() {
  return [
    {
      type: 'list',
      name: 'database',
      message: 'Choose DB',
      choices: [
        { name: 'MySQL', value: 'mysql' },
        { name: 'MariaDB', value: 'mariadb' },
        { name: 'PostgreSQL', value: 'postgres' },
      ],
    },
    {
      type: 'checkbox',
      name: 'addons',
      message: 'Select addons',
      choices: [
        { name: 'Redis', value: 'redis' },
        { name: 'Memcached', value: 'memcached' },
        { name: 'Beanstalk', value: 'beanstalkd' },
      ],
    },
  ];
}

function makeOptions(answers) {
  const options = {
    database: answers.database,
  };

  if (answers.addons.includes('redis')) options.redis = true;
  if (answers.addons.includes('memcached')) options.memcached = true;
  if (answers.addons.includes('beanstalkd')) options.beanstalkd = true;

  return options;
}

export default { getQuestions, makeOptions };
