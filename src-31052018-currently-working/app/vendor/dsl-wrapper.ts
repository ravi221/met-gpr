import remixDSL from 'remix-dsl';
import {Subject} from 'rxjs/Subject';
import {Observable} from 'rxjs/Observable';
import {Subscription} from 'rxjs/Subscription';

/**
 * A wrapper class around the remix-dsl library.
 *
 * Here is a simple example on how to update a model value using this dsl wrapper. (For consistency, we wrap the returned promise with an observable)
 *
 * ```typescript
 * const engine = new DSL();
 * const model = { data: 'someValue' };
 * const meta = { condition: '1 === 1', action: 'this.data = "newValue!"' };
 *
 * const observable = engine.execute('someId', meta, model);
 * observable.subscribe((ctx) => console.log(model.data)); // should log 'newValue!' because DSL preserved reference.
 *
 * ```
 *
 * This class can be extended to have custom functions (tokens) registered to be used within the dsl meta configuration.
 *
 * ```typescript
 * const engine = new DSL();
 * const myAwesomeFunction => () { ... };
 *
 * engine.register('myAwesomeFn', myAwesomeFunction);
 *
 * // now you can use your registered function in the dsl metadata.
 * const meta = { condition: '1 === 1', action: 'myAwesomeFn()' };
 *
 * // you can subscribe to the rules observable to know when any rules are ran
 * const subscription = engine.source.subscribe((result) => {...});
 *
 * ```
 */
export default class DSL {

  /**
   * Private instance of the remix-dsl engine.
   */
  private _dsl = remixDSL();

  /**
   * Private subject to be observed upon.
   * @type {Subject<IObservedRule>}
   */
  private _ruleSubject: Subject<IObservedRule> = new Subject<IObservedRule>();

  /**
   * Since DSL rules are fully async and multiple rules can be executed simultaneously,
   *
   * We keep an map of affected field ids and the returned promise during an execution cycle so that once all are resolved, we can emit an event.
   */
  private _activeRules: Map<string, any> = new Map();

  /**
   * The observable for subscribers to listen in on rule executions.
   * @type {Observable<IObservedRule>}
   */
  source: Observable<IObservedRule> = this._ruleSubject.asObservable();

  /**
   * The default constructor.
   */
  constructor() {
  }

  /**
   * Executes a given rule configuration against the provided context using the remix-dsl engine.
   *
   * NOTE: Remix-DSL preserves the reference to the context you pass in, so we don't track each individual context that's returned from a rule.
   *
   * @param {string} id
   * @param configuration
   * @param context
   * @returns {Observable<IObservedRule>}
   */
  execute(id: string, configuration: any, context: any): Observable<IObservedRule> {
    try {
      const rule = this._dsl.compile(configuration);
      const promise = rule(context);
      this._activeRules.set(id, promise);

      const subscription: Subscription = Observable.forkJoin(Array.from(this._activeRules.values())).subscribe((resolves) => {
        const observedRule: IObservedRule = {ids: Array.from(this._activeRules.keys()), context: context};
        this._activeRules.clear();
        subscription.unsubscribe();
        this._ruleSubject.next(observedRule);
      });
    } catch (exception) {
      this._ruleSubject.error(exception);
    }
    return this.source;
  }

  /**
   * Registers a custom token to be used within the remix-dsl engine.
   * @param {string} name
   * @param callback
   */
  register(name: string, callback: any): void {
    this._dsl.register(name, callback);
  }
}

/**
 * Describes the shape of the observed rule object that's provided in the subscription handler.
 */
export interface IObservedRule {
  /**
   * The id of the field(s) that the rule(s) has been defined for and executed on.
   */
  ids: Array<string>;
  /**
   * The new context that was resolved after the rule has executed by the dsl execution engine.
   */
  context: any;
}
