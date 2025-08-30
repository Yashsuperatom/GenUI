"use client";
import React from "react";
import { NodeType } from "../types/types";
import { componentRegistry } from "@/app/Registry/CompResgistry"; // 🔑 import your registry

function renderNode(node: NodeType | string | null): React.ReactNode {
  if (!node) return null;

  // Plain text
  if (typeof node === "string") return node;

  const { type, props = {}, children } = node;
  const normalized = type.toLowerCase(); // normalize "Card" vs "card"

  // 🔑 If it's in our registry → render mapped component
  if (componentRegistry[normalized]) {
    const Component = componentRegistry[normalized];
    return (
      <Component {...props}>
        {Array.isArray(children)
          ? children.map((child, i) => <React.Fragment key={i}>{renderNode(child)}</React.Fragment>)
          : renderNode(children ?? null)}
      </Component>
    );
  }

  // Otherwise → fallback to standard HTML tag
  return React.createElement(
    type,
    props,
    Array.isArray(children)
      ? children.map((child, i) => <React.Fragment key={i}>{renderNode(child)}</React.Fragment>)
      : renderNode(children ?? null)
  );
}

export function UIBlockRenderer({ block }: { block: NodeType }) {
  return <>{renderNode(block)}</>;
}
