---
title: Настройка сети для docker/podman
date: "20250325"
draft: false
locale: ru
sitemap:
  loc: /archive/how-write-docker-custom-bridge
tags:
  - docker
  - networking
---

## Networking

Docker have a lots of different types:

- none - отсутствие
- host - подключить контейнер напрямую к машине
- macvlan - виртуальный адатер на машине с собственными ip и mac для каждого контейнера. Так контейнеры выглядят в сети как отдельные машины.
- ipvlan - виртуальный адатер на машине с собственным ip, но единым mac для всех контейнеров
- overlay - распределенная сеть между несколькими узлами docker swarm
- bridge (default) - встроенный сетевой мост, докер пропускает трафик из/в хост машину
- bridge (user-defined) - кастомный сетевой мост, докер будет пропускать травик из/в хост машины.

### Inter-Container Communication

DNS - важная фича кастомных мостов, если у нас есть контейнер `appname` и `appname-db`, работающие по `net-appname`, то мы можем указать `appname` подключаться к бд используя `appname-db:5432`, а не напрямую писать адрес и expose порт. Так же можно контролировать размер сети, независимо от lan/wan сети. Дополнительно, с кастомный мостом не нужно беспокоится о портах, т.к. контейнеры распределяться по ip, и все могут использовать один порт, например 80.

```yaml [compose.yaml]
services:
    appname:
    image: ...
    networks:
        - net-appname
        - private

    appname-db:
        image: ...
        networks:
            - private

    swag:
        image: lscr.io/linuxserver/swag:latest
        container_name: swag
        networks:
            - net-appname
        ports:
            - 443:443
            - 80:80

networks:
    net-appname:
        name: net-appname
        ipam:
            config:
                - subnet: 172.17.0.0/24 # 172.17.0.1 - 172.17.0.254
    private:
        name: private
        internal: true
        ipam:
            config:
                - subnet: 172.17.1.0/29 # 172.17.1.1 - 172.20.1.6
```
