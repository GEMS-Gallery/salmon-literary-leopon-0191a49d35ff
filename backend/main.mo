import Int "mo:base/Int";
import Array "mo:base/Array";
import Float "mo:base/Float";
import Time "mo:base/Time";
import Result "mo:base/Result";
import Text "mo:base/Text";

actor {
  // Stable variables
  stable var balance : Int = 1000000; // $10,000.00 in cents
  stable var transactions : [Transaction] = [];
  stable var expensesData : [ExpenseCategory] = [
    { category = "Food"; amount = 30000 },
    { category = "Transport"; amount = 20000 },
    { category = "Entertainment"; amount = 15000 },
    { category = "Bills"; amount = 35000 }
  ];
  stable var savingsGoal : Int = 1000000; // $10,000.00 in cents
  stable var currentSavings : Int = 500000; // $5,000.00 in cents
  stable var investments : [Investment] = [
    { name = "Tech Stock ETF"; value = 250000; trend = 5.2 },
    { name = "Real Estate Fund"; value = 180000; trend = -1.8 },
    { name = "Cryptocurrency"; value = 50000; trend = 12.5 }
  ];

  // Types
  type Transaction = {
    amount : Int;
    description : Text;
    timestamp : Int;
  };

  type ExpenseCategory = {
    category : Text;
    amount : Int;
  };

  type Investment = {
    name : Text;
    value : Int;
    trend : Float;
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
      description = "Added funds";
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

  // Query to get savings goal data
  public query func getSavingsGoalData() : async (Int, Int) {
    (currentSavings, savingsGoal)
  };

  // Query to get investments data
  public query func getInvestments() : async [Investment] {
    investments
  };

  // Update call to add a new transaction
  public func addTransaction(amount : Int, description : Text) : async Result.Result<(), Text> {
    if (amount == 0) {
      return #err("Amount cannot be zero");
    };
    balance += amount;
    let transaction : Transaction = {
      amount = amount;
      description = description;
      timestamp = Time.now();
    };
    transactions := Array.append(transactions, [transaction]);
    updateExpensesData(description, amount);
    #ok()
  };

  // Update call to add a new investment
  public func addInvestment(name : Text, value : Int, trend : Float) : async Result.Result<(), Text> {
    if (value <= 0) {
      return #err("Investment value must be positive");
    };
    let investment : Investment = {
      name = name;
      value = value;
      trend = trend;
    };
    investments := Array.append(investments, [investment]);
    #ok()
  };

  // Helper function to update expenses data
  private func updateExpensesData(category : Text, amount : Int) {
    expensesData := Array.map(expensesData, func (expense : ExpenseCategory) : ExpenseCategory {
      if (expense.category == category) {
        { category = expense.category; amount = expense.amount + Int.abs(amount) }
      } else {
        expense
      }
    });
  };
}
