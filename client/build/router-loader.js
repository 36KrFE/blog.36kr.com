var _ = require('lodash');

module.exports = function(source) {
  const matchImport = [];
  const modulePrefix = 'module';
  const importTable = {};
  let moduleId = 0;
  source = source.replace(/\(\)[\s]*=>[\s]*import\('(.*)'\)/g, (str, p1, match) => {
    const varName =  `${modulePrefix}${moduleId++}`;
    if (!importTable[p1]) {
      importTable[p1] = varName;
    }
    return importTable[p1];
  });
  var importCodes = _.map(importTable, (value, key) => {
    return `import ${value} from '${key}';`;
  }).join('\n');
  source = importCodes + source;
  return source;
}
