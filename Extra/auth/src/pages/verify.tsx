import React, { useState } from 'react';

// This interface defines the props for the EmailVerification component
interface EmailVerificationProps {
  onVerify: (code: string) => void; // Callback to handle verification
}

const EmailVerification: React.FC<EmailVerificationProps> = ({ onVerify }) => {
  const [code, setCode] = useState('');

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setCode(event.target.value);
  };

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    onVerify(code);
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col justify-center items-center">
      <div className="p-8 bg-white rounded-lg shadow-md w-96">
        <h1 className="text-2xl mb-4">Email Verification</h1>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="code" className="block text-sm font-medium text-gray-600">Verification Code</label>
            <input
              id="code"
              type="text"
              className="mt-1 p-2 w-full border rounded-md"
              value={code}
              onChange={handleInputChange}
              required
            />
          </div>
          <button
            type="submit"
            className="w-full p-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
          >
            Verify
          </button>
        </form>
      </div>
    </div>
  );
};

export default EmailVerification;