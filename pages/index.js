import { useState, useEffect } from "react";
import Head from "next/head";
import styles from "../styles/Home.module.css";

export default function AdminPage() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [participants, setParticipants] = useState([]);
  const [winners, setWinners] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    number: "",
    paid: "true",
  });

  // Carrega os dados ao iniciar
  useEffect(() => {
    if (loggedIn) {
      loadData();
    }
  }, [loggedIn]);

  const loadData = async () => {
    try {
      const response = await fetch("/api/getData");
      const data = await response.json();
      setParticipants(data.participants || []);
      setWinners(data.winners || []);
    } catch (error) {
      console.error("Erro ao carregar dados:", error);
    }
  };

  const handleLogin = (e) => {
    e.preventDefault();
    const username = e.target.username.value;
    const password = e.target.password.value;

    // Verificação simples - em produção, use autenticação segura
    if (username === "admin" && password === "admin123") {
      setLoggedIn(true);
    } else {
      alert("Credenciais inválidas");
    }
  };

  const handleAddParticipant = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("/api/saveData", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          participants: [
            ...participants,
            {
              name: formData.name,
              number: parseInt(formData.number),
              paid: formData.paid === "true",
            },
          ],
        }),
      });

      const result = await response.json();

      if (result.success) {
        setFormData({ name: "", number: "", paid: "true" });
        loadData();
      } else {
        alert("Erro ao salvar participante");
      }
    } catch (error) {
      console.error("Erro:", error);
      alert("Erro ao salvar participante");
    }
  };

  if (!loggedIn) {
    return (
      <div className={styles.loginContainer}>
        <h2>Acesso do Administrador</h2>
        <form onSubmit={handleLogin}>
          <div className={styles.formGroup}>
            <label htmlFor="username">Usuário:</label>
            <input type="text" id="username" required />
          </div>
          <div className={styles.formGroup}>
            <label htmlFor="password">Senha:</label>
            <input type="password" id="password" required />
          </div>
          <button type="submit" className={styles.loginBtn}>
            Entrar
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className={styles.container}>
      <Head>
        <title>Gerenciador de Rifa</title>
      </Head>

      <main>
        <h1>Gerenciador de Rifa (1 a 100)</h1>

        <div className={styles.formContainer}>
          <h2>Adicionar Participante</h2>
          <form onSubmit={handleAddParticipant}>
            <div className={styles.formGroup}>
              <label htmlFor="name">Nome:</label>
              <input
                type="text"
                id="name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                required
              />
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="number">Número (1-100):</label>
              <input
                type="number"
                id="number"
                min="1"
                max="100"
                value={formData.number}
                onChange={(e) =>
                  setFormData({ ...formData, number: e.target.value })
                }
                required
              />
            </div>
            <div className={styles.formGroup}>
              <label htmlFor="paid">Pagou?</label>
              <select
                id="paid"
                value={formData.paid}
                onChange={(e) =>
                  setFormData({ ...formData, paid: e.target.value })
                }
                required
              >
                <option value="true">Sim</option>
                <option value="false">Não</option>
              </select>
            </div>
            <button type="submit">Adicionar</button>
          </form>
        </div>

        {/* Restante do código administrativo */}
      </main>
    </div>
  );
}
