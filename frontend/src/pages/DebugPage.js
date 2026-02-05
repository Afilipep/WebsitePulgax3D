import { useState, useEffect } from 'react';
import { Layout } from '../components/layout/Layout';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../components/ui/card';
import localAPI from '../localAPI';

export default function DebugPage() {
  const [storageData, setStorageData] = useState({});
  const [testResult, setTestResult] = useState('');

  useEffect(() => {
    loadStorageData();
  }, []);

  const loadStorageData = () => {
    const data = {
      admins: JSON.parse(localStorage.getItem('pulgax-admins') || '[]'),
      customers: JSON.parse(localStorage.getItem('pulgax-customers') || '[]'),
      products: JSON.parse(localStorage.getItem('pulgax-products') || '[]'),
      categories: JSON.parse(localStorage.getItem('pulgax-categories') || '[]'),
      orders: JSON.parse(localStorage.getItem('pulgax-orders') || '[]'),
      messages: JSON.parse(localStorage.getItem('pulgax-messages') || '[]'),
      currentAdmin: JSON.parse(localStorage.getItem('pulgax-admin') || 'null'),
      currentCustomer: JSON.parse(localStorage.getItem('pulgax-customer') || 'null'),
      adminToken: localStorage.getItem('pulgax-token'),
      customerToken: localStorage.getItem('pulgax-customer-token')
    };
    setStorageData(data);
  };

  const testAdminLogin = async () => {
    try {
      setTestResult('Testing admin login...');
      const response = await localAPI.adminLogin({
        email: 'admin@pulgax.com',
        password: 'admin123'
      });
      setTestResult('Admin login successful: ' + JSON.stringify(response, null, 2));
      loadStorageData();
    } catch (error) {
      setTestResult('Admin login failed: ' + error.message);
    }
  };

  const testCustomerRegister = async () => {
    try {
      setTestResult('Testing customer register...');
      const response = await localAPI.customerRegister({
        name: 'Test Customer',
        email: 'customer@test.com',
        password: 'test123',
        phone: '912345678'
      });
      setTestResult('Customer register successful: ' + JSON.stringify(response, null, 2));
      loadStorageData();
    } catch (error) {
      setTestResult('Customer register failed: ' + error.message);
    }
  };

  const clearStorage = () => {
    localStorage.clear();
    localAPI.init();
    loadStorageData();
    setTestResult('Storage cleared and reinitialized');
  };

  return (
    <Layout>
      <div className="max-w-6xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Debug Page</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Test Functions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button onClick={testAdminLogin} className="w-full">
                Test Admin Login
              </Button>
              <Button onClick={testCustomerRegister} className="w-full">
                Test Customer Register
              </Button>
              <Button onClick={clearStorage} variant="destructive" className="w-full">
                Clear Storage & Reinitialize
              </Button>
              <Button onClick={loadStorageData} variant="outline" className="w-full">
                Refresh Data
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Test Result</CardTitle>
            </CardHeader>
            <CardContent>
              <pre className="text-xs bg-slate-100 p-4 rounded overflow-auto max-h-64">
                {testResult || 'No test run yet'}
              </pre>
            </CardContent>
          </Card>
        </div>

        <Card className="mt-6">
          <CardHeader>
            <CardTitle>LocalStorage Data</CardTitle>
          </CardHeader>
          <CardContent>
            <pre className="text-xs bg-slate-100 p-4 rounded overflow-auto max-h-96">
              {JSON.stringify(storageData, null, 2)}
            </pre>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
}