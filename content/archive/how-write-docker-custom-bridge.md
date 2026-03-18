---
title: Настройка сети для docker/podman
date: "20250325"
draft: true
locale: ru
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

Current network topology:

```mermaid
graph TD;
    subgraph containers [ ]
        direction TB
        swag["swag"]:::container
        appname["appname"]:::container
        appname_db["appname-db"]:::container
    end

    net_appname["172.17.0.0/24<br/>net-appname"]:::net_appname
    internal["172.17.1.0/29<br/>Internal"]:::internal

    internal <-->|172.17.1.3/29| appname
    internal <-->|172.17.1.2/29| appname_db

    net_appname <-->|172.17.0.3/24| appname
    net_appname <-->|172.17.0.4/24| swag


    classDef container fill:#f8c8d4,stroke:#333,stroke-width:2px;
    classDef internal fill:#c4f8c8,stroke:#333,stroke-width:2px;
    classDef net_appname fill:#c8c8c8c,stroke:#333,stroke-width:2px;
```
