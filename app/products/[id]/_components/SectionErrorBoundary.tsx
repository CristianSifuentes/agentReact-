'use client'

import { Component, type ReactNode, type ErrorInfo } from 'react'

type Props = {
  /**
   * Must be a ReactNode (not a render function) so it can be passed from a
   * Server Component without crossing the serialization boundary.
   * Wrap this component in a feature-specific CLIENT component to provide
   * a fallback that needs access to reset() or the thrown error.
   */
  fallback: ReactNode
  onError?: (error: Error, info: ErrorInfo) => void
  /**
   * When any value in this array changes, the boundary resets automatically.
   * Use to re-try after a navigation change (e.g. reviewPage search param).
   */
  resetKeys?: unknown[]
  children: ReactNode
}

type State = { error: Error | null }

export class SectionErrorBoundary extends Component<Props, State> {
  state: State = { error: null }

  static getDerivedStateFromError(error: Error): State {
    return { error }
  }

  componentDidCatch(error: Error, info: ErrorInfo) {
    this.props.onError?.(error, info)
  }

  componentDidUpdate(prevProps: Props) {
    if (!this.state.error) return
    const { resetKeys } = this.props
    if (!resetKeys) return
    const changed = resetKeys.some((key, i) => key !== prevProps.resetKeys?.[i])
    if (changed) this.setState({ error: null })
  }

  reset = () => this.setState({ error: null })

  render() {
    if (this.state.error) return this.props.fallback
    return this.props.children
  }
}
