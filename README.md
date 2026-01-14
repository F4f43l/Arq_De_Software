Principios Solid

O projeto implementa um sistema de geração de relatórios fictícios com envio de e-mail e logs, 
aplicando os princípios SOLID, especialmente a Inversão de Dependência (DIP) e Inversão de Controle (IoC) com a biblioteca InversifyJS.
A aplicação altera seu comportamento (dev/prod) baseada no ambiente e é dividida em camadas para garantir baixo acoplamento.

Comandos:
npm init -y
npm install typescript ts-node --save-dev
npx tsc --init
npm install --save-dev @types/node
npm install @faker-js/faker
npm install winston nodemailer dotenv
npm install --save-dev @types/nodemailer
npm install inversify reflect-metadata

Para executar:
npx ts-node src/main.ts

