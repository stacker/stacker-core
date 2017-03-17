# Laravel Stacker Template

This template supports Laravel 5+.

## Usage

- create the `stacker.yaml` file using the automated wizard

  ```
  $ stacker init laravel
  ```

- or, create the `stacker.yaml` file manually with the following content

  ```
  stack: laravel
  options:
    database: mysql
    phpmyadmin: true
    redis: true
    memcached: true
  ```

## Options

| name | description | value | default |
| ---- | ----------- | ----- | ------- |
| database | database type | string: `mysql, mariadb, postgres` | `mariadb`|
| phpmyadmin | include PHPMyAdmin | boolean | `false` |
| redis | include Redis | boolean | `false` |
| memcached | include Memcached | boolean | `false` |

## Ejectables

| name | description | service | remote file |
| ---- | ----------- | ------- | ----------- |
| `apache2.conf` | Apache config | `laravel` | `/etc/apache2/apache2.conf` |
| `apache2-site.conf` | Apache virtual host | `laravel` | `/etc/apache2/site-available/app.conf` |
| `my.cnf` | MySQL/MariaDB config | `database` | `/etc/mysql/my.cnf` |

To eject a file you can execute `stacker eject [name]` in your terminal.

## Runnables

| name | description | service | exec |
| ---- | ----------- | ------- | ---- |
| `apache-reload` | Reload Apache service | `laravel` | `service apache2 reload` |
| `phpunit` | Run PHPUnit suite | `laravel` | `./vendor/bin/phpunit; exit $?` |

To run a command you can execute `stacker run [name]` in your terminal.