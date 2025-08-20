import { useState, useEffect, FormEvent } from 'react';
import './App.css';

// Interface para tipar o objeto de aniversário
interface Birthday {
  id: string;
  name: string;
  date: string; // Formato YYYY-MM-DD
}

function App() {
  const [birthdays, setBirthdays] = useState<Birthday[]>([]);
  const [name, setName] = useState('');
  const [date, setDate] = useState('');

  // 1. Carregar dados do localStorage ao iniciar a aplicação
  useEffect(() => {
    const storedBirthdays = localStorage.getItem('birthdays');
    if (storedBirthdays) {
      setBirthdays(JSON.parse(storedBirthdays));
    }
  }, []);

  // 2. Salvar dados no localStorage sempre que 'birthdays' mudar
  useEffect(() => {
    localStorage.setItem('birthdays', JSON.stringify(birthdays));
  }, [birthdays]);

  // 3. Função para lidar com a submissão do formulário
  const handleAddBirthday = (e: FormEvent) => {
    e.preventDefault();
    if (!name || !date) {
      alert('Por favor, preencha todos os campos.');
      return;
    }

    const newBirthday: Birthday = {
      id: Date.now().toString(), // ID único baseado no timestamp
      name,
      date,
    };

    setBirthdays([...birthdays, newBirthday]);
    setName('');
    setDate('');
  };

  // 4. Função para remover um aniversário
  const handleRemoveBirthday = (id: string) => {
    setBirthdays(birthdays.filter(birthday => birthday.id !== id));
  };

  // 5. Função para verificar se é o dia do aniversário
  const isToday = (bdayDate: string): boolean => {
    const today = new Date();
    const bday = new Date(bdayDate + 'T00:00:00'); // Garante que a data seja interpretada corretamente

    // Compara o dia e o mês
    return today.getMonth() === bday.getMonth() && today.getDate() === bday.getDate();
  };

  return (
    <div className="container">
      <div className="app-card">
        <h1 className="title">Alerta de Aniversários</h1>

        <form onSubmit={handleAddBirthday} className="add-form">
          <div className="input-group">
            <label htmlFor="name">Nome:</label>
            <input
              type="text"
              id="name"
              placeholder="Nome da pessoa"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div className="input-group">
            <label htmlFor="date">Data:</label>
            <input
              type="date"
              id="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              required
            />
          </div>
          <button type="submit">Adicionar Aniversário</button>
        </form>

        <div className="birthdays-list">
          <h2>Aniversários Cadastrados</h2>
          {birthdays.length === 0 ? (
            <p className="no-birthdays-message">Nenhum aniversário cadastrado.</p>
          ) : (
            birthdays.map((bday) => (
              <div key={bday.id} className="birthday-item">
                <div className="info">
                  <h3 style={{ color: isToday(bday.date) ? '#e74c3c' : '#2c3e50' }}>
                    {bday.name} {isToday(bday.date) && "🎂 É hoje!"}
                  </h3>
                  <p>{new Date(bday.date + 'T00:00:00').toLocaleDateString('pt-BR', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
                </div>
                <div className="actions">
                  <button onClick={() => handleRemoveBirthday(bday.id)}>
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M5.72 5.72a.75.75 0 011.06 0L12 10.94l5.22-5.22a.75.75 0 111.06 1.06L13.06 12l5.22 5.22a.75.75 0 11-1.06 1.06L12 13.06l-5.22 5.22a.75.75 0 01-1.06-1.06L10.94 12 5.72 6.78a.75.75 0 010-1.06z" clipRule="evenodd" /></svg>
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default App;