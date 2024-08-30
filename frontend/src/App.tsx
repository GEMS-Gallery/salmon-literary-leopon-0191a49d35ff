import React, { useState, useEffect } from 'react';
import { backend } from 'declarations/backend';
import { Box, Container, Grid, Typography, Button, Modal, TextField } from '@mui/material';
import { Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';

ChartJS.register(ArcElement, Tooltip, Legend);

const App: React.FC = () => {
  const [balance, setBalance] = useState<number>(0);
  const [transactions, setTransactions] = useState<any[]>([]);
  const [expensesData, setExpensesData] = useState<any[]>([]);
  const [openModal, setOpenModal] = useState(false);
  const [amount, setAmount] = useState('');

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
  };

  const handleAddFunds = async () => {
    if (amount && Number(amount) > 0) {
      const result = await backend.addFunds(BigInt(Math.floor(Number(amount) * 100)));
      if ('ok' in result) {
        setBalance(Number(result.ok) / 100);
        setAmount('');
        setOpenModal(false);
        fetchData();
      } else {
        alert('Error adding funds: ' + result.err);
      }
    }
  };

  const chartData = {
    labels: expensesData.map(item => item.category),
    datasets: [
      {
        data: expensesData.map(item => Number(item.amount) / 100),
        backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0'],
        hoverBackgroundColor: ['#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0'],
      },
    ],
  };

  return (
    <Container maxWidth="lg" sx={{ mt: 4 }}>
      <Typography variant="h4" gutterBottom>
        Vance - Smart Finance
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} md={6}>
          <Box sx={{ p: 2, bgcolor: 'background.paper', borderRadius: 2, boxShadow: 1 }}>
            <Typography variant="h6">Total Balance</Typography>
            <Typography variant="h4">${(balance / 100).toFixed(2)}</Typography>
            <Button variant="contained" onClick={() => setOpenModal(true)} sx={{ mt: 2 }}>
              Add Funds
            </Button>
          </Box>
        </Grid>
        <Grid item xs={12} md={6}>
          <Box sx={{ p: 2, bgcolor: 'background.paper', borderRadius: 2, boxShadow: 1 }}>
            <Typography variant="h6">Expenses</Typography>
            <Doughnut data={chartData} />
          </Box>
        </Grid>
        <Grid item xs={12}>
          <Box sx={{ p: 2, bgcolor: 'background.paper', borderRadius: 2, boxShadow: 1 }}>
            <Typography variant="h6">Recent Transactions</Typography>
            {transactions.map((transaction, index) => (
              <Box key={index} sx={{ mt: 1 }}>
                <Typography>
                  ${(Number(transaction.amount) / 100).toFixed(2)} - {transaction.description[0] || 'N/A'}
                </Typography>
              </Box>
            ))}
          </Box>
        </Grid>
      </Grid>
      <Modal open={openModal} onClose={() => setOpenModal(false)}>
        <Box sx={{ position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: 400, bgcolor: 'background.paper', boxShadow: 24, p: 4, borderRadius: 2 }}>
          <Typography variant="h6" component="h2" gutterBottom>
            Add Funds
          </Typography>
          <TextField
            label="Amount"
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            fullWidth
            sx={{ mb: 2 }}
          />
          <Button variant="contained" onClick={handleAddFunds} fullWidth>
            Add
          </Button>
        </Box>
      </Modal>
    </Container>
  );
};

export default App;
