# Basic Puppet Apache manifest

class apache::install {
  exec { 'apt-get update':
    command => '/usr/bin/apt-get update'
  }

  package { "apache2":
    ensure => present,
  }

  service { "apache2":
    ensure => running,
    require => Package["apache2"],
  }

  exec { "mod-rewrite":
    unless => "/bin/ls /etc/apache2/mods-enabled/rewrite*",
    command => "/usr/sbin/a2enmod rewrite",
    notify  => Service["apache2"],
    require => Package["apache2"],
  }

  file { '/var/www':
    ensure => link,
    target => "/home/vagrant/src",
    notify => Service['apache2'],
    force  => true
  }
}


class mysql::install {

  $password = 'vagrant'

  package { [
      'mysql-client',
      'mysql-server',
    ]:
    ensure => installed,
  }

  exec { 'Set MySQL server\'s root password':
    subscribe   => [
      Package['mysql-server'],
      Package['mysql-client'],
    ],
    refreshonly => true,
    unless      => "mysqladmin -uroot -p${password} status",
    path        => '/bin:/usr/bin',
    command     => "mysqladmin -uroot password ${password}",
  }

}

class php5::install {

  package { [
      'php5',
      'php5-mysql',
      'php5-curl',
      'php5-gd',
      'php5-fpm',
      'libapache2-mod-php5',
    ]:
    ensure => present,
  }

}

class wordpress::install {
  # Create the Wordpress database
  exec { 'create-database':
    unless  => '/usr/bin/mysql -u root -pvagrant wordpress',
    command => '/usr/bin/mysql -u root -pvagrant --execute=\'create database wordpress\'',
  }

  exec { 'create-user':
    unless  => '/usr/bin/mysql -u wordpress -pwordpress',
    command => '/usr/bin/mysql -u root -pvagrant --execute="GRANT ALL PRIVILEGES ON wordpress.* TO \'wordpress\'@\'localhost\' IDENTIFIED BY \'wordpress\'"',
  }
}

class { 'apache::install': }
class { 'php5::install': }
class { 'mysql::install': }
class { 'wordpress::install': }
#class { 'phpmyadmin::install': }