export type Venue = {
  id: string | number
  name: string
  address: string
  description?: string
  capacity?: number
  price?: number
  images?: string[]
  image?: string // some APIs use a single image
}
export type BookingPayload = {
  venueId: string | number
  date: string
  time: string
  duration: number
}

export type BookingResponse = {
  id?: string | number
  venueId?: string | number
  date?: string
  time?: string
  duration?: number
  message?: string
  [key: string]: any
}

function getApiBaseUrl() {
  // Supports both client and server usage
  const isClient = typeof window !== "undefined"
  const clientBase = isClient ? process.env.NEXT_PUBLIC_API_BASE_URL || "https://venuebackend.vercel.app" : ""
  const serverBase = process.env.API_BASE_URL || process.env.NEXT_PUBLIC_API_BASE_URL || "https://venuebackend.vercel.app"
  const base = isClient ? clientBase : serverBase
  if (!base) {
    console.warn("[api] Missing API base URL. Set NEXT_PUBLIC_API_BASE_URL (and optionally API_BASE_URL).")
  }
  return base.replace(/\/+$/, "")
}

export function apiUrl(path: string) {
  return `${getApiBaseUrl()}${path.startsWith("/") ? path : `/${path}`}`
}

export async function getJSON<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(apiUrl(path), {
    ...init,
    headers: {
      Accept: "application/json",
      ...(init?.headers || {}),
    },
    cache: "no-store",
  })
  const data = await res.json().catch(() => ({}))
  if (!res.ok) {
    const msg = (data && (data.error || data.message)) || `Request failed: ${res.status}`
    throw new Error(msg)
  }
  return data as T
}

export async function postJSON<T>(path: string, body: unknown, init?: RequestInit): Promise<T> {
  const res = await fetch(apiUrl(path), {
    method: "POST",
    ...init,
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      ...(init?.headers || {}),
    },
    body: JSON.stringify(body),
  })
  const data = await res.json().catch(() => ({}))
  if (!res.ok) {
    const msg = (data && (data.error || data.message)) || `Request failed: ${res.status}`
    throw new Error(msg)
  }
  return data as T
}

function getAuthHeaderFromStorage() {
  try {
    if (typeof window === "undefined") return {}
    const token = localStorage.getItem("auth_token")
    return token ? { Authorization: `Bearer ${token}` } : {}
  } catch {
    return {}
  }
}

export async function privateGet<T>(path: string, init?: RequestInit): Promise<T> {
  const headers = {
    ...(init?.headers || {}),
    ...getAuthHeaderFromStorage(),
  }
  return getJSON<T>(path, { ...init, headers })
}

export async function privatePost<T>(path: string, body: unknown, init?: RequestInit): Promise<T> {
  const headers = {
    "Content-Type": "application/json",
    Accept: "application/json",
    ...(init?.headers || {}),
    ...getAuthHeaderFromStorage(),
  }
  return postJSON<T>(path, body, { ...init, headers })
}

export function getBaseUrl(): string {
  return getApiBaseUrl()
}
