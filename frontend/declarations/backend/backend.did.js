export const idlFactory = ({ IDL }) => {
  const Result_1 = IDL.Variant({ 'ok' : IDL.Int, 'err' : IDL.Text });
  const Result = IDL.Variant({ 'ok' : IDL.Null, 'err' : IDL.Text });
  const ExpenseCategory = IDL.Record({
    'category' : IDL.Text,
    'amount' : IDL.Int,
  });
  const Investment = IDL.Record({
    'trend' : IDL.Float64,
    'value' : IDL.Int,
    'name' : IDL.Text,
  });
  const Transaction = IDL.Record({
    'description' : IDL.Text,
    'timestamp' : IDL.Int,
    'amount' : IDL.Int,
  });
  return IDL.Service({
    'addFunds' : IDL.Func([IDL.Int], [Result_1], []),
    'addInvestment' : IDL.Func([IDL.Text, IDL.Int, IDL.Float64], [Result], []),
    'addTransaction' : IDL.Func([IDL.Int, IDL.Text], [Result], []),
    'getBalance' : IDL.Func([], [IDL.Int], ['query']),
    'getExpensesData' : IDL.Func([], [IDL.Vec(ExpenseCategory)], ['query']),
    'getInvestments' : IDL.Func([], [IDL.Vec(Investment)], ['query']),
    'getRecentTransactions' : IDL.Func([], [IDL.Vec(Transaction)], ['query']),
    'getSavingsGoalData' : IDL.Func([], [IDL.Int, IDL.Int], ['query']),
  });
};
export const init = ({ IDL }) => { return []; };
