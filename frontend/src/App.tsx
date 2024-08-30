import React, { useState, useEffect } from 'react';
import { backend } from 'declarations/backend';

const App: React.FC = () => {
  const [balance, setBalance] = useState<number>(0);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [expensesData, setExpensesData] = useState<any[]>([]);
  const [savingsGoal, setSavingsGoal] = useState<{current: number, goal: number}>({current: 0, goal: 0});
  const [investments, setInvestments] = useState<any[]>([]);
  const [amount, setAmount] = useState('');
  const [transactionDescription, setTransactionDescription] = useState('');
  const [investmentName, setInvestmentName] = useState('');
  const [investmentValue, setInvestmentValue] = useState('');
  const [investmentTrend, setInvestmentTrend] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    const balanceResult = await backend.getBalance();
    setBalance(Number(balanceResult));

    const transactionsResult = await backend.getRecentTransactions();
    setTransactions(transactionsResult);

    const expensesResult = await backend.getExpensesData();
    setExpensesData(expensesResult);

    const savingsGoalResult = await backend.getSavingsGoalData();
    setSavingsGoal({current: Number(savingsGoalResult[0]), goal: Number(savingsGoalResult[1])});

    const investmentsResult = await backend.getInvestments();
    setInvestments(investmentsResult);
  };

  const handleAddFunds = async () => {
    if (amount && Number(amount) > 0) {
      const result = await backend.addFunds(BigInt(Math.floor(Number(amount) * 100)));
      if ('ok' in result) {
        setBalance(Number(result.ok));
        setAmount('');
        fetchData();
      } else {
        alert('Error adding funds: ' + result.err);
      }
    }
  };

  const handleAddTransaction = async () => {
    if (amount && transactionDescription) {
      const result = await backend.addTransaction(BigInt(Math.floor(Number(amount) * 100)), transactionDescription);
      if ('ok' in result) {
        setAmount('');
        setTransactionDescription('');
        fetchData();
      } else {
        alert('Error adding transaction: ' + result.err);
      }
    }
  };

  const handleAddInvestment = async () => {
    if (investmentName && investmentValue && investmentTrend) {
      const result = await backend.addInvestment(investmentName, BigInt(Math.floor(Number(investmentValue) * 100)), Number(investmentTrend));
      if ('ok' in result) {
        setInvestmentName('');
        setInvestmentValue('');
        setInvestmentTrend('');
        fetchData();
      } else {
        alert('Error adding investment: ' + result.err);
      }
    }
  };

  const openModal = (modalId: string) => {
    const modal = document.getElementById(modalId);
    if (modal) modal.style.display = 'block';
  };

  const closeModal = (modalId: string) => {
    const modal = document.getElementById(modalId);
    if (modal) modal.style.display = 'none';
  };

  useEffect(() => {
    const expensesChart = new Chart(
      document.getElementById('expensesChart') as HTMLCanvasElement,
      {
        type: 'doughnut',
        data: {
          labels: expensesData.map(item => item.category),
          datasets: [{
            data: expensesData.map(item => Number(item.amount) / 100),
            backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0'],
            hoverBackgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0'],
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
        }
      }
    );

    const incomeChart = new Chart(
      document.getElementById('incomeChart') as HTMLCanvasElement,
      {
        type: 'line',
        data: {
          labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
          datasets: [{
            label: 'Income',
            data: [2000, 3000, 2500, 3500, 3000, 3200, 3800, 4000, 3500, 3700, 4200, 4500],
            borderColor: '#10b981',
            backgroundColor: 'rgba(16, 185, 129, 0.2)',
            tension: 0.1,
            fill: true
          }]
        },
        options: {
          responsive: true,
          maintainAspectRatio: false,
          scales: {
            y: {
              beginAtZero: true
            }
          }
        }
      }
    );

    return () => {
      expensesChart.destroy();
      incomeChart.destroy();
    };
  }, [expensesData]);

  useEffect(() => {
    const savingsProgress = document.getElementById('savingsProgress');
    if (savingsProgress) {
      const percentage = (savingsGoal.current / savingsGoal.goal) * 100;
      savingsProgress.style.width = `${percentage}%`;
    }
  }, [savingsGoal]);

  return (
    <>
      <div className="sidebar">
        <div className="logo"><i className="fas fa-coins pulse"></i></div>
        <nav>
          <a href="#" className="nav-item active" title="Dashboard">
            <i className="fas fa-home"></i>
            <span>Dashboard</span>
          </a>
          <a href="#" className="nav-item" title="Transactions">
            <i className="fas fa-exchange-alt"></i>
            <span>Transactions</span>
          </a>
          <a href="#" className="nav-item" title="Investments">
            <i className="fas fa-chart-line"></i>
            <span>Investments</span>
          </a>
          <a href="#" className="nav-item" title="Savings">
            <i className="fas fa-piggy-bank"></i>
            <span>Savings</span>
          </a>
          <a href="#" className="nav-item" title="Settings">
            <i className="fas fa-cog"></i>
            <span>Settings</span>
          </a>
        </nav>
      </div>

      <div className="main-content">
        <header className="header">
          <div className="greeting">Welcome back, Alex! 👋</div>
          <div className="search-bar">
            <i className="fas fa-search"></i>
            <input type="text" placeholder="Search transactions..." />
          </div>
        </header>

        <div className="grid">
          <div className="card">
            <h2><i className="fas fa-wallet"></i> Total Balance</h2>
            <div className="balance" id="balance">${(balance / 100).toFixed(2)}</div>
            <button onClick={() => openModal('addFundsModal')}><i className="fas fa-plus"></i> Add Funds</button>
          </div>
          <div className="card">
            <h2><i className="fas fa-chart-pie"></i> Expenses</h2>
            <div className="chart-container">
              <canvas id="expensesChart"></canvas>
            </div>
          </div>
          <div className="card">
            <h2><i className="fas fa-chart-line"></i> Income Trend</h2>
            <div className="chart-container">
              <canvas id="incomeChart"></canvas>
            </div>
          </div>
          <div className="card">
            <h2><i className="fas fa-piggy-bank"></i> Savings Goal</h2>
            <div className="balance">${(savingsGoal.current / 100).toFixed(2)} / ${(savingsGoal.goal / 100).toFixed(2)}</div>
            <div className="savings-goal">
              <div className="savings-goal-bar">
                <div className="savings-goal-progress" id="savingsProgress"></div>
              </div>
              <span>{((savingsGoal.current / savingsGoal.goal) * 100).toFixed(0)}%</span>
            </div>
          </div>
        </div>

        <div className="card" style={{marginTop: '25px'}}>
          <h2><i className="fas fa-exchange-alt"></i> Recent Transactions</h2>
          <button onClick={() => openModal('addTransactionModal')}><i className="fas fa-plus"></i> Add Transaction</button>
          <table id="transactionsTable">
            <thead>
              <tr>
                <th>Date</th>
                <th>Description</th>
                <th>Amount</th>
              </tr>
            </thead>
            <tbody>
              {transactions.map((transaction, index) => (
                <tr key={index}>
                  <td>{new Date(Number(transaction.timestamp) / 1000000).toLocaleDateString()}</td>
                  <td>{transaction.description}</td>
                  <td className={`transaction-amount ${Number(transaction.amount) >= 0 ? 'positive' : 'negative'}`}>
                    ${Math.abs(Number(transaction.amount) / 100).toFixed(2)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="card" style={{marginTop: '25px'}}>
          <h2><i className="fas fa-chart-line"></i> Investments</h2>
          <button onClick={() => openModal('addInvestmentModal')}><i className="fas fa-plus"></i> Add Investment</button>
          <div id="investmentsList">
            {investments.map((investment, index) => (
              <div key={index} className="investment-item">
                <span className="investment-name"><i className="fas fa-chart-line"></i> {investment.name}</span>
                <span className="investment-value">
                  ${(Number(investment.value) / 100).toFixed(2)}
                  <span className={investment.trend >= 0 ? 'trend-up' : 'trend-down'}>
                    <i className={`fas fa-caret-${investment.trend >= 0 ? 'up' : 'down'}`}></i>
                    {Math.abs(investment.trend).toFixed(1)}%
                  </span>
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div id="addFundsModal" className="modal">
        <div className="modal-content">
          <span className="close" onClick={() => closeModal('addFundsModal')}>&times;</span>
          <h2><i className="fas fa-plus-circle"></i> Add Funds</h2>
          <form id="addFundsForm" onSubmit={(e) => { e.preventDefault(); handleAddFunds(); }}>
            <input type="number" id="fundAmount" placeholder="Enter amount" value={amount} onChange={(e) => setAmount(e.target.value)} required />
            <button type="submit"><i className="fas fa-check"></i> Add</button>
          </form>
        </div>
      </div>

      <div id="addTransactionModal" className="modal">
        <div className="modal-content">
          <span className="close" onClick={() => closeModal('addTransactionModal')}>&times;</span>
          <h2><i className="fas fa-plus-circle"></i> Add Transaction</h2>
          <form id="addTransactionForm" onSubmit={(e) => { e.preventDefault(); handleAddTransaction(); }}>
            <input type="number" placeholder="Enter amount" value={amount} onChange={(e) => setAmount(e.target.value)} required />
            <input type="text" placeholder="Enter description" value={transactionDescription} onChange={(e) => setTransactionDescription(e.target.value)} required />
            <button type="submit"><i className="fas fa-check"></i> Add</button>
          </form>
        </div>
      </div>

      <div id="addInvestmentModal" className="modal">
        <div className="modal-content">
          <span className="close" onClick={() => closeModal('addInvestmentModal')}>&times;</span>
          <h2><i className="fas fa-plus-circle"></i> Add Investment</h2>
          <form id="addInvestmentForm" onSubmit={(e) => { e.preventDefault(); handleAddInvestment(); }}>
            <input type="text" placeholder="Enter investment name" value={investmentName} onChange={(e) => setInvestmentName(e.target.value)} required />
            <input type="number" placeholder="Enter investment value" value={investmentValue} onChange={(e) => setInvestmentValue(e.target.value)} required />
            <input type="number" placeholder="Enter trend percentage" value={investmentTrend} onChange={(e) => setInvestmentTrend(e.target.value)} required />
            <button type="submit"><i className="fas fa-check"></i> Add</button>
          </form>
        </div>
      </div>
    </>
  );
};

export default App;
