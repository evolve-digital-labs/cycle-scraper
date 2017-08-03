import {run} from '@cycle/run';
import {makeDOMDriver} from '@cycle/dom';
import {makeHTTPDriver} from '@cycle/http';
import main from './main';

run(main, {
  DOM: makeDOMDriver('#app'),
  HTTP: makeHTTPDriver()
});
