import xs from 'xstream';
import {div, form, label, input, h2, p} from '@cycle/dom';

export default function main(sources) {

  const count$ = sources.HTTP
    .select('search')
    .flatten()
    .map(res => res.body.results)
    .startWith(0);

  const query$ = sources.DOM
    .select('input[name="query"]')
    .events('input')
    .map(ev => ev.target.value)
    .startWith('');

  const submit$ = sources.DOM
    .select('form.search')
    .events('submit');

  const dom$ = xs.combine(query$, count$).map(([query, count]) =>

    form('.search', [
      h2(`You typed: ${query}`),
      p(`We found ${count} results`),
      div('.query', [
        label('Query:'),
        input({attrs: {type: 'text', name: 'query'}})
      ]),
      input({attrs: {type: 'submit'}}, 'Submit')
    ])

  );

  const request$ = submit$
    .map(ev => {
      ev.preventDefault();
      return query$
    })
    .flatten()
    .map(query => ({
      url: '/search',
      category: 'search',
      method: 'POST',
      send: {query}
    }))

  const sinks = {
    DOM: dom$,
    HTTP: request$
  };

  return sinks;

}
