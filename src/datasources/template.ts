import { API_URL } from '@constants/AppContants';

export interface Selection {
  key: string;
  values: string[];
}

export interface CreateRuleInput {
  templateId: number;
  name: string;
  description: string;
  isSection?: boolean;
}

export interface CreatedRule {
  id: number;
  user_id: number;
  document_id: number;
  name: string;
  is_section: boolean;
  pattern: string;
  created_at: string;
}

export const templateRuleDataSource = {
  createOne: async ({
    data,
    token,
  }: {
    data: CreateRuleInput;
    token?: string;
  }): Promise<CreatedRule> => {
    try {
      const response = await fetch(`${API_URL}/document/create-pattern`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token && { Authorization: `Bearer ${token}` }),
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        throw new Error(`Erro ao gerar regex: ${response.statusText}`);
      }

      const result = await response.json();
      return result as CreatedRule;

      // MOCK temporário (se quiser usar, comente o fetch acima)
      /*
      return new Promise((resolve) => {
        setTimeout(() => {
          resolve({
            id: 123,
            user_id: 1,
            document_id: data.documentId,
            name: data.selections[0]?.key || 'mockRule',
            is_section: data.isSection || false,
            pattern: 'conteúdo',
            created_at: new Date().toISOString(),
          });
        }, 300);
      });
      */
    } catch (error) {
      console.error('Erro no createOne (Rule):', error);
      throw error;
    }
  },
};

export interface Template {
  name: string;
  rules: string[];
}

export const templateDataSources = {
  createOne: async (template: Template): Promise<void> => {
    try {
      const response = await fetch(`${API_URL}/document/template`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(template),
      });

      if (!response.ok) {
        throw new Error(`Erro ao salvar template: ${response.statusText}`);
      }
    } catch (error) {
      console.error('Erro no createOne (Template):', error);
      throw error;
    }
  },
};
