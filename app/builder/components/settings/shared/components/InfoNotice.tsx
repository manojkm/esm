"use client";

import React from "react";

/**
 * Small blue info capsule used to communicate helper notes within accordions.
 */
export const InfoNotice: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="bg-blue-50 border border-blue-200 rounded-md p-3 mt-3">
    <p className="text-xs text-blue-700">{children}</p>
  </div>
);

