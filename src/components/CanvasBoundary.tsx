"use client";

import { Component, type ReactNode } from "react";

type Props = { fallback: ReactNode; onError?: (error: Error) => void; children: ReactNode };

// A failed WebGL context or model download shouldn't take the page down with it, so show the fallback instead.
export class CanvasBoundary extends Component<Props, { failed: boolean }> {
  state = { failed: false };

  static getDerivedStateFromError() {
    return { failed: true };
  }

  componentDidCatch(error: Error) {
    this.props.onError?.(error);
  }

  render() {
    return this.state.failed ? this.props.fallback : this.props.children;
  }
}
