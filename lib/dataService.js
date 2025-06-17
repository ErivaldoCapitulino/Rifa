// Simulamos um "banco de dados" em memória (persistente entre chamadas da mesma instância)
let db = {
  participants: [],
  winners: [],
  adminCredentials: {
    username: process.env.ADMIN_USERNAME || "admin",
    password: process.env.ADMIN_PASSWORD || "admin123",
  },
};

export default {
  getData: () => {
    return { ...db };
  },

  saveData: (newData) => {
    db = { ...db, ...newData };
    return { success: true };
  },

  verifyAdmin: (username, password) => {
    return (
      username === db.adminCredentials.username &&
      password === db.adminCredentials.password
    );
  },
};
