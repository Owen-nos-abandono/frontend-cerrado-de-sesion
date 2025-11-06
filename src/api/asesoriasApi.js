import axios from "axios";

const API_URL = "http://localhost:8082/asesorias";

export async function listarAsesorias() {
  const res = await axios.get(`${API_URL}/listar`);
  return res.data;
}

export async function agendarAsesoria(asesoria) {
  const res = await axios.post(`${API_URL}/agendar`, asesoria);
  return res.data;
}

export async function eliminarAsesoria(id) {
  await axios.delete(`${API_URL}/${id}`);
}
