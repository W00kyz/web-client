const providerNames: Record<string, string> = {
  credentials: "Credenciais",
};

const ptBr = {
  accountSignInLabel: "Entrar",
  accountSignOutLabel: "Sair",
  accountPreviewIconButtonLabel: "Visualizar conta",
  accountPreviewTitle: "Detalhes da conta",

  signInTitle: (brandingTitle?: string) =>
    brandingTitle ? `Entrar em ${brandingTitle}` : "Entrar",
  signInSubtitle: "Acesse sua conta",
  providerSignInTitle: (provider: string) =>
    `Entrar com ${providerNames[provider.toLowerCase()] || provider}`,
  signInRememberMe: "Lembrar‑me",

  email: "E‑mail",
  passkey: "Chave de acesso",
  username: "Usuário",
  password: "Senha",

  or: "ou",
  to: "para",
  with: "com",
  save: "Salvar",
  cancel: "Cancelar",
  ok: "OK",
  close: "Fechar",
  delete: "Excluir",
  alert: "Alerta",
  confirm: "Confirmar",
  loading: "Carregando",

  createNewButtonLabel: "Novo",
  reloadButtonLabel: "Recarregar",
  createLabel: "Criar",
  createSuccessMessage: "Criado com sucesso",
  createErrorMessage: "Erro ao criar",
  editLabel: "Editar",
  editSuccessMessage: "Atualizado com sucesso",
  editErrorMessage: "Erro ao atualizar",
  deleteLabel: "Excluir",
  deleteConfirmTitle: "Confirma exclusão?",
  deleteConfirmMessage: "Esta ação não pode ser desfeita.",
  deleteConfirmLabel: "Excluir",
  deleteCancelLabel: "Cancelar",
  deleteSuccessMessage: "Excluído com sucesso",
  deleteErrorMessage: "Erro ao excluir",
  deletedItemMessage: "Item excluído",
};

export default ptBr;
