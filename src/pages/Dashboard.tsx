import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { storage } from '../utils/storage';
import { Form } from '../types';
import { Plus, FileText, Eye, BarChart3, Trash2, Copy, ExternalLink } from 'lucide-react';

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const [forms, setForms] = useState<Form[]>([]);
  const [copiedId, setCopiedId] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      const userForms = storage.getFormsByUser(user.id);
      setForms(userForms);
    }
  }, [user]);

  const handleDeleteForm = (formId: string) => {
    if (window.confirm('Are you sure you want to delete this form? This action cannot be undone.')) {
      storage.deleteForm(formId);
      setForms(forms.filter(form => form.id !== formId));
    }
  };

  const handleCopyLink = (formId: string) => {
    const link = `${window.location.origin}/form/${formId}`;
    navigator.clipboard.writeText(link);
    setCopiedId(formId);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const getResponseCount = (formId: string) => {
    const responses = storage.getResponsesByFormId(formId);
    return responses.length;
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-600 mt-2">Manage your feedback forms and view responses</p>
        </div>
        <Link
          to="/create-form"
          className="inline-flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
        >
          <Plus className="h-5 w-5" />
          <span>Create New Form</span>
        </Link>
      </div>

      {forms.length === 0 ? (
        <div className="text-center py-12">
          <FileText className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">No forms yet</h3>
          <p className="text-gray-600 mb-6">Create your first feedback form to get started</p>
          <Link
            to="/create-form"
            className="inline-flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
          >
            <Plus className="h-5 w-5" />
            <span>Create Your First Form</span>
          </Link>
        </div>
      ) : (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {forms.map((form) => (
            <div key={form.id} className="bg-white rounded-xl shadow-lg hover:shadow-xl transition-shadow duration-300">
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">{form.title}</h3>
                    {form.description && (
                      <p className="text-gray-600 text-sm mb-3">{form.description}</p>
                    )}
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <span>{form.questions.length} questions</span>
                      <span>{getResponseCount(form.id)} responses</span>
                    </div>
                  </div>
                  <button
                    onClick={() => handleDeleteForm(form.id)}
                    className="text-gray-400 hover:text-red-600 transition-colors"
                    title="Delete form"
                  >
                    <Trash2 className="h-5 w-5" />
                  </button>
                </div>

                <div className="flex flex-wrap gap-2 mb-4">
                  <Link
                    to={`/form/${form.id}`}
                    className="flex items-center space-x-1 px-3 py-1 bg-blue-50 text-blue-600 rounded-full text-sm hover:bg-blue-100 transition-colors"
                  >
                    <Eye className="h-4 w-4" />
                    <span>Preview</span>
                  </Link>
                  <Link
                    to={`/form/${form.id}/responses`}
                    className="flex items-center space-x-1 px-3 py-1 bg-green-50 text-green-600 rounded-full text-sm hover:bg-green-100 transition-colors"
                  >
                    <BarChart3 className="h-4 w-4" />
                    <span>Analytics</span>
                  </Link>
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={() => handleCopyLink(form.id)}
                    className="flex items-center space-x-1 px-3 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm hover:bg-gray-200 transition-colors flex-1"
                  >
                    {copiedId === form.id ? (
                      <>
                        <span>Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="h-4 w-4" />
                        <span>Copy Link</span>
                      </>
                    )}
                  </button>
                  <Link
                    to={`/form/${form.id}`}
                    className="flex items-center justify-center p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    <ExternalLink className="h-4 w-4" />
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Dashboard;