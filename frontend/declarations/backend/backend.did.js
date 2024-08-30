export const idlFactory = ({ IDL }) => {
  const Result = IDL.Variant({ 'ok' : IDL.Int, 'err' : IDL.Text });
  const ExpenseCategory = IDL.Record({
    'category' : IDL.Text,
    'amount' : IDL.Int,
  });
  const Transaction = IDL.Record({
    'description' : IDL.Opt(IDL.Text),
    'timestamp' : IDL.Int,
    'amount' : IDL.Int,
  });
  return IDL.Service({
    'addFunds' : IDL.Func([IDL.Int], [Result], []),
    'getBalance' : IDL.Func([], [IDL.Int], ['query']),
    'getExpensesData' : IDL.Func([], [IDL.Vec(ExpenseCategory)], ['query']),
    'getRecentTransactions' : IDL.Func([], [IDL.Vec(Transaction)], ['query']),
  });
};
export const init = ({ IDL }) => { return []; };
