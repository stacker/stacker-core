import Stack from '../../Stack';


const DB_HOST = 'database';
const DB_DATABASE = 'laravel';
const DB_USERNAME = 'stacker';
const DB_PASSWORD = 'secret';
const DEFAULT_OPTIONS = {
  database: 'mariadb',
};

export default class LaravelStack extends Stack {
  constructor(options = {}) {
    super();
    this.setOptions(options);
    this.init();
  }
  setOptions(options) {
    this.options = { ...DEFAULT_OPTIONS, ...options };
  }
  init() {
    this.initLaravelService();
    this.initDatabaseService();
    this.initPhpMyAdminService();
    this.initRedisService();
    this.initMemcachedService();
  }
  initLaravelService() {
    this.services.set('laravel', {
      image: 'stacker/laravel:latest',
      shell: '/bin/bash',
      env: {
        DB_HOST,
        DB_DATABASE,
        DB_USERNAME,
        DB_PASSWORD,
      },
      ports: {
        80: 80,
      },
      volumes: [
        '.:/app',
      ],
    });

    this.ejectables.set('apache2.conf', {
      label: 'Apache config',
      path: '/etc/apache2/apache2.conf',
      service: 'laravel',
    });
    this.ejectables.set('apache2-site.conf', {
      label: 'Apache virtual host',
      path: '/etc/apache2/site-available/app.conf',
      service: 'laravel',
    });

    this.runnables.set('apache-reload', {
      label: 'Reload Apache service',
      exec: 'service apache2 reload',
      service: 'laravel',
    });
    this.runnables.set('phpunit', {
      label: 'Run PHPUnit suite',
      exec: './vendor/bin/phpunit; exit $?',
      service: 'laravel',
    });
  }
  initDatabaseService() {
    if (this.options.database === 'mysql') {
      return this.initMysqlService();
    } else if (this.options.database === 'mariadb') {
      return this.initMariadbService();
    } else if (this.options.database === 'postgres') {
      return this.initPostgresService();
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

    const laravelService = this.services.get('laravel');
    laravelService.env.set('DB_CONNECTION', 'mysql');
    laravelService.env.set('DB_PORT', 3306);

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

    const laravelService = this.services.get('laravel');
    laravelService.env.set('DB_CONNECTION', 'mysql');
    laravelService.env.set('DB_PORT', 3306);

    this.ejectables.set('my.cnf', {
      label: 'MariaDB config',
      path: '/etc/mysql/my.cnf',
      service: 'database',
    });

    this.volumes.set('database_data', {
      driver: 'local',
    });
  }
  initPostgresService() {
    this.services.set('database', {
      image: 'postgres:latest',
      shell: '/bin/bash',
      volumes: [
        'database_data:/var/lib/postgresql/data',
      ],
      env: {
        POSTGRES_DB: DB_DATABASE,
        POSTGRES_USER: DB_USERNAME,
        POSTGRES_PASSWORD: DB_PASSWORD,
      },
    });

    const laravelService = this.services.get('laravel');
    laravelService.env.set('DB_CONNECTION', 'pgsql');
    laravelService.env.set('DB_PORT', 5432);

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
  initRedisService() {
    if (this.options.redis === true) {
      this.services.set('redis', {
        image: 'redis:latest',
        shell: '/bin/bash',
        volumes: [
          'redis_data:/data',
        ],
      });

      const laravelService = this.services.get('laravel');
      laravelService.env.set('REDIS_HOST', 'redis');

      this.volumes.set('redis_data', {
        driver: 'local',
      });
    }
  }
  initMemcachedService() {
    if (this.options.memcached === true) {
      this.services.set('memcached', {
        image: 'memcached:latest',
        shell: '/bin/bash',
      });
    }
  }
}
