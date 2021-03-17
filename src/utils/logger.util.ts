export const logger = (type: string, message: string) => {
  console.log(`[${ new Date().toLocaleString('ru') }]: ${ type.toUpperCase() }${ message }`);
  console.log('\n');
};
