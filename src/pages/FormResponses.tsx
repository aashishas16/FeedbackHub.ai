import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { storage } from '../utils/storage';
import { Form, FormResponse, FormStats } from '../types';
import { ArrowLeft, Download, BarChart3, Users, Calendar, Mail } from 'lucide-react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import Papa from 'papaparse';

const FormResponses: React.FC = () => {
  const { formId } = useParams<{ formId: string }>();
  const [form, setForm] = useState<Form | null>(null);
  const [responses, setResponses] = useState<FormResponse[]>([]);
  const [stats, setStats] = useState<FormStats | null>(null);
  const [activeTab, setActiveTab] = useState<'responses' | 'analytics'>('responses');

  useEffect(() => {
    if (formId) {
      const formData = storage.getFormById(formId);
      const responseData = storage.getResponsesByFormId(formId);
      
      setForm(formData || null);
      setResponses(responseData);
      
      if (formData) {
        calculateStats(formData, responseData);
      }
    }
  }, [formId]);

  const calculateStats = (form: Form, responses: FormResponse[]) => {
    const questionStats: FormStats['questionStats'] = {};
    
    form.questions.forEach(question => {
      questionStats[question.id] = {
        totalAnswers: 0,
        optionCounts: question.type === 'multiple-choice' ? {} : undefined,
        textAnswers: question.type === 'text' ? [] : undefined
      };
    });

    responses.forEach(response => {
      Object.entries(response.answers).forEach(([questionId, answer]) => {
        if (questionStats[questionId]) {
          questionStats[questionId].totalAnswers++;
          
          if (typeof answer === 'string') {
            const question = form.questions.find(q => q.id === questionId);
            if (question?.type === 'multiple-choice') {
              questionStats[questionId].optionCounts![answer] = 
                (questionStats[questionId].optionCounts![answer] || 0) + 1;
            } else {
              questionStats[questionId].textAnswers?.push(answer);
            }
          }
        }
      });
    });

    setStats({
      totalResponses: responses.length,
      questionStats
    });
  };

  const exportToCSV = () => {
    if (!form || responses.length === 0) return;

    const csvData = responses.map(response => {
      const row: any = {
        'Response ID': response.id,
        'Submitted At': new Date(response.submittedAt).toLocaleString(),
        'Email': response.submitterEmail || 'Not provided'
      };

      form.questions.forEach(question => {
        row[question.text] = response.answers[question.id] || '';
      });

      return row;
    });

    const csv = Papa.unparse(csvData);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);
    link.setAttribute('href', url);
    link.setAttribute('download', `${form.title}_responses.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const COLORS = ['#3B82F6', '#8B5CF6', '#EF4444', '#10B981', '#F59E0B', '#EC4899'];

  if (!form) {
    return (
      <div className="min-h-[calc(100vh-200px)] flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Form not found</h2>
          <p className="text-gray-600">The form you're looking for doesn't exist.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link
            to="/dashboard"
            className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors"
          >
            <ArrowLeft className="h-5 w-5" />
            <span>Back to Dashboard</span>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{form.title}</h1>
            <p className="text-gray-600">Form responses and analytics</p>
          </div>
        </div>
        
        {responses.length > 0 && (
          <button
            onClick={exportToCSV}
            className="flex items-center space-x-2 px-6 py-3 bg-green-600 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
          >
            <Download className="h-5 w-5" />
            <span>Export CSV</span>
          </button>
        )}
      </div>

      <div className="flex space-x-1 bg-gray-100 rounded-lg p-1">
        <button
          onClick={() => setActiveTab('responses')}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            activeTab === 'responses'
              ? 'bg-white text-blue-600 shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          <Users className="h-4 w-4 inline mr-2" />
          Responses ({responses.length})
        </button>
        <button
          onClick={() => setActiveTab('analytics')}
          className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
            activeTab === 'analytics'
              ? 'bg-white text-blue-600 shadow-sm'
              : 'text-gray-600 hover:text-gray-900'
          }`}
        >
          <BarChart3 className="h-4 w-4 inline mr-2" />
          Analytics
        </button>
      </div>

      {activeTab === 'responses' ? (
        <div className="bg-white rounded-xl shadow-lg">
          {responses.length === 0 ? (
            <div className="text-center py-12">
              <Users className="h-16 w-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No responses yet</h3>
              <p className="text-gray-600 mb-6">Share your form to start collecting feedback</p>
              <div className="inline-flex items-center space-x-2 px-4 py-2 bg-blue-50 text-blue-700 rounded-lg">
                <span className="font-medium">Share URL:</span>
                <code className="text-sm">{window.location.origin}/form/{form.id}</code>
              </div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Response
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Submitted At
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Email
                    </th>
                    {form.questions.map((question, index) => (
                      <th key={question.id} className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Q{index + 1}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {responses.map((response, index) => (
                    <tr key={response.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        #{index + 1}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <div className="flex items-center space-x-1">
                          <Calendar className="h-4 w-4" />
                          <span>{new Date(response.submittedAt).toLocaleString()}</span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <div className="flex items-center space-x-1">
                          <Mail className="h-4 w-4" />
                          <span>{response.submitterEmail || 'Not provided'}</span>
                        </div>
                      </td>
                      {form.questions.map((question) => (
                        <td key={question.id} className="px-6 py-4 text-sm text-gray-900">
                          <div className="max-w-xs truncate" title={response.answers[question.id] as string}>
                            {response.answers[question.id] || '-'}
                          </div>
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      ) : (
        <div className="space-y-6">
          {stats && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Responses</p>
                    <p className="text-3xl font-bold text-gray-900">{stats.totalResponses}</p>
                  </div>
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Users className="h-6 w-6 text-blue-600" />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Total Questions</p>
                    <p className="text-3xl font-bold text-gray-900">{form.questions.length}</p>
                  </div>
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                    <BarChart3 className="h-6 w-6 text-purple-600" />
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Completion Rate</p>
                    <p className="text-3xl font-bold text-gray-900">
                      {stats.totalResponses > 0 ? '100%' : '0%'}
                    </p>
                  </div>
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                    <BarChart3 className="h-6 w-6 text-green-600" />
                  </div>
                </div>
              </div>
            </div>
          )}

          {responses.length > 0 && (
            <div className="space-y-6">
              {form.questions.map((question, index) => {
                const questionStats = stats?.questionStats[question.id];
                if (!questionStats) return null;

                return (
                  <div key={question.id} className="bg-white rounded-xl shadow-lg p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                      Q{index + 1}: {question.text}
                    </h3>
                    
                    {question.type === 'multiple-choice' && questionStats.optionCounts ? (
                      <div className="grid md:grid-cols-2 gap-6">
                        <div>
                          <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={Object.entries(questionStats.optionCounts).map(([option, count]) => ({ option, count }))}>
                              <CartesianGrid strokeDasharray="3 3" />
                              <XAxis dataKey="option" />
                              <YAxis />
                              <Tooltip />
                              <Bar dataKey="count" fill="#3B82F6" />
                            </BarChart>
                          </ResponsiveContainer>
                        </div>
                        <div>
                          <ResponsiveContainer width="100%" height={300}>
                            <PieChart>
                              <Pie
                                data={Object.entries(questionStats.optionCounts).map(([option, count]) => ({ option, count }))}
                                cx="50%"
                                cy="50%"
                                labelLine={false}
                                label={({ option, count }) => `${option}: ${count}`}
                                outerRadius={80}
                                fill="#8884d8"
                                dataKey="count"
                              >
                                {Object.entries(questionStats.optionCounts).map((entry, index) => (
                                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                ))}
                              </Pie>
                              <Tooltip />
                            </PieChart>
                          </ResponsiveContainer>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <p className="text-sm text-gray-600">
                          {questionStats.totalAnswers} text responses
                        </p>
                        <div className="max-h-60 overflow-y-auto space-y-2">
                          {questionStats.textAnswers?.map((answer, answerIndex) => (
                            <div key={answerIndex} className="p-3 bg-gray-50 rounded-lg">
                              <p className="text-sm text-gray-700">{answer}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default FormResponses;