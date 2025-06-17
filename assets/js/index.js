// Sistema de Credenciais Seguro
function getAdminCredentials() {
  // Verifica se as credenciais já foram configuradas
  if (!localStorage.getItem("adminCredentialsSet")) {
    const username = prompt(
      "Configuração Inicial\nDigite o nome de usuário ADMIN:"
    );
    const password = prompt("Configuração Inicial\nDigite a senha ADMIN:");

    if (username && password) {
      // Armazena de forma segura (não ideal para produção, mas melhor que hardcoded)
      localStorage.setItem("adminUsername", btoa(username));
      localStorage.setItem("adminPassword", btoa(password));
      localStorage.setItem("adminCredentialsSet", "true");
      alert("Credenciais configuradas com sucesso!");
      location.reload();
    } else {
      alert("Você deve configurar as credenciais para continuar");
      return { username: null, password: null };
    }
  }

  return {
    username: atob(localStorage.getItem("adminUsername")),
    password: atob(localStorage.getItem("adminPassword")),
  };
}

// Verifica o login
function checkLogin(event) {
  event.preventDefault();

  const credentials = getAdminCredentials();
  if (!credentials.username) return;

  const username = document.getElementById("username").value;
  const password = document.getElementById("password").value;
  const errorElement = document.getElementById("loginError");

  if (username === credentials.username && password === credentials.password) {
    // Login bem-sucedido
    sessionStorage.setItem("loggedIn", "true");
    document.getElementById("loginScreen").style.display = "none";
    document.getElementById("mainContent").style.display = "block";
    loadParticipants();
  } else {
    // Login falhou
    errorElement.textContent = "Usuário ou senha incorretos";
  }
}

// Logout
function logout() {
  sessionStorage.removeItem("loggedIn");
  document.getElementById("loginScreen").style.display = "block";
  document.getElementById("mainContent").style.display = "none";
  document.getElementById("username").value = "";
  document.getElementById("password").value = "";
  document.getElementById("loginError").textContent = "";
}

// Verifica autenticação
function checkAuth() {
  if (sessionStorage.getItem("loggedIn") === "true") {
    document.getElementById("loginScreen").style.display = "none";
    document.getElementById("mainContent").style.display = "block";
    loadParticipants();
  }
}

// Funções da Rifa
function loadParticipants() {
  const participants = JSON.parse(localStorage.getItem("participants")) || [];
  const tbody = document.getElementById("participantsBody");
  tbody.innerHTML = "";
  participants.forEach((p, index) => {
    const row = document.createElement("tr");
    row.innerHTML = `
                    <td>${p.name}</td>
                    <td>${p.number}</td>
                    <td>${p.paid ? "Sim" : "Não"}</td>
                    <td><button onclick="removeParticipant(${index})">Remover</button></td>
                `;
    tbody.appendChild(row);
  });
}

function addParticipant() {
  const name = document.getElementById("name").value.trim();
  const number = parseInt(document.getElementById("number").value);
  const paid = document.getElementById("paid").value === "true";

  if (!name || isNaN(number) || number < 1 || number > 100) {
    alert("Preencha todos os campos corretamente.");
    return;
  }

  const participants = JSON.parse(localStorage.getItem("participants")) || [];
  if (participants.some((p) => p.number === number)) {
    alert("Número já escolhido.");
    return;
  }

  participants.push({ name, number, paid });
  localStorage.setItem("participants", JSON.stringify(participants));
  document.getElementById("name").value = "";
  document.getElementById("number").value = "";
  loadParticipants();
}

function removeParticipant(index) {
  const participants = JSON.parse(localStorage.getItem("participants")) || [];
  participants.splice(index, 1);
  localStorage.setItem("participants", JSON.stringify(participants));
  loadParticipants();
}

async function drawWinner(participantsList, rouletteDiv) {
  const spins = 20 + Math.floor(Math.random() * 10);
  const delay = 100;

  for (let i = 0; i < spins; i++) {
    const randomIndex = Math.floor(Math.random() * participantsList.length);
    rouletteDiv.innerHTML = `<span class="roulette-number">${participantsList[randomIndex].number}</span>`;
    await new Promise((resolve) => setTimeout(resolve, delay));
  }

  return participantsList[Math.floor(Math.random() * participantsList.length)];
}

async function startRoulette() {
  const participants = JSON.parse(localStorage.getItem("participants")) || [];
  const paidParticipants = participants.filter((p) => p.paid);

  if (paidParticipants.length < 2) {
    alert("Necessário pelo menos 2 participantes pagantes.");
    return;
  }

  const drawButton = document.getElementById("drawButton");
  drawButton.disabled = true;
  const rouletteDiv = document.getElementById("roulette");
  const resultDiv = document.getElementById("result");
  resultDiv.innerHTML = "";

  // Sorteio dos vencedores
  const firstWinner = await drawWinner(paidParticipants, rouletteDiv);
  const remaining = paidParticipants.filter(
    (p) => p.number !== firstWinner.number
  );
  const secondWinner = await drawWinner(remaining, rouletteDiv);

  // Exibe resultados
  resultDiv.innerHTML = `
                <div class="winner-info">
                    <strong>Primeiro Ganhador:</strong> ${firstWinner.name} (Número: ${firstWinner.number})
                </div>
                <div class="winner-info">
                    <strong>Segundo Ganhador:</strong> ${secondWinner.name} (Número: ${secondWinner.number})
                </div>
            `;

  // Salva os vencedores
  localStorage.setItem("winners", JSON.stringify([firstWinner, secondWinner]));
  localStorage.setItem("lastUpdate", Date.now());
  drawButton.disabled = false;
}

// Inicialização
window.onload = function () {
  // Configura credenciais na primeira execução
  getAdminCredentials();
  // Verifica se já está logado
  checkAuth();
};
