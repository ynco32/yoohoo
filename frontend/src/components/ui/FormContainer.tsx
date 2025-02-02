import React from 'react';

import { ReactNode } from 'react';

const FormContainer = ({ children }: { children: ReactNode }) => {
  return (
    <div className="min-h-screen bg-background-default">
      <div className="container mx-auto py-6">
        <div className="rounded-layout bg-white p-6 shadow-card">
          {children}
        </div>
      </div>
    </div>
  );
};

export default FormContainer;
