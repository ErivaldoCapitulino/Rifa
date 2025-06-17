import dataService from "../../lib/dataService";

export default async function handler(req, res) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Método não permitido" });
  }

  try {
    const result = dataService.saveData(req.body);
    res.status(200).json(result);
  } catch (error) {
    res.status(500).json({ error: "Erro ao salvar dados" });
  }
}
