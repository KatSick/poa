// @ts-check

import { __resetGlobalContext } from '@poa/satcheljs';
import { computed } from 'mobx';

let currentStore = {};
let currentEnvironment = {};
let currentActions = {};
let middlewares = [];

/**
 * Set new environment to globals
 * @private
 * @param {*} newEnv
 */
export function setEnv(newEnv) {
  currentEnvironment = newEnv;
  return getEnv();
}

/**
 * Get current environment
 * @private
 */
export function getEnv() {
  return currentEnvironment;
}

/**
 * Set new store to globals
 * @private
 * @param {*} newStore
 */
export function setStore(newStore) {
  currentStore = newStore;
}

/**
 * Get current store
 * @private
 */
export function getStore() {
  return currentStore;
}

/**
 * Set new actions to globals
 * @private
 * @param {*} newActions
 */
export function setActions(newActions) {
  currentActions = newActions;
  return getActions();
}

/**
 * Get current actions
 * @private
 */
export function getActions() {
  return currentActions;
}

/**
 * Middlewares to apply
 * @private
 * @param {Array} mds middlewares
 */
export function addMiddleware(...mds) {
  middlewares.push(...mds);
}

/**
 * Get middlewares
 * @private
 */
export function getMiddlewares() {
  return middlewares;
}

/**
 * Wrapper over computed to provide store
 */
export function selector(fn) {
  return computed(() => fn(getStore()));
}

export function resetGlobals() {
  setActions({});
  setStore({});
  setEnv({});

  middlewares = [];
  __resetGlobalContext();
}
