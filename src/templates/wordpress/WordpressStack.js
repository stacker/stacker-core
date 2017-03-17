import Stack from '../../Stack';


const DB_HOST = 'database';
const DB_DATABASE = 'wordpress';
const DB_USERNAME = 'stacker';
const DB_PASSWORD = 'secret';
const DEFAULT_OPTIONS = {
  database: 'mariadb',
};

export default class WordpressStack extends Stack {
  constructor(options = {}) {
    super();
    this.setOptions(options);
    this.init();
  }
  setOptions(options) {
    this.options = { ...DEFAULT_OPTIONS, ...options };
  }
  init() {
    this.initWordpressService();
    this.initDatabaseService();
    this.initPhpMyAdminService();
  }
  initWordpressService() {
    this.services.set('wordpress', {
      image: 'wordpress:apache',
      shell: '/bin/bash',
      env: {
        WORDPRESS_DB_HOST: DB_HOST,
        WORDPRESS_DB_NAME: DB_DATABASE,
        WORDPRESS_DB_USER: DB_USERNAME,
        WORDPRESS_DB_PASSWORD: DB_PASSWORD,
      },
      ports: {
        80: 80,
      },
      volumes: [
        '.:/var/www/html',
      ],
    });
  }
  initDatabaseService() {
    if (this.options.database === 'mysql') {
      return this.initMysqlService();
    } else if (this.options.database === 'mariadb') {
      return this.initMariadbService();
    }
  }
  initMysqlService() {
    this.services.set('database', {
      image: 'mysql:latest',
      shell: '/bin/bash',
      volumes: [
        'database_data:/var/lib/mysql',
      ],
      env: {
        MYSQL_ROOT_PASSWORD: 'root',
        MYSQL_DATABASE: DB_DATABASE,
        MYSQL_USER: DB_USERNAME,
        MYSQL_PASSWORD: DB_PASSWORD,
      },
    });

    this.ejectables.set('my.cnf', {
      label: 'MySQL config',
      path: '/etc/mysql/my.cnf',
      service: 'database',
    });

    this.volumes.set('database_data', {
      driver: 'local',
    });
  }
  initMariadbService() {
    this.services.set('database', {
      image: 'mariadb:latest',
      shell: '/bin/bash',
      volumes: [
        'database_data:/var/lib/mysql',
      ],
      env: {
        MYSQL_ROOT_PASSWORD: 'root',
        MYSQL_DATABASE: DB_DATABASE,
        MYSQL_USER: DB_USERNAME,
        MYSQL_PASSWORD: DB_PASSWORD,
      },
    });

    this.ejectables.set('my.cnf', {
      label: 'MariaDB config',
      path: '/etc/mysql/my.cnf',
      service: 'database',
    });

    this.volumes.set('database_data', {
      driver: 'local',
    });
  }
  initPhpMyAdminService() {
    if (this.options.phpmyadmin === false) return;

    this.services.set('phpmyadmin', {
      image: 'phpmyadmin/phpmyadmin:latest',
      shell: '/bin/bash',
      env: {
        PMA_HOST: DB_HOST,
        PMA_USER: DB_USERNAME,
        PMA_PASSWORD: DB_PASSWORD,
      },
      ports: {
        9999: 80,
      },
    });
  }
}
