import chalk, { ChalkInstance } from 'chalk';
import log from 'loglevel';
import prefix from 'loglevel-plugin-prefix';

const colors: { [key: string]: ChalkInstance } = {
  TRACE: chalk.magenta,
  DEBUG: chalk.cyan,
  INFO: chalk.blue,
  WARN: chalk.yellow,
  ERROR: chalk.red
};

log.enableAll();

prefix.reg(log);

prefix.apply(log, {
  format(level, name, timestamp) {
    const trace = generateTrace();
    const coloredTimesatmp = chalk.gray(`[${timestamp}]`);
    const coloredLevel = colors[level.toUpperCase()](level);
    const coloredTrace = chalk.green(`${trace}:`);
    return `${coloredTimesatmp} ${coloredLevel} ${coloredTrace}`;
  }
});

export { log as logger };

function generateTrace() {
  try {
    const elementsToTake = 4;
    const error = new Error().stack?.split('\n');
    if (error && error.length > elementsToTake) {
      for (let i = 0; i < elementsToTake; i++) {
        error.shift();
      }

      const names = [];
      const errorCopy = [...error];
      for (let i = error.length - 1; i >= 0; i--) {
        const line = error[i];
        if (!line.includes('./src')) {
          errorCopy.pop();
          continue;
        }
        const name = error[i].split('at ')[1].split(' ')[0];
        if (name != 'Object.<anonymous>') {
          names.push(name);
        }
      }
      const file = errorCopy[errorCopy.length - 1].split('./src').pop()?.split(':')[0];
      return chalk.gray(`(${file}:${names.join('->')})`);
    }
  } catch (error) {
    return '';
  }
}
