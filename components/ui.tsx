"use client";

import React from "react";

function cx(...classes: (string | false | null | undefined)[]) {
  return classes.filter(Boolean).join(" ");
}

export function Button({
  variant = "primary",
  className,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "danger" | "ghost";
}) {
  const styles = {
    primary: "bg-sen text-white hover:bg-sen-dark disabled:opacity-50",
    secondary:
      "bg-white text-sen border border-sen/30 hover:bg-sen-light disabled:text-slate-400",
    danger: "bg-red-600 text-white hover:bg-red-700 disabled:bg-red-300",
    ghost: "text-slate-600 hover:bg-lotus-light disabled:text-slate-400",
  };
  return (
    <button
      className={cx(
        "inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold transition-colors disabled:cursor-not-allowed",
        styles[variant],
        className
      )}
      {...props}
    />
  );
}

export function Input({
  label,
  error,
  className,
  id,
  ...props
}: React.InputHTMLAttributes<HTMLInputElement> & {
  label?: string;
  error?: string;
}) {
  const inputId = id || label;
  return (
    <div className="w-full">
      {label && (
        <label
          htmlFor={inputId}
          className="mb-1 block text-sm font-medium text-slate-700"
        >
          {label}
        </label>
      )}
      <input
        id={inputId}
        className={cx(
          "w-full rounded-xl border px-3 py-2 text-sm outline-none transition-colors focus:border-sen focus:ring-2 focus:ring-sen-light",
          error ? "border-red-400" : "border-slate-300",
          className
        )}
        {...props}
      />
      {error && <p className="mt-1 text-xs text-red-600">{error}</p>}
    </div>
  );
}

export function Card({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div
      className={cx(
        "rounded-2xl border border-lotus-light bg-white p-5 shadow-sm",
        className
      )}
    >
      {children}
    </div>
  );
}

export function Badge({
  color,
  children,
}: {
  color: "green" | "gray" | "red" | "yellow";
  children: React.ReactNode;
}) {
  const styles = {
    green: "bg-green-100 text-green-700",
    gray: "bg-slate-100 text-slate-600",
    red: "bg-red-100 text-red-700",
    yellow: "bg-amber-100 text-amber-700",
  };
  return (
    <span
      className={cx(
        "inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-xs font-medium",
        styles[color]
      )}
    >
      {children}
    </span>
  );
}

export function Alert({
  kind = "error",
  children,
}: {
  kind?: "error" | "success";
  children: React.ReactNode;
}) {
  return (
    <div
      className={cx(
        "rounded-lg px-3 py-2 text-sm",
        kind === "error"
          ? "bg-red-50 text-red-700 border border-red-200"
          : "bg-green-50 text-green-700 border border-green-200"
      )}
    >
      {children}
    </div>
  );
}

export function Modal({
  open,
  onClose,
  title,
  children,
}: {
  open: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}) {
  if (!open) return null;
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md rounded-xl bg-white p-6 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <h3 className="mb-4 text-lg font-semibold text-slate-900">{title}</h3>
        {children}
      </div>
    </div>
  );
}

export function Spinner() {
  return (
    <div className="flex justify-center py-10">
      <div className="h-8 w-8 animate-spin rounded-full border-2 border-lotus-light border-t-sen" />
    </div>
  );
}
