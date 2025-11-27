import { useState } from 'react';
import { Button,  Text } from '@vibe/core';
import { z } from 'zod';
import { saveCredentials } from '../service/credentials';
import Toast from './Toast';

// Define validation schema using Zod
const credentialsSchema = z.object({
  serviceName: z.string().min(3, 'Service Name must be at least 3 characters.'),
  token: z.string().min(3, 'Token must be at least 3 characters.'),
  refreshToken: z.string().optional(),
});

export function Credentials() {
  const [serviceName, setServiceName] = useState('');
  const [token, setToken] = useState('');
 /*  const [refreshToken, setRefreshToken] = useState('');
  const [hasRefreshToken, setHasRefreshToken] = useState(false); */
  const [loading, setLoading] = useState(false);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastType, setToastType] = useState<'positive' | 'negative'>('positive');

  async function handleSubmit() {
    try {
      setLoading(true);

      // Validate inputs
      credentialsSchema.parse({
        serviceName,
        token,
        refreshToken: hasRefreshToken ? refreshToken : undefined,
      });

      const url = new URL(window.location.href);
      const redirectUrl = url.searchParams.get('token');
      if (!redirectUrl) {
        throw new Error('Redirect URL not found in the query parameters.');
      }

      const result = await saveCredentials(
        {
          name: serviceName,
          token,
          refreshToken: hasRefreshToken ? refreshToken : '',
        },
        redirectUrl,
      );

      if (result.status === 200) {
        setToastMessage(`Credentials saved successfully. Redirecting to monday.com...`);
        setToastType('positive');
        setShowToast(true);
        // Redirect on success
        window.location.href = result.data;
      } else {
        Toast;
      }
    } catch (error) {
      console.error(error);
      // Handle validation or server errors
      if (error instanceof z.ZodError) {
        setToastMessage(
          `Validation error: ${error.errors.map((err) => err.message).join(', ')}`,
        );
        setToastType('negative');
        setShowToast(true);
      } else {
        setToastType('negative');
        setToastMessage(
          `An error occurred while saving credentials. Please try again later.`,
        );
        setShowToast(true);
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen w-full flex-col items-center justify-center bg-[#e7ccff] p-4">
      <div className="mb-6">
        <img
          src="./advanced-automations-logo.png"
          alt="Logo"
          className="mx-auto max-w-xs "
        />
      </div>
      <div className="w-full max-w-md rounded-md bg-white p-6 shadow-lg">
        <Text weight={Text.weights.BOLD} className="mb-4 text-center">
          Token Configuration
        </Text>

        <div className="mb-4">
          <Text className="mb-2 block" weight="bold">
            Service Name
          </Text>
          <input
            placeholder="Enter service name"
            value={serviceName}
            onChange={(e) => setServiceName(e.target.value)}
          />
        </div>

        <div className="mb-4">
          <Text className="mb-2 block" weight="bold">
            Token
          </Text>
          <input
            className="w-full"
            placeholder="Enter token"
            value={token}
            onChange={(e) => setToken(e.target.value)}
          />
        </div>

        {/* <div className="mb-4 flex items-center gap-2">
          <Checkbox
            checked={hasRefreshToken}
            onChange={(e) => setHasRefreshToken(e.target.checked)}
          />
          <Text>Has refresh token?</Text>
        </div> */}
        {/* 
        {hasRefreshToken && (
          <div className="mb-4">
            <Text className="mb-2 block">Refresh Token</Text>
            <input
              className="w-full"
              placeholder="Enter refresh token"
              value={refreshToken}
              onChange={(e) => setRefreshToken(e.target.value)}
            />
          </div>
        )} */}

        <Button
          onClick={handleSubmit}
          className="w-full"
          color={Button.colors.PRIMARY}
          disabled={loading}
        >
          {loading ? 'Submitting...' : 'Submit'}
        </Button>
      </div>
      {showToast && (
        <Toast
          message={toastMessage}
          autoHideDuration={4000}
          type={toastType}
          onClose={() => setShowToast(false)}
        />
      )}
    </div>
  );
}
