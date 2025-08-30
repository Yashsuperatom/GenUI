"use client";
import React from "react";

type CardProps = {
  title?: string;
  description?: string;
  children?: React.ReactNode;
};

export function Card({ title, description, children }: CardProps) {
  return (
    <div className="rounded-2xl shadow-md border border-gray-200 p-4 bg-white">
      {title && <h2 className="text-lg font-semibold mb-1">{title}</h2>}
      {description && <p className="text-sm text-gray-500 mb-3">{description}</p>}
      <div>{children}</div>
    </div>
  );
}
