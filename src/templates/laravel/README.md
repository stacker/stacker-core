# Laravel Stacker Template

## Usage

A Stacker Template can be used in two ways:

### 1. Generate the stacker file with Stacker CLI

Run `stacker init` in your project's directory, then configure your options.

### 2. Create the stacker file manually

Create your `stacker.yaml` file in your project's directory.

Examples:

```
stack: laravel
options:
  database: mariadb
```

```
stack: laravel
options:
  database: mysql
  phpmyadmin: true
  redis: true
  memcached: true
```

---

## Options

| name | description | value | default |
| ---- | ----------- | ----- | ------- |
| database | database type | string: `mysql, mariadb, postgres` | `mariadb`|
| phpmyadmin | include PHPMyAdmin | boolean | `false` |
| redis | include Redis | boolean | `false` |
| memcached | include Memcached | boolean | `false` |

---

## Ejectables

| name | description | service | remote file |
| ---- | ----------- | ------- | ----------- |
| `apache2.conf` | Apache config | `laravel` | `/etc/apache2/apache2.conf` |
| `apache2-site.conf` | Apache virtual host | `laravel` | `/etc/apache2/site-available/app.conf` |
| `my.cnf` | MySQL/MariaDB config | `database` | `/etc/mysql/my.cnf` |

---

## Runnables

| name | description | service | exec |
| ---- | ----------- | ------- | ---- |
| `apache-reload` | Reload Apache service | `laravel` | `service apache2 reload` |
| `phpunit` | Run PHPUnit suite | `laravel` | `./vendor/bin/phpunit; exit $?` |
