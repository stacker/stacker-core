import Stack from '../../Stack';


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
    this.initRedisService();
    this.initMemcachedService();
    this.initBeanstalkdService();
  }
  initLaravelService() {
    this.services.set('laravel', {
      image: 'stacker/laravel:latest',
      shell: '/bin/zsh',
      env: {
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

    this.runnables.set('nginx-restart', {
      label: 'Restart NGINX',
      exec: 'service nginx restart',
      service: 'laravel',
    });
    this.runnables.set('restart-phpfpm', {
      label: 'Restart PHP-FPM',
      exec: 'service php7.1-fpm restart',
      service: 'laravel',
    });

    this.ejectables.set('nginx.conf', {
      label: 'NGINX config',
      path: '/etc/nginx/nginx.conf',
      service: 'laravel',
    });
    this.ejectables.set('php.ini', {
      label: 'PHP config',
      path: '/etc/php/fpm/php.ini',
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
      env: {
        MYSQL_ROOT_PASSWORD: 'root',
        MYSQL_DATABASE: DB_DATABASE,
        MYSQL_USER: DB_USERNAME,
        MYSQL_PASSWORD: DB_PASSWORD,
      },
    });

    const laravelService = this.services.get('laravel');
    laravelService.env.set('DB_CONNECTION', 'mysql');
  }
  initMariadbService() {
    this.services.set('database', {
      image: 'mariadb:latest',
      shell: '/bin/bash',
      env: {
        MYSQL_ROOT_PASSWORD: 'root',
        MYSQL_DATABASE: DB_DATABASE,
        MYSQL_USER: DB_USERNAME,
        MYSQL_PASSWORD: DB_PASSWORD,
      },
    });

    const laravelService = this.services.get('laravel');
    laravelService.env.set('DB_CONNECTION', 'mysql');
  }
  initPostgresService() {
    this.services.set('database', {
      image: 'postgres:latest',
      shell: '/bin/bash',
      env: {
        POSTGRES_DB: DB_DATABASE,
        POSTGRES_USER: DB_USERNAME,
        POSTGRES_PASSWORD: DB_PASSWORD,
      },
    });

    const laravelService = this.services.get('laravel');
    laravelService.env.set('DB_CONNECTION', 'pgsql');
  }
  initRedisService() {
    if (this.options.redis === true) {
      this.services.set('redis', {
        image: 'redis:latest',
        shell: '/bin/bash',
      });

      const laravelService = this.services.get('laravel');
      laravelService.env.set('REDIS_HOST', 'redis');
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
  initBeanstalkdService() {
    if (this.options.beanstalkd === true) {
      this.services.set('beanstalkd', {
        image: 'schickling/beanstalkd:latest',
        shell: '/bin/bash',
      });

      const laravelService = this.services.get('laravel');
      laravelService.env.set('QUEUE_DRIVER', 'beanstalkd');
      laravelService.env.set('QUEUE_HOST', 'beanstalkd');
    }
  }
}
