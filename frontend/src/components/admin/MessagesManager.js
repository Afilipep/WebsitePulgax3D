import { useLanguage } from '../../context/LanguageContext';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { toast } from 'sonner';
import { MessageSquare, Trash2 } from 'lucide-react';
import api from '../../api';

export function MessagesManager({ messages, onUpdate }) {
  const { t, language } = useLanguage();

  // Safe fallback for messages
  const safeMessages = Array.isArray(messages) ? messages : [];

  const markAsRead = async (id) => {
    try {
      await api.markMessageRead(id);
      onUpdate();
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const deleteMessage = async (id) => {
    if (!window.confirm(language === 'pt' ? 'Eliminar?' : 'Delete?')) return;
    try {
      await api.deleteMessage(id);
      toast.success(language === 'pt' ? 'Eliminada!' : 'Deleted!');
      onUpdate();
    } catch (error) {
      toast.error(language === 'pt' ? 'Erro' : 'Error');
    }
  };

  return (
    <div className="space-y-6" data-testid="messages-tab">
      <h2 className="text-2xl font-bold text-slate-900 dark:text-white">
        {t('admin.dashboard.messages')}
      </h2>

      <div className="space-y-4">
        {safeMessages.length === 0 ? (
          <div className="bg-white dark:bg-slate-800 rounded-xl p-12 text-center">
            <MessageSquare className="w-12 h-12 mx-auto text-slate-300 mb-4" />
            <p className="text-slate-500">
              {language === 'pt' ? 'Nenhuma mensagem' : 'No messages'}
            </p>
          </div>
        ) : safeMessages.map((msg) => (
          <div
            key={msg.id}
            className={`bg-white dark:bg-slate-800 rounded-xl p-6 shadow-sm ${!msg.read ? 'ring-2 ring-blue-500' : ''}`}
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-semibold text-slate-900 dark:text-white">{msg.name}</h3>
                  {!msg.read && <Badge className="bg-blue-100 text-blue-700">{language === 'pt' ? 'Novo' : 'New'}</Badge>}
                </div>
                <p className="text-sm text-slate-500">{msg.email}</p>
              </div>
              <div className="flex gap-2">
                {!msg.read && (
                  <Button variant="ghost" size="sm" onClick={() => markAsRead(msg.id)}>
                    {language === 'pt' ? 'Marcar lida' : 'Mark read'}
                  </Button>
                )}
                <Button variant="ghost" size="icon" className="text-red-500" onClick={() => deleteMessage(msg.id)}>
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
            <h4 className="font-medium text-slate-900 dark:text-white mb-2">{msg.subject}</h4>
            <p className="text-slate-600 dark:text-slate-400">{msg.message}</p>
            <p className="text-xs text-slate-400 mt-4">
              {new Date(msg.created_at).toLocaleString(language === 'pt' ? 'pt-PT' : 'en-US')}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
}
