import * as actionCreator from '../actionCreator';
import * as dispatcher from '../dispatcher';
import * as globalContext from '../globalContext';

describe('dispatcher', () => {
  let mockGlobalContext: any;

  beforeEach(() => {
    mockGlobalContext = {
      subscriptions: {},
      dispatchWithMiddleware: jasmine.createSpy('dispatchWithMiddleware'),
      inMutator: false
    };

    spyOn(globalContext, 'getGlobalContext').and.returnValue(mockGlobalContext);
  });

  it('subscribe registers a callback for a given action', () => {
    const actionId = 'testActionId';
    const callback = () => {};

    dispatcher.subscribe(actionId, callback);

    expect(mockGlobalContext.subscriptions[actionId]).toBeDefined();
    expect(mockGlobalContext.subscriptions[actionId].length).toBe(1);
    expect(mockGlobalContext.subscriptions[actionId][0]).toBe(callback);
  });

  it('subscribe can register multiple callbacks', () => {
    const actionId = 'testActionId';
    const callback0 = () => {};
    const callback1 = () => {};

    dispatcher.subscribe(actionId, callback0);
    dispatcher.subscribe(actionId, callback1);

    expect(mockGlobalContext.subscriptions[actionId]).toEqual([callback0, callback1]);
  });

  it('dispatch calls dispatchWithMiddleware', () => {
    const actionMessage = {};

    dispatcher.dispatch(actionMessage);

    expect(mockGlobalContext.dispatchWithMiddleware).toHaveBeenCalledWith(actionMessage);
  });

  it('dispatch calls finalDispatch if dispatchWithMiddleware is null', () => {
    mockGlobalContext.dispatchWithMiddleware = null;
    const actionId = 'testActionId';
    spyOn(actionCreator, 'getPrivateActionId').and.returnValue(actionId);

    const callback = jasmine.createSpy('callback0');
    mockGlobalContext.subscriptions[actionId] = [callback];

    dispatcher.dispatch({});

    expect(callback).toHaveBeenCalled();
  });

  it('dispatch throws if called within a mutator', () => {
    mockGlobalContext.inMutator = true;

    expect(() => {
      dispatcher.dispatch({});
    }).toThrow();
  });

  it('finalDispatch calls all subscribers for a given action', () => {
    const actionMessage = {};
    const actionId = 'testActionId';
    spyOn(actionCreator, 'getPrivateActionId').and.returnValue(actionId);

    const callback0 = jasmine.createSpy('callback0');
    const callback1 = jasmine.createSpy('callback1');
    mockGlobalContext.subscriptions[actionId] = [callback0, callback1];

    dispatcher.finalDispatch(actionMessage);

    expect(callback0).toHaveBeenCalledWith(actionMessage);
    expect(callback1).toHaveBeenCalledWith(actionMessage);
  });

  it('finalDispatch handles the case where there are no subscribers', () => {
    spyOn(actionCreator, 'getPrivateActionId').and.returnValue('testActionId');

    expect(() => {
      dispatcher.finalDispatch({});
    }).not.toThrow();
  });

  it('if one subscriber returns a Promise, finalDispatch returns it', () => {
    const actionId = 'testActionId';
    spyOn(actionCreator, 'getPrivateActionId').and.returnValue(actionId);

    const promise = Promise.resolve();
    const callback = () => promise;
    mockGlobalContext.subscriptions[actionId] = [callback];

    const returnValue = dispatcher.finalDispatch({});

    expect(returnValue).toBe(promise);
  });

  it('if multiple subscribers returns Promises, finalDispatch returns an aggregate Promise', () => {
    const actionId = 'testActionId';
    spyOn(actionCreator, 'getPrivateActionId').and.returnValue(actionId);

    const promise1 = Promise.resolve();
    const callback1 = () => promise1;
    const promise2 = Promise.resolve();
    const callback2 = () => promise2;
    mockGlobalContext.subscriptions[actionId] = [callback1, callback2];

    const aggregatePromise = Promise.resolve();
    spyOn(Promise, 'all').and.returnValue(aggregatePromise);

    const returnValue = dispatcher.finalDispatch({});

    expect(Promise.all).toHaveBeenCalledWith([promise1, promise2]);
    expect(returnValue).toBe(aggregatePromise);
  });
});