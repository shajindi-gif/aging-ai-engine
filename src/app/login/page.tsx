'use client'

import { useState } from 'react'
import { signIn } from 'next-auth/react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { Mail, Lock, AlertCircle } from 'lucide-react'

export default function LoginPage() {
  const searchParams = useSearchParams()
  const callbackUrl = searchParams.get('callbackUrl') || '/dashboard'

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [remember, setRemember] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false,
        callbackUrl,
      })

      if (result?.error) {
        setError('邮箱或密码错误，请重试')
      } else if (result?.url) {
        window.location.href = result.url
      }
    } catch {
      setError('登录失败，请稍后重试')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-br from-[var(--color-brand-50)] via-white to-[var(--color-gold-50)] px-4 py-12 sm:px-6 lg:px-8">
      {/* Brand */}
      <div className="mb-8 text-center">
        <Link href="/" className="inline-block">
          <h1 className="text-2xl font-bold tracking-tight text-[var(--color-text-primary)] sm:text-3xl">
            衍策银龄 <span className="yc-text-gradient">AI</span>
          </h1>
        </Link>
        <p className="mt-2 text-sm text-[var(--color-text-muted)]">
          面向中国银发经济的 AI 养老服务基础设施
        </p>
      </div>

      {/* Card */}
      <div className="w-full max-w-md">
        <div className="yc-card !p-8 shadow-lg shadow-[var(--color-brand-100)]/20">
          <h2 className="text-center text-xl font-semibold text-[var(--color-text-primary)]">
            登录
          </h2>
          <p className="mt-1 text-center text-sm text-[var(--color-text-muted)]">
            登录您的衍策银龄账号
          </p>

          {/* Error */}
          {error && (
            <div className="mt-5 flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="mt-6 space-y-5">
            {/* Email */}
            <div>
              <label
                htmlFor="email"
                className="mb-1.5 block text-sm font-medium text-[var(--color-text-secondary)]"
              >
                邮箱
              </label>
              <div className="relative">
                <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--color-text-muted)]" />
                <input
                  id="email"
                  type="email"
                  required
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="your@email.com"
                  className="w-full rounded-lg border border-[var(--color-border)] bg-white py-2.5 pl-10 pr-4 text-sm text-[var(--color-text-primary)] outline-none transition placeholder:text-[var(--color-text-muted)] focus:border-[var(--color-brand-400)] focus:ring-2 focus:ring-[var(--color-brand-100)]"
                />
              </div>
            </div>

            {/* Password */}
            <div>
              <label
                htmlFor="password"
                className="mb-1.5 block text-sm font-medium text-[var(--color-text-secondary)]"
              >
                密码
              </label>
              <div className="relative">
                <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--color-text-muted)]" />
                <input
                  id="password"
                  type="password"
                  required
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="输入密码"
                  className="w-full rounded-lg border border-[var(--color-border)] bg-white py-2.5 pl-10 pr-4 text-sm text-[var(--color-text-primary)] outline-none transition placeholder:text-[var(--color-text-muted)] focus:border-[var(--color-brand-400)] focus:ring-2 focus:ring-[var(--color-brand-100)]"
                />
              </div>
            </div>

            {/* Remember + Forgot */}
            <div className="flex items-center justify-between">
              <label className="flex cursor-pointer items-center gap-2 text-sm text-[var(--color-text-secondary)]">
                <input
                  type="checkbox"
                  checked={remember}
                  onChange={(e) => setRemember(e.target.checked)}
                  className="h-4 w-4 rounded border-[var(--color-border)] text-[var(--color-brand-600)] accent-[var(--color-brand-600)] focus:ring-[var(--color-brand-400)]"
                />
                记住我
              </label>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="yc-btn-primary w-full py-3 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? (
                <span className="inline-flex items-center gap-2">
                  <svg
                    className="h-4 w-4 animate-spin"
                    viewBox="0 0 24 24"
                    fill="none"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
                    />
                  </svg>
                  登录中...
                </span>
              ) : (
                '登录'
              )}
            </button>
          </form>

          {/* Register link */}
          <p className="mt-6 text-center text-sm text-[var(--color-text-muted)]">
            还没有账号？{' '}
            <Link
              href="/register"
              className="font-medium text-[var(--color-brand-600)] transition hover:text-[var(--color-brand-700)] hover:underline"
            >
              注册
            </Link>
          </p>
        </div>

        {/* Footer nav */}
        <div className="mt-6 flex items-center justify-center gap-4 text-xs text-[var(--color-text-muted)]">
          <Link href="/" className="transition hover:text-[var(--color-brand-600)]">
            首页
          </Link>
          <span className="text-[var(--color-border)]">·</span>
          <Link href="/pricing" className="transition hover:text-[var(--color-brand-600)]">
            定价
          </Link>
        </div>
      </div>
    </div>
  )
}
