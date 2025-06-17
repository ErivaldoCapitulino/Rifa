import { useState, useEffect } from "react";
import Head from "next/head";
import styles from "../styles/Home.module.css";

export default function PublicPage() {
  const [participants, setParticipants] = useState([]);
  const [winners, setWinners] = useState([]);

  useEffect(() => {
    loadData();
  }, []);

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

  return (
    <div className={styles.container}>
      <Head>
        <title>Resultado da Rifa</title>
      </Head>

      <main>
        <h1>Resultado da Rifa</h1>

        {winners.length > 0 ? (
          <div className={styles.winnersContainer}>
            <h2>Vencedores</h2>
            {winners.map((winner, index) => (
              <div key={index} className={styles.winnerCard}>
                <h3>{index + 1}º Lugar</h3>
                <p>
                  <strong>Nome:</strong> {winner.name}
                </p>
                <p>
                  <strong>Número:</strong> {winner.number}
                </p>
              </div>
            ))}
          </div>
        ) : (
          <p>Aguardando sorteio...</p>
        )}

        <h2>Lista de Participantes</h2>
        <table className={styles.participantsTable}>
          <thead>
            <tr>
              <th>Nome</th>
              <th>Número</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {participants.map((p, index) => (
              <tr key={index}>
                <td>{p.name}</td>
                <td>{p.number}</td>
                <td className={p.paid ? styles.paid : styles.pending}>
                  {p.paid ? "Pago" : "Pendente"}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        <button onClick={loadData} className={styles.refreshBtn}>
          Atualizar Página
        </button>
      </main>
    </div>
  );
}
