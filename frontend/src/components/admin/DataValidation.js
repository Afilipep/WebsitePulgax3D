import { useState, useEffect } from 'react';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Alert, AlertDescription } from '../ui/alert';
import { CheckCircle2, AlertTriangle, XCircle, RefreshCw } from 'lucide-react';
import api from '../../api';

export function DataValidation() {
  const [validationStatus, setValidationStatus] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  const runValidation = async () => {
    setIsLoading(true);
    try {
      const response = await api.validateData();
      setValidationStatus(response.data);
    } catch (error) {
      console.error('Validation error:', error);
      setValidationStatus({
        status: 'error',
        message: 'Erro ao executar validação',
        errors: ['Falha na comunicação com o servidor'],
        warnings: []
      });
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    runValidation();
  }, []);

  const getStatusIcon = () => {
    if (!validationStatus) return <RefreshCw className="w-5 h-5 animate-spin" />;
    
    switch (validationStatus.status) {
      case 'success':
        return <CheckCircle2 className="w-5 h-5 text-green-600" />;
      case 'warning':
        return <AlertTriangle className="w-5 h-5 text-yellow-600" />;
      case 'error':
        return <XCircle className="w-5 h-5 text-red-600" />;
      default:
        return <RefreshCw className="w-5 h-5" />;
    }
  };

  const getStatusColor = () => {
    if (!validationStatus) return 'bg-gray-100 text-gray-800';
    
    switch (validationStatus.status) {
      case 'success':
        return 'bg-green-100 text-green-800';
      case 'warning':
        return 'bg-yellow-100 text-yellow-800';
      case 'error':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            {getStatusIcon()}
            Validação de Dados
          </CardTitle>
          <Button
            variant="outline"
            size="sm"
            onClick={runValidation}
            disabled={isLoading}
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
            Validar
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {validationStatus && (
          <>
            <Badge className={getStatusColor()}>
              {validationStatus.status === 'success' && '✅ Dados Consistentes'}
              {validationStatus.status === 'warning' && '⚠️ Avisos Encontrados'}
              {validationStatus.status === 'error' && '❌ Erros Encontrados'}
            </Badge>

            <p className="text-sm text-slate-600 dark:text-slate-400">
              {validationStatus.message}
            </p>

            {validationStatus.errors && validationStatus.errors.length > 0 && (
              <Alert className="border-red-200 bg-red-50">
                <XCircle className="h-4 w-4 text-red-600" />
                <AlertDescription>
                  <div className="font-medium text-red-800 mb-2">Erros encontrados:</div>
                  <ul className="list-disc list-inside space-y-1 text-sm text-red-700">
                    {validationStatus.errors.map((error, index) => (
                      <li key={index}>{error}</li>
                    ))}
                  </ul>
                </AlertDescription>
              </Alert>
            )}

            {validationStatus.warnings && validationStatus.warnings.length > 0 && (
              <Alert className="border-yellow-200 bg-yellow-50">
                <AlertTriangle className="h-4 w-4 text-yellow-600" />
                <AlertDescription>
                  <div className="font-medium text-yellow-800 mb-2">Avisos:</div>
                  <ul className="list-disc list-inside space-y-1 text-sm text-yellow-700">
                    {validationStatus.warnings.map((warning, index) => (
                      <li key={index}>{warning}</li>
                    ))}
                  </ul>
                </AlertDescription>
              </Alert>
            )}

            {validationStatus.status === 'success' && (
              <Alert className="border-green-200 bg-green-50">
                <CheckCircle2 className="h-4 w-4 text-green-600" />
                <AlertDescription className="text-green-700">
                  <div className="font-medium">Sistema Sincronizado</div>
                  <div className="text-sm mt-1">
                    Todos os produtos no Admin e na página pública estão sincronizados.
                    As encomendas usam dados consistentes dos produtos reais.
                  </div>
                </AlertDescription>
              </Alert>
            )}
          </>
        )}

        <div className="text-xs text-slate-500 space-y-1">
          <div>• Verifica consistência entre produtos Admin ↔ Frontend</div>
          <div>• Valida referências de categorias</div>
          <div>• Confirma integridade dos dados de encomendas</div>
          <div>• Garante cálculos de preços corretos</div>
        </div>
      </CardContent>
    </Card>
  );
}