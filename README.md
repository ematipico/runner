# Runner

Handles multiple async operations with caching

[![Build Status][build-status-azure]][build-status-azure-url]


## Installation

With `yarn`

```bash
yarn add @ematipico/runner
```

With `npm`
```bash
npm i -D @ematipico/runner
```


## Usage

```javascript
import createRunner from '@ematipico/runner';

const runner = createRunner();
const getPosts = fetch('https://url/to/posts');
const getPosts2 = fetch('https://url/to/posts');

const result = runner.run(getPosts);
const result2 = runner.run(getPosts2); // the async operation gets run once
```


[build-status-azure]: https://myburning.visualstudio.com/runner/_apis/build/status/ematipico.terraform-nextjs-plugin?branchName=master
[build-status-azure-url]: https://myburning.visualstudio.com/runner/_build/latest?definitionId=1&branchName=master
