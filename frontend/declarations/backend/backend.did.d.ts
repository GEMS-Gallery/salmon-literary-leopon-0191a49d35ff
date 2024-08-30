import type { Principal } from '@dfinity/principal';
import type { ActorMethod } from '@dfinity/agent';
import type { IDL } from '@dfinity/candid';

export interface ExpenseCategory { 'category' : string, 'amount' : bigint }
export interface Investment {
  'trend' : number,
  'value' : bigint,
  'name' : string,
}
export type Result = { 'ok' : bigint } |
  { 'err' : string };
export interface Transaction {
  'description' : string,
  'timestamp' : bigint,
  'amount' : bigint,
}
export interface _SERVICE {
  'addFunds' : ActorMethod<[bigint], Result>,
  'getBalance' : ActorMethod<[], bigint>,
  'getExpensesData' : ActorMethod<[], Array<ExpenseCategory>>,
  'getInvestments' : ActorMethod<[], Array<Investment>>,
  'getRecentTransactions' : ActorMethod<[], Array<Transaction>>,
  'getSavingsGoalData' : ActorMethod<[], [bigint, bigint]>,
}
export declare const idlFactory: IDL.InterfaceFactory;
export declare const init: (args: { IDL: typeof IDL }) => IDL.Type[];
