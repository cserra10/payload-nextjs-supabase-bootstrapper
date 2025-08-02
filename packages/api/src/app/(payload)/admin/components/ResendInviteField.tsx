'use client';

import React, { useState } from 'react';

import { Button, useDocumentInfo, toast } from '@payloadcms/ui';

interface ResendInviteFieldProps {
  data?: {
    id?: string;
    email?: string;
    isConfirmed?: boolean;
  };
  docData?: {
    id?: string;
    email?: string;
    isConfirmed?: boolean;
  };
  formData?: {
    id?: string;
    email?: string;
    isConfirmed?: boolean;
  };
  path?: string;
  value?: unknown;
  [key: string]: unknown;
}

const ResendInviteField: React.FC<ResendInviteFieldProps> = (props) => {
  // Try using Payload's useDocumentInfo hook to get document data
  const documentInfo = useDocumentInfo();
  console.log('useDocumentInfo:', documentInfo);
  
  // Log all props to see what Payload is actually passing
  console.log('ResendInviteField props:', props);
  console.log('Props keys:', Object.keys(props));
  
  // Try different ways Payload might pass the document data
  const userData = documentInfo || props.docData || props.data || props.formData || props;
  console.log('userData:', userData);
  const [isResending, setIsResending] = useState(false);

  const handleResendInvite = async () => {
    setIsResending(true);

    try {
      const response = await fetch(`/api/users/${userData?.id}/resend-invite`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const result = await response.json();

      if (response.ok) {
        toast.success(result.message || 'Invite sent successfully');
        setTimeout(() => window.location.reload(), 2000);
      } else {
        toast.error(result.error || 'Failed to send invite');
      }
    } catch (_error) {
      toast.error('Failed to send invite');
    } finally {
      setIsResending(false);
    }
  };

  return (
    <div>
      <Button
        onClick={handleResendInvite}
        disabled={isResending}
        buttonStyle="primary"
        size="small"
      >
        {isResending ? 'Sending...' : 'Send Invite'}
      </Button>
    </div>
  );
};

export default ResendInviteField;
