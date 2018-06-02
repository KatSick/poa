import { setStore, getStore, getActions, getEnv } from './globals';
import { createStore, asyncAction, mutator, orchestrator } from '@poa/satcheljs';
import { getRouter } from '@poa/router';
import ActionMessage from 'poa-satcheljs/src/interfaces/ActionMessage';
import ActionCreator from 'poa-satcheljs/src/interfaces/ActionCreator';
import MutatorFunction from 'poa-satcheljs/src/interfaces/MutatorFunction';
import OrchestratorFunction from 'poa-satcheljs/src/interfaces/OrchestratorFunction';

export function createInitialStore(state: any) {
  setStore(createStore('poaStore', state)());
  return getStore();
}

export function createAction<
  T extends ActionMessage = {},
  TActionCreator extends ActionCreator<T> = () => T
>(actionType: string, target?: TActionCreator): TActionCreator {
  return asyncAction(actionType, target);
}

export type PoaMutatorFunction<T extends ActionMessage> = (
  actionMessage: T,
  config: { store: any }
) => void;
export function addMutator<T extends ActionMessage>(
  actionCreator: ActionCreator<T>,
  target: PoaMutatorFunction<T>
) {
  return mutator(actionCreator, actionMessage => {
    target(actionMessage, { store: getStore() });
  });
}

export type PoaOrchestratorFunction<T extends ActionMessage> = (
  actionMessage: T,
  config: { actions: any; env: any; store: any; router: any }
) => void | Promise<any>;

export function addSideEffects<T extends ActionMessage>(
  actionCreator: ActionCreator<T>,
  target: PoaOrchestratorFunction<T>
) {
  return orchestrator(actionCreator, actionMessage => {
    return target(actionMessage, {
      actions: getActions(),
      env: getEnv(),
      store: getStore(),
      router: getRouter()
    });
  });
}