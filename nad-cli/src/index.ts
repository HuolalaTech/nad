import { prepareConfigList } from './prepareConfigList';
import { errorHandler } from './errorHandler';
import { processByConfig } from './processByConfig';

Promise.resolve(process.argv)
  .then(prepareConfigList)
  .then((cl) => Promise.all(cl.map((c) => processByConfig(c))))
  .catch(errorHandler);
