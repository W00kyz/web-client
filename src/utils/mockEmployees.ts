export const mockEmployees = Array.from({ length: 60 }, (_, i) => ({
  id: i + 1,
  nome: `Funcionário ${i + 1}`,
  situacao: i % 3 === 0 ? "Ativo" : i % 3 === 1 ? "Licença" : "Afastado",
  substituto: i % 5 === 0,
  recibo: i % 2 === 0,
  assinatura: i % 4 !== 0,
  fgts: true,
  inss: true,
  vt: i % 6 !== 0,
  observacao: i % 7 === 0 ? "Pendência na assinatura" : "",
}));
