import Int "mo:base/Int";
import Array "mo:base/Array";
import Float "mo:base/Float";
import Time "mo:base/Time";
import Result "mo:base/Result";
import Text "mo:base/Text";

actor {
  // Stable variables
  stable var balance : Int = 0;
  stable var transactions : [Transaction] = [];
  stable var expensesData : [ExpenseCategory] = [
    { category = "Food"; amount = 0 },
    { category = "Transport"; amount = 0 },
    { category = "Entertainment"; amount = 0 },
    { category = "Bills"; amount = 0 }
  ];

  // Types
  type Transaction = {
    amount : Int;
    description : ?Text;
    timestamp : Int;
  };

  type ExpenseCategory = {
    category : Text;
    amount : Int;
  };

  // Query to get current balance
  public query func getBalance() : async Int {
    balance
  };

  // Update call to add funds
  public func addFunds(amount : Int) : async Result.Result<Int, Text> {
    if (amount <= 0) {
      return #err("Amount must be positive");
    };
    balance += amount;
    let transaction : Transaction = {
      amount = amount;
      description = ?"Added funds";
      timestamp = Time.now();
    };
    transactions := Array.append(transactions, [transaction]);
    #ok(balance)
  };

  // Query to get recent transactions
  public query func getRecentTransactions() : async [Transaction] {
    Array.reverse(Array.take(transactions, 5))
  };

  // Query to get expenses data
  public query func getExpensesData() : async [ExpenseCategory] {
    expensesData
  };

  // Helper function to update expenses data (simplified for demo)
  private func updateExpensesData(category : Text, amount : Int) {
    expensesData := Array.map(expensesData, func (expense : ExpenseCategory) : ExpenseCategory {
      if (expense.category == category) {
        { category = expense.category; amount = expense.amount + amount }
      } else {
        expense
      }
    });
  };
}
