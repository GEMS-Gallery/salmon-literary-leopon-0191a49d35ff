import type { Principal } from '@dfinity/principal';
import type { ActorMethod } from '@dfinity/agent';
import type { IDL } from '@dfinity/candid';

export interface ExpenseCategory { 'category' : string, 'amount' : bigint }
export type Result = { 'ok' : bigint } |
  { 'err' : string };
export interface Transaction {
  'description' : [] | [string],
  'timestamp' : bigint,
  'amount' : bigint,
}
export interface _SERVICE {
  'addFunds' : ActorMethod<[bigint], Result>,
  'getBalance' : ActorMethod<[], bigint>,
  'getExpensesData' : ActorMethod<[], Array<ExpenseCategory>>,
  'getRecentTransactions' : ActorMethod<[], Array<Transaction>>,
}
export declare const idlFactory: IDL.InterfaceFactory;
export declare const init: (args: { IDL: typeof IDL }) => IDL.Type[];
