import { User, Form, FormResponse } from '../types';

const USERS_KEY = 'feedback_users';
const FORMS_KEY = 'feedback_forms';
const RESPONSES_KEY = 'feedback_responses';

export const storage = {
  // Users
  getUsers: (): User[] => {
    const data = localStorage.getItem(USERS_KEY);
    return data ? JSON.parse(data) : [];
  },

  saveUsers: (users: User[]) => {
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
  },

  addUser: (user: User) => {
    const users = storage.getUsers();
    users.push(user);
    storage.saveUsers(users);
  },

  getUserByEmail: (email: string): User | undefined => {
    const users = storage.getUsers();
    return users.find(user => user.email === email);
  },

  getUserById: (id: string): User | undefined => {
    const users = storage.getUsers();
    return users.find(user => user.id === id);
  },

  // Forms
  getForms: (): Form[] => {
    const data = localStorage.getItem(FORMS_KEY);
    return data ? JSON.parse(data) : [];
  },

  saveForms: (forms: Form[]) => {
    localStorage.setItem(FORMS_KEY, JSON.stringify(forms));
  },

  addForm: (form: Form) => {
    const forms = storage.getForms();
    forms.push(form);
    storage.saveForms(forms);
  },

  getFormById: (id: string): Form | undefined => {
    const forms = storage.getForms();
    return forms.find(form => form.id === id);
  },

  getFormsByUser: (userId: string): Form[] => {
    const forms = storage.getForms();
    return forms.filter(form => form.createdBy === userId);
  },

  updateForm: (id: string, updates: Partial<Form>) => {
    const forms = storage.getForms();
    const index = forms.findIndex(form => form.id === id);
    if (index !== -1) {
      forms[index] = { ...forms[index], ...updates };
      storage.saveForms(forms);
    }
  },

  deleteForm: (id: string) => {
    const forms = storage.getForms();
    const filtered = forms.filter(form => form.id !== id);
    storage.saveForms(filtered);
    
    // Also delete responses for this form
    const responses = storage.getResponses();
    const filteredResponses = responses.filter(response => response.formId !== id);
    storage.saveResponses(filteredResponses);
  },

  // Responses
  getResponses: (): FormResponse[] => {
    const data = localStorage.getItem(RESPONSES_KEY);
    return data ? JSON.parse(data) : [];
  },

  saveResponses: (responses: FormResponse[]) => {
    localStorage.setItem(RESPONSES_KEY, JSON.stringify(responses));
  },

  addResponse: (response: FormResponse) => {
    const responses = storage.getResponses();
    responses.push(response);
    storage.saveResponses(responses);
  },

  getResponsesByFormId: (formId: string): FormResponse[] => {
    const responses = storage.getResponses();
    return responses.filter(response => response.formId === formId);
  },

  // Initialize with sample data
  initializeSampleData: () => {
    const users = storage.getUsers();
    if (users.length === 0) {
      const sampleUser: User = {
        id: '1',
        username: 'admin',
        email: 'admin@example.com',
        password: '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', // password
        createdAt: new Date().toISOString()
      };
      storage.addUser(sampleUser);
    }
  }
};