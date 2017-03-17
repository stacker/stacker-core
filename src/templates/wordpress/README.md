# Wordpress Stacker Template

This template supports Wordpress 4+.

## Usage

- create the `stacker.yaml` file using the automated wizard

```
stacker init wordpress
```

- or, create the `stacker.yaml` file manually with the following content

```
stack: wordpress
options:
  database: mysql
  phpmyadmin: true
```

## Options

| name | description | value | default |
| ---- | ----------- | ----- | ------- |
| database | database type | string: `mysql, mariadb` | `mariadb`|
| phpmyadmin | include PHPMyAdmin | boolean | `false` |

## Ejectables

| name | description | service | remote file |
| ---- | ----------- | ------- | ----------- |
| `my.cnf` | MySQL/MariaDB config | `database` | `/etc/mysql/my.cnf` |

To eject a file you can execute `stacker eject [name]` in your terminal.
