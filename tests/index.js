import sinon from 'sinon';

import StackManager from '../src/StackManager';
import StackConfig from '../src/StackConfig';

beforeEach(function () {
  this.sandbox = sinon.sandbox.create();
});

afterEach(function () {
  this.sandbox.restore();
});

//

describe('Stacker', function () {
  it('should work', async function () {
    const config = await StackConfig.load('/Users/kingaiakab/Projects/stacker-docker-experiments/test-project');
    const manager = new StackManager(config);

    manager.setBuildPath('/tmp/test-project');
    manager.setIpAddress('127.20.17.9');
    manager.setTarget('prod');

    await manager.build();
  });
});
