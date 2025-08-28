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
    } catch (error) {
      console.error('Erro no createOne (Rule):', error);
      throw error;
    }
  },

  deleteOne: async ({ id, token }: { id: number; token?: string }) => {
    try {
      const response = await fetch(`${API_URL}/document/delete-pattern/${id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          ...(token && { Authorization: `Bearer ${token}` }),
        },
      });

      if (!response.ok) {
        throw new Error(`Erro ao deletar regex: ${response.statusText}`);
      }
      return;
    } catch (error) {
      console.error('Erro no deleteOne (Rule):', error);
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
