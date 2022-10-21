#!/usr/bin/env node
const program = require('commander');
const inquirer = require('inquirer');
const chalk = require('chalk');

const { version } = require('./package.json');
const { sequelize, Wallet } = require('./models');

program.version(version, '-v, --version').usage('[options]');

// 수입
program
  .command('revenue <money> <desc>')
  .description('수입을 기록합니다.')
  .action(async (money, desc) => {
    await sequelize.sync();
    await Wallet.create({
      money: parseInt(money, 10),
      desc,
      type: true,
    });
    console.log(chalk.green(`수입: ${money}원`));
    await sequelize.close();
  });

// 지출
program
  .command('expense <money> <desc>')
  .description('지출을 기록합니다.')
  .action(async (money, desc) => {
    await sequelize.sync();
    await Wallet.create({
      money: parseInt(money, 10),
      desc,
      type: false,
    });
    console.log(chalk.green(`지출: ${money}원`));
    await sequelize.close();
  });

// 잔액
program
  .command('balance')
  .description('잔액을 표시합니다.')
  .action(async () => {
    await sequelize.sync();
    const logs = await Wallet.findAll({});
    const revenue = logs
      .filter((l) => l.type === true)
      .reduce((acc, cur) => acc + cur.money, 0);
    const expense = logs
      .filter((l) => l.type === false)
      .reduce((acc, cur) => acc + cur.money, 0);
    console.log(chalk.green(`잔액: ${revenue - expense}원`));
    await sequelize.close();
  });

// program.command('*').action(() => {
//   console.log(chalk.bold.red('알 수 없는 명령어입니다.'));
// });

program.action((cmd, args) => {
  if (args) {
    console.log(chalk.bold.red('해당 명령어를 찾을 수 없습니다.'));
    program.help();
  } else {
    inquirer
      .prompt([
        {
          type: 'list',
          name: 'type',
          message: '목록을 선택하세요.',
          choices: ['수입', '지출', '잔액'],
        },
        {
          type: 'input',
          name: 'money',
          message: '금액을 입력하세요.',
          default: '0',
        },
        {
          type: 'input',
          name: 'desc',
          message: '내역을 입력하세요.',
          default: '.',
        },
        {
          type: 'confirm',
          name: 'confirm',
          message: '생성하시겠습니까?',
        },
      ])
      .then(async (answers) => {
        if (answers.confirm) {
          if (answers.type === '수입') {
            await sequelize.sync();
            await Wallet.create({
              money: parseInt(answers.money, 10),
              desc: answers.desc,
              type: true,
            });
            console.log(chalk.green(`수입: ${answers.money}원`));
            await sequelize.close();
          } else if (answers.type === '지출') {
            await sequelize.sync();
            await Wallet.create({
              money: parseInt(answers.money, 10),
              desc: answers.desc,
              type: false,
            });
            console.log(chalk.green(`지출: ${answers.money}원`));
            await sequelize.close();
          } else {
            await sequelize.sync();
            const logs = await Wallet.findAll({});
            const revenue = logs
              .filter((l) => l.type === true)
              .reduce((acc, cur) => acc + cur.money, 0);
            const expense = logs
              .filter((l) => l.type === false)
              .reduce((acc, cur) => acc + cur.money, 0);
            console.log(chalk.green(`잔액: ${revenue - expense}원`));
            await sequelize.close();
          }
        }
      });
  }
});

program.parse(process.argv);
