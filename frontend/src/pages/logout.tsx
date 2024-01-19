import React from 'react';

import { signOut } from 'next-auth/react';

export default function logout() {
  if (typeof window !== 'undefined') {
    signOut({ callbackUrl: '/' });
  }
  return <div></div>;
}
