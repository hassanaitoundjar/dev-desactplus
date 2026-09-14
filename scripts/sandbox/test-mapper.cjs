const ts = require('typescript');
const fs = require('fs');
const mapperCode = fs.readFileSync('app/api/mappers/product.mapper.ts', 'utf8');
const compiled = ts.transpileModule(mapperCode, { compilerOptions: { module: ts.ModuleKind.CommonJS }});
fs.writeFileSync('test-mapper.js', compiled.outputText);

const { mapApiProductToDomain } = require('./test-mapper.js');
console.log(mapApiProductToDomain({ id: "1", variants: [], options: [] }).featured);
