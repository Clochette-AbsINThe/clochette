import React from 'react';

import { signOut } from 'next-auth/react';

export default function logout() {
  signOut({ callbackUrl: '/' });
  return <div></div>;
}
