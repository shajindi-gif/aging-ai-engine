'use client'

import { useState } from 'react'
import { signIn } from 'next-auth/react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { Mail, Lock, User, Phone, AlertCircle } from 'lucide-react'

export default function RegisterPage() {
  const searchParams = useSearchParams()
  const callbackUrl = searchParams.get('callbackUrl') || '/dashboard'

  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  function updateField(field: string, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  function validate(): string | null {
    if (!form.name.trim()) return '请输入姓名'
    if (!form.email.trim()) return '请输入邮箱'
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) return '请输入有效的邮箱地址'
    if (form.password.length < 6) return '密码至少需要6位'
    if (form.password !== form.confirmPassword) return '两次输入的密码不一致'
    if (form.phone && !/^1[3-9]\d{9}$/.test(form.phone)) return '请输入有效的手机号'
    return null
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')

    const validationError = validate()
    if (validationError) {
      setError(validationError)
      return
    }

    setLoading(true)

    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          password: form.password,
          phone: form.phone || undefined,
        }),
      })

      const data = await res.json()

      if (!res.ok) {
        setError(data.error || '注册失败，请稍后重试')
        return
      }

      // Auto sign-in after successful registration
      const result = await signIn('credentials', {
        email: form.email,
        password: form.password,
        redirect: false,
        callbackUrl,
      })

      if (result?.error) {
        // Registration succeeded but auto-login failed — redirect to login
        window.location.href = '/login'
      } else if (result?.url) {
        window.location.href = result.url
      } else {
        window.location.href = '/dashboard'
      }
    } catch {
      setError('网络错误，请检查连接后重试')
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
          创建账号，开启智慧养老服务
        </p>
      </div>

      {/* Card */}
      <div className="w-full max-w-md">
        <div className="yc-card !p-8 shadow-lg shadow-[var(--color-brand-100)]/20">
          <h2 className="text-center text-xl font-semibold text-[var(--color-text-primary)]">
            注册
          </h2>
          <p className="mt-1 text-center text-sm text-[var(--color-text-muted)]">
            填写信息创建您的账号
          </p>

          {/* Error */}
          {error && (
            <div className="mt-5 flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            {/* Name */}
            <div>
              <label
                htmlFor="name"
                className="mb-1.5 block text-sm font-medium text-[var(--color-text-secondary)]"
              >
                姓名
              </label>
              <div className="relative">
                <User className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--color-text-muted)]" />
                <input
                  id="name"
                  type="text"
                  required
                  autoComplete="name"
                  value={form.name}
                  onChange={(e) => updateField('name', e.target.value)}
                  placeholder="请输入您的姓名"
                  className="w-full rounded-lg border border-[var(--color-border)] bg-white py-2.5 pl-10 pr-4 text-sm text-[var(--color-text-primary)] outline-none transition placeholder:text-[var(--color-text-muted)] focus:border-[var(--color-brand-400)] focus:ring-2 focus:ring-[var(--color-brand-100)]"
                />
              </div>
            </div>

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
                  value={form.email}
                  onChange={(e) => updateField('email', e.target.value)}
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
                  autoComplete="new-password"
                  value={form.password}
                  onChange={(e) => updateField('password', e.target.value)}
                  placeholder="至少6位密码"
                  className="w-full rounded-lg border border-[var(--color-border)] bg-white py-2.5 pl-10 pr-4 text-sm text-[var(--color-text-primary)] outline-none transition placeholder:text-[var(--color-text-muted)] focus:border-[var(--color-brand-400)] focus:ring-2 focus:ring-[var(--color-brand-100)]"
                />
              </div>
            </div>

            {/* Confirm Password */}
            <div>
              <label
                htmlFor="confirmPassword"
                className="mb-1.5 block text-sm font-medium text-[var(--color-text-secondary)]"
              >
                确认密码
              </label>
              <div className="relative">
                <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--color-text-muted)]" />
                <input
                  id="confirmPassword"
                  type="password"
                  required
                  autoComplete="new-password"
                  value={form.confirmPassword}
                  onChange={(e) => updateField('confirmPassword', e.target.value)}
                  placeholder="再次输入密码"
                  className="w-full rounded-lg border border-[var(--color-border)] bg-white py-2.5 pl-10 pr-4 text-sm text-[var(--color-text-primary)] outline-none transition placeholder:text-[var(--color-text-muted)] focus:border-[var(--color-brand-400)] focus:ring-2 focus:ring-[var(--color-brand-100)]"
                />
              </div>
            </div>

            {/* Phone (optional) */}
            <div>
              <label
                htmlFor="phone"
                className="mb-1.5 block text-sm font-medium text-[var(--color-text-secondary)]"
              >
                手机号{' '}
                <span className="font-normal text-[var(--color-text-muted)]">
                  (选填)
                </span>
              </label>
              <div className="relative">
                <Phone className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--color-text-muted)]" />
                <input
                  id="phone"
                  type="tel"
                  autoComplete="tel"
                  value={form.phone}
                  onChange={(e) => updateField('phone', e.target.value)}
                  placeholder="13800138000"
                  className="w-full rounded-lg border border-[var(--color-border)] bg-white py-2.5 pl-10 pr-4 text-sm text-[var(--color-text-primary)] outline-none transition placeholder:text-[var(--color-text-muted)] focus:border-[var(--color-brand-400)] focus:ring-2 focus:ring-[var(--color-brand-100)]"
                />
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="yc-btn-primary mt-2 w-full py-3 disabled:cursor-not-allowed disabled:opacity-60"
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
                  注册中...
                </span>
              ) : (
                '注册'
              )}
            </button>
          </form>

          {/* Login link */}
          <p className="mt-6 text-center text-sm text-[var(--color-text-muted)]">
            已有账号？{' '}
            <Link
              href="/login"
              className="font-medium text-[var(--color-brand-600)] transition hover:text-[var(--color-brand-700)] hover:underline"
            >
              登录
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
