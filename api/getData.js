import dataService from "../../lib/dataService";

export default async function handler(req, res) {
  if (req.method !== "GET") {
    return res.status(405).json({ error: "Método não permitido" });
  }

  try {
    const data = dataService.getData();
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ error: "Erro ao obter dados" });
  }
}
