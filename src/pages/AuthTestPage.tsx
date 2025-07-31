import React, { useState } from 'react';
import { authService } from '@/services';
import { Button, Input, Card } from '@/components/ui';

export const AuthTestPage: React.FC = () => {
  const [email, setEmail] = useState('test@example.com');
  const [code, setCode] = useState('');
  const [password, setPassword] = useState('Test123!');
  const [username, setUsername] = useState('testuser');
  const [fullName, setFullName] = useState('Test User');
  const [result, setResult] = useState<string>('');
  const [loading, setLoading] = useState(false);

  const testSendVerification = async (purpose: 'Registration' | 'ForgotPassword') => {
    setLoading(true);
    try {
      const response = await authService.sendVerification(email, 'Email', purpose);
      setResult(`Send ${purpose} Verification: ${JSON.stringify(response, null, 2)}`);
    } catch (error) {
      setResult(`Error: ${error}`);
    } finally {
      setLoading(false);
    }
  };

  const testVerifyCode = async (purpose: 'Registration' | 'ForgotPassword') => {
    setLoading(true);
    try {
      const response = await authService.verifyCode(email, code, 'Email', purpose);
      setResult(`Verify ${purpose} Code: ${JSON.stringify(response, null, 2)}`);
    } catch (error) {
      setResult(`Error: ${error}`);
    } finally {
      setLoading(false);
    }
  };

  const testCompleteRegistration = async () => {
    setLoading(true);
    try {
      const response = await authService.completeRegistration({
        contact: email,
        type: 'Email',
        fullName,
        username,
        password,
        confirmPassword: password,
      });
      setResult(`Complete Registration: ${JSON.stringify(response, null, 2)}`);
    } catch (error) {
      setResult(`Error: ${error}`);
    } finally {
      setLoading(false);
    }
  };

  const testResetPassword = async () => {
    setLoading(true);
    try {
      const response = await authService.resetPassword(email, password, password);
      setResult(`Reset Password: ${JSON.stringify(response, null, 2)}`);
    } catch (error) {
      setResult(`Error: ${error}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Auth API Test Page</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Inputs */}
        <Card>
          <h2 className="text-lg font-semibold mb-4">Test Inputs</h2>
          <div className="space-y-4">
            <Input
              label="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <Input
              label="Verification Code"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder="6-digit code"
            />
            <Input
              label="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <Input
              label="Full Name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
            />
            <Input
              label="Password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
        </Card>

        {/* Test Buttons */}
        <Card>
          <h2 className="text-lg font-semibold mb-4">Test Actions</h2>
          <div className="space-y-2">
            <Button
              onClick={() => testSendVerification('Registration')}
              disabled={loading}
              className="w-full"
            >
              Send Registration Verification
            </Button>
            <Button
              onClick={() => testVerifyCode('Registration')}
              disabled={loading}
              className="w-full"
            >
              Verify Registration Code
            </Button>
            <Button
              onClick={testCompleteRegistration}
              disabled={loading}
              className="w-full"
            >
              Complete Registration
            </Button>
            <hr className="my-4" />
            <Button
              onClick={() => testSendVerification('ForgotPassword')}
              disabled={loading}
              className="w-full"
            >
              Send Forgot Password Verification
            </Button>
            <Button
              onClick={() => testVerifyCode('ForgotPassword')}
              disabled={loading}
              className="w-full"
            >
              Verify Forgot Password Code
            </Button>
            <Button
              onClick={testResetPassword}
              disabled={loading}
              className="w-full"
            >
              Reset Password
            </Button>
          </div>
        </Card>
      </div>

      {/* Results */}
      <Card className="mt-6">
        <h2 className="text-lg font-semibold mb-4">API Response</h2>
        <pre className="bg-gray-100 p-4 rounded text-sm overflow-auto max-h-96">
          {result || 'No result yet...'}
        </pre>
      </Card>
    </div>
  );
};
