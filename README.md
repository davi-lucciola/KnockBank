<div style="display: flex; gap: 8px;">

# Knock Bank

<span style="margin-top: 4px">

![KnockBankLogo](./assets/knock_bank_logo.svg)

</span>
</div>

O KnockBank é uma plataforma bancaria que possibilita que os seus usuários realizem transações de deposito, saque e trânsferência para outras contas na plataforma, também disponibilizando um grafico de vizualização de entradas e saidas totais por mês do ano corrente.

Projeto Realizado inspirado em um teste técnico para Desenvolvedor Full Stack Pleno (Flask + React)

## Design

O prototipo inicial foi feito pelo [Not39](https://github.com/NOT39) em um projeto que ele chegou a prototipar para a gente implementar, mas nunca de fato realizamos, então peguei o modelo e adptei a ui para essa aplicação.

Veja aqui no [Figma](https://www.figma.com/design/1toXDiygpjzpXCa8f6FBWY/KnockBank)

O Design foi feito para ser implementando de forma responsiva, atendendo dispositivos desktop e mobile.

### Desktop

![HomeDesktop](./assets/home_desktop.png)
![DashboardDesktop](./assets/dashboard_desktop.png)

### Mobile

<center>
<div style="display: flex; gap: 8px;">

<img src="./assets/dashboard_mobile.png" height="500">
<img src="./assets/home_mobile.png" height="500">

</div>
</center>

## System Design

WORK IN PROGRESS
(com pipelines de testes, build e deploy...)

## Tecnologias

### Frontend

![TypeScript](https://img.shields.io/badge/typescript-%23007ACC.svg?style=for-the-badge&logo=typescript&logoColor=white)
![Next JS](https://img.shields.io/badge/Next-black?style=for-the-badge&logo=next.js&logoColor=white)
![React Hook Form](https://img.shields.io/badge/React%20Hook%20Form-%23EC5990.svg?style=for-the-badge&logo=reacthookform&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/tailwindcss-%2338B2AC.svg?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Docker](https://img.shields.io/badge/docker-%230db7ed.svg?style=for-the-badge&logo=docker&logoColor=white)

### Backend (API)

![Python](https://img.shields.io/badge/python-3670A0?style=for-the-badge&logo=python&logoColor=ffdd54)
![Flask](https://img.shields.io/badge/flask-%23000.svg?style=for-the-badge&logo=flask&logoColor=white)
![MySQL](https://img.shields.io/badge/mysql-4479A1.svg?style=for-the-badge&logo=mysql&logoColor=white)
![Docker](https://img.shields.io/badge/docker-%230db7ed.svg?style=for-the-badge&logo=docker&logoColor=white)

#### Arquitetura

A API foi construida utilizando a arquitetura MVC com camada de Servico (MVC+Service) e foram utilizadas as seguintes abordagens durante sua construção:

- Injeção de Depêndencias, para melhor isolamento das camadas e facilitação de testes unitários
- Repository Pattern para encapsular lógica de acesso ao banco de dados e garantir atomicidade quando mais de uma entidade está sendo alterada.
- Builder Pattern, para montar objetos paginados e converter as entidades para JSON.
- Service encapsulando as regras de negócio, que através da injeção de dependencia dos repositories facilita os testes unitários.

WORK IN PROGRESS...
