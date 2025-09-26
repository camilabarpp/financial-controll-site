const { randomUUID } = require('crypto');
const jsonServer = require('json-server');

const server  = jsonServer.create();
const router  = jsonServer.router('db.json');
const middle  = jsonServer.defaults();

server.use(middle);
server.use(jsonServer.bodyParser);

// User endpoint ------------------------------------------------------------------
server.post('/login', (req, res) => {
  const { email, password } = req.body;

  // procura usuário no db.json
  const user = router.db
    .get('users')
    .find({ email, password })
    .value();

  if (user) {
    return res.json({ token: user.token });
  }
  return res.status(401).json({ message: 'Credenciais inválidas' });
});

server.get('/me', (req, res) => {
  // Espera o token no header Authorization: Bearer <token>
  const auth = req.headers.authorization;
  if (!auth || !auth.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Token não enviado' });
  }
  const token = auth.replace('Bearer ', '');
  const user = router.db.get('users').find({ token }).value();
  if (user) {
    // Não retornar senha nem token
    const { password, token, ...userData } = user;
    return res.json(userData);
  }
  return res.status(401).json({ message: 'Email ou senha inválidos' });
});

server.post('/users/change-password', (req, res) => {
  const auth = req.headers.authorization;
  if (!auth || !auth.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Token não enviado' });
  }

  const token = auth.replace('Bearer ', '');
  const { currentPassword, newPassword } = req.body;

  // Encontra o usuário pelo token
  const user = router.db.get('users').find({ token }).value();

  if (!user) {
    return res.status(401).json({ message: 'Email ou senha inválidos' });
  }

  // Verifica se a senha atual está correta
  if (user.password !== currentPassword) {
    return res.status(401).json({ message: 'Senha atual incorreta' });
  }

  // Atualiza a senha do usuário
  router.db
    .get('users')
    .find({ token })
    .assign({ password: newPassword })
    .write();

  res.status(200).json({ message: 'Senha alterada com sucesso' });
});

server.post('/users/delete-account', (req, res) => {
  const auth = req.headers.authorization;
  if (!auth || !auth.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Token não enviado' });
  }

  const token = auth.replace('Bearer ', '');
  const { password } = req.body;

  console.log('Delete Request:', {
    receivedToken: token,
    receivedPassword: password
  });

  // Encontra o usuário pelo token
  const user = router.db.get('users').find({ token }).value();

  if (!user) {
    console.log('User not found:', token);
    return res.status(401).json({ message: 'Usuário não encontrado' });
  }

  console.log('Found user:', {
    userId: user.id,
    userPassword: user.password,
    receivedPassword: password
  });

  // Verifica se a senha está correta (convertendo para string)
  if (String(user.password) !== String(password)) {
    console.log('Password mismatch:', {
      stored: user.password,
      received: password
    });
    return res.status(401).json({ message: 'Senha incorreta' });
  }

  try {
    // Remove o usuário usando o token para garantir que é o usuário correto
    router.db
      .get('users')
      .remove({ token })
      .write();

    console.log('User deleted successfully');
    res.status(200).json({ message: 'Conta excluída com sucesso' });
  } catch (error) {
    console.error('Delete error:', error);
    res.status(500).json({ message: 'Erro ao excluir conta' });
  }
});

// Endpoint para obter despesas ----------------------------------------------------
server.get('/expenses', (req, res) => {
  const auth = req.headers.authorization;
  if (!auth || !auth.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Token não enviado' });
  }
  const token = auth.replace('Bearer ', '');
  const user = router.db.get('users').find({ token }).value();
  
  if (!user) {
    return res.status(401).json({ message: 'Usuário não autorizado' });
  }

  const expenses = router.db.get('expenses').value();
  return res.json(expenses);
});

// Dashboard endpoints
server.get('/balance', (req, res) => {
  const auth = req.headers.authorization;
  if (!auth || !auth.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Token não enviado' });
  }
  const token = auth.replace('Bearer ', '');
  const user = router.db.get('users').find({ token }).value();
  
  if (!user) {
    return res.status(401).json({ message: 'Usuário não autorizado' });
  }

  const balance = router.db.get('balance').value();
  return res.json(balance);
});

server.get('/transactions/recent', (req, res) => {
  const auth = req.headers.authorization;
  if (!auth || !auth.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Token não enviado' });
  }
  const token = auth.replace('Bearer ', '');
  const user = router.db.get('users').find({ token }).value();
  
  if (!user) {
    return res.status(401).json({ message: 'Usuário não autorizado' });
  }

  const transactions = router.db.get('transactions')
    .sortBy('date')
    .reverse()
    .take(5)
    .value();
  
  return res.json(transactions);
});

// Endpoint para obter transações ---------------------------------------------------
server.get('/transactions', (req, res) => {
  const auth = req.headers.authorization;
  if (!auth || !auth.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Token não enviado' });
  }
  
  const transactions = router.db.get('transactions').value();
  return res.json(transactions);
});

server.post('/transactions', (req, res) => {
  const auth = req.headers.authorization;
  if (!auth || !auth.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Token não enviado' });
  }

  const newTransaction = {
    id: Date.now(),
    ...req.body,
    amount: Number(req.body.amount) // Garante que amount é número
  };

  router.db.get('transactions')
    .push(newTransaction)
    .write();

  return res.status(201).json(newTransaction);
});

server.put('/transactions/:id', (req, res) => {
  const auth = req.headers.authorization;
  if (!auth || !auth.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Token não enviado' });
  }

  const { id } = req.params;
  const updatedTransaction = {
    ...req.body,
    amount: Number(req.body.amount) // Garante que amount é número
  };

  router.db.get('transactions')
    .find({ id: parseInt(id) })
    .assign(updatedTransaction)
    .write();

  return res.json(updatedTransaction);
});

server.delete('/transactions/:id', (req, res) => {
  const auth = req.headers.authorization;
  if (!auth || !auth.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Token não enviado' });
  }

  const { id } = req.params;
  router.db.get('transactions')
    .remove({ id: parseInt(id) })
    .write();

  return res.status(204).send();
});

server.get('/transactions', (req, res) => {
  const auth = req.headers.authorization;
  if (!auth || !auth.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Token não enviado' });
  }

  const period = req.query.period || 'week';
  const now = new Date();
  let startDate;

  switch (period) {
    case 'week':
      startDate = new Date(now.setDate(now.getDate() - 7));
      break;
    case 'month':
      startDate = new Date(now.setMonth(now.getMonth() - 1));
      break;
    case 'quarter':
      startDate = new Date(now.setMonth(now.getMonth() - 3));
      break;
    case 'year':
      startDate = new Date(now.setFullYear(now.getFullYear() - 1));
      break;
    default:
      startDate = new Date(now.setDate(now.getDate() - 7));
  }

  const transactions = router.db.get('transactions')
    .filter(t => new Date(t.date) >= startDate)
    .value();
  
  return res.json(transactions);
});

server.get('/transactions/totals', (req, res) => {
  const auth = req.headers.authorization;
  if (!auth || !auth.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Token não enviado' });
  }

  const period = req.query.period || 'week';
  const now = new Date();
  let startDate;

  switch (period) {
    case 'week':
      startDate = new Date(now.setDate(now.getDate() - 7));
      break;
    case 'month':
      startDate = new Date(now.setMonth(now.getMonth() - 1));
      break;
    case 'quarter':
      startDate = new Date(now.setMonth(now.getMonth() - 3));
      break;
    case 'year':
      startDate = new Date(now.setFullYear(now.getFullYear() - 1));
      break;
    default:
      startDate = new Date(now.setDate(now.getDate() - 7));
  }

  const transactions = router.db.get('transactions')
    .filter(t => new Date(t.date) >= startDate)
    .value();

  const totals = transactions.reduce((acc, curr) => {
    if (curr.type === 'INCOME') {
      acc.income += curr.amount;
    } else {
      acc.expenses += curr.amount;
    }
    return acc;
  }, { income: 0, expenses: 0 });

  totals.total = totals.income - totals.expenses;

  return res.json(totals);
});

server.get('/transactions', (req, res) => {
  const auth = req.headers.authorization;
  if (!auth || !auth.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Token não enviado' });
  }

  const period = req.query.period || 'week';
  const search = req.query.search?.toLowerCase();
  const now = new Date();
  let startDate;

  switch (period) {
    case 'week':
      startDate = new Date(now.setDate(now.getDate() - 7));
      break;
    case 'month':
      startDate = new Date(now.setMonth(now.getMonth() - 1));
      break;
    case 'quarter':
      startDate = new Date(now.setMonth(now.getMonth() - 3));
      break;
    case 'year':
      startDate = new Date(now.setFullYear(now.getFullYear() - 1));
      break;
    default:
      startDate = new Date(now.setDate(now.getDate() - 7));
  }

  let transactions = router.db.get('transactions')
    .filter(t => new Date(t.date) >= startDate);

  if (search) {
    transactions = transactions.filter(t => 
      t.description.toLowerCase().includes(search) ||
      t.category.toLowerCase().includes(search)
    );
  }
  
  return res.json(transactions.value());
});

// Savings endpoints -----------------------------------------
server.get('/savings/totals', (req, res) => {
  const auth = req.headers.authorization;
  if (!auth || !auth.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Token não enviado' });
  }

  const totals = router.db.get('savingsTotals').value();
  return res.json(totals);
});

server.get('/savings', (req, res) => {
  const auth = req.headers.authorization;
  if (!auth || !auth.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Token não enviado' });
  }

  const goals = router.db.get('savings').value();
  return res.json(goals);
});

server.post('/savings', (req, res) => {
  const auth = req.headers.authorization;
  if (!auth || !auth.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Token não enviado' });
  }

  const newGoal = {
    id: Date.now(),
    current: 0,
    ...req.body
  };

  router.db.get('savings')
    .push(newGoal)
    .write();

  return res.status(201).json(newGoal);
});

server.get('/savings/:id', (req, res) => {
  const auth = req.headers.authorization;
  if (!auth || !auth.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Token não enviado' });
  }

  const { id } = req.params;
  const goal = router.db.get('savings').find({ id: parseInt(id) }).value();

  if (!goal) {
    return res.status(404).json({ message: 'Meta não encontrada' });
  }

  return res.json(goal);
});

server.put('/savings/:id', (req, res) => {
  const auth = req.headers.authorization;
  if (!auth || !auth.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Token não enviado' });
  }

  const { id } = req.params;
  const updatedGoal = {
    ...router.db.get('savings').find({ id: parseInt(id) }).value(),
    ...req.body
  };

  router.db.get('savings')
    .find({ id: parseInt(id) })
    .assign(updatedGoal)
    .write();

  return res.json(updatedGoal);
});

server.delete('/savings/:id', (req, res) => {
  const auth = req.headers.authorization;
  if (!auth || !auth.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Token não enviado' });
  }

  const { id } = req.params;
  router.db.get('savings')
    .remove({ id: parseInt(id) })
    .write();

  return res.status(204).end();
});

server.get('/savings/:id/detail', (req, res) => {
  const auth = req.headers.authorization;
  if (!auth || !auth.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Token não enviado' });
  }

  const { id } = req.params;
  const savingDetail = router.db
    .get('savingDetail')
    .find({ id: parseInt(id) })
    .value();

  if (!savingDetail) {
    return res.status(404).json({ message: 'Meta não encontrada' });
  }

  return res.json(savingDetail);
});

server.get('/savings/:id/semester-transactions', (req, res) => {
  const auth = req.headers.authorization;
  if (!auth || !auth.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Token não enviado' });
  }

  const { id } = req.params;
  const semesterTransactions = router.db
    .get('savingSemesterTransactions')
    .filter({ savingId: parseInt(id) })
    .value();

  if (!semesterTransactions) {
    return res.status(404).json({ message: 'Transações do semestre não encontradas' });
  }

  return res.json(semesterTransactions);
});

// Mock endpoint para "esqueci minha senha"
server.post('/forgot-password', (req, res) => {
  const { email } = req.body;
  // Simula busca do usuário pelo e-mail
  const user = router.db.get('users').find({ email }).value();
  if (user) {
    // Simula envio de e-mail de recuperação
    return res.status(200).json({ message: 'Enviamos um link de recuperação para seu e-mail.' });
  }
  return res.status(404).json({ message: 'E-mail não encontrado.' });
});

// Mock endpoint para registro de novo usuário
server.post('/register', (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) {
    return res.status(400).json({ message: 'Preencha todos os campos' });
  }
  // Verifica se já existe usuário com o mesmo e-mail
  const existingUser = router.db.get('users').find({ email }).value();
  if (existingUser) {
    return res.status(409).json({ message: 'E-mail já cadastrado' });
  }
  // Cria novo usuário mock
  const newUser = {
    id: randomUUID(),
    name,
    email,
    password,
    avatar: "",
    role: "user",
    token: Math.random().toString(36).substring(2)
  };
  router.db.get('users').push(newUser).write();
  // Retorna apenas dados públicos
  const { password: _, ...userData } = newUser;
  return res.status(201).json(userData);
});

server.use(jsonServer.rewriter({ '/api/*': '/$1' }));

server.use(router);

server.listen(4000, () =>
  console.log('JSON Server rodando em http://localhost:4000')
);