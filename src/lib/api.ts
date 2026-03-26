const BASE = "";

async function request<T>(url: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE}${url}`, {
    headers: { "Content-Type": "application/json", ...options?.headers },
    ...options,
  });
  if (!res.ok) {
    const body = await res.json().catch(() => ({}));
    throw new Error(body.error || `Request failed: ${res.status}`);
  }
  return res.json();
}

// ============ Explore ============

export async function fetchExploreWorks(category?: string, q?: string) {
  const params = new URLSearchParams();
  if (category && category !== "全部") params.set("category", category);
  if (q) params.set("q", q);
  return request<unknown[]>(`/api/explore?${params}`);
}

// ============ Templates ============

export async function fetchTemplates(category?: string, q?: string) {
  const params = new URLSearchParams();
  if (category && category !== "全部") params.set("category", category);
  if (q) params.set("q", q);
  return request<unknown[]>(`/api/templates?${params}`);
}

export async function cloneTemplate(templateId: string) {
  return request(`/api/templates/${templateId}/clone`, { method: "POST" });
}

// ============ Projects ============

export async function fetchProjects() {
  return request<unknown[]>("/api/projects");
}

export async function createProject(data: { name?: string; description?: string; canvasData?: unknown }) {
  return request("/api/projects", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function fetchProject(id: string) {
  return request(`/api/projects/${id}`);
}

export async function updateProject(id: string, data: Record<string, unknown>) {
  return request(`/api/projects/${id}`, {
    method: "PATCH",
    body: JSON.stringify(data),
  });
}

export async function deleteProject(id: string) {
  return request(`/api/projects/${id}`, { method: "DELETE" });
}

export async function duplicateProject(id: string) {
  return request(`/api/projects/${id}/duplicate`, { method: "POST" });
}

// ============ Generation ============

export async function generateContent(data: {
  type: "image" | "video";
  prompt: string;
  model: string;
  params?: Record<string, unknown>;
  projectId?: string;
}) {
  return request<{
    id: string;
    status: string;
    outputUrl?: string;
    creditCost?: number;
    creditsRemaining?: number;
    error?: string;
  }>("/api/generate", {
    method: "POST",
    body: JSON.stringify(data),
  });
}

export async function fetchGenerations(filters?: {
  type?: string;
  status?: string;
  projectId?: string;
}) {
  const params = new URLSearchParams();
  if (filters?.type) params.set("type", filters.type);
  if (filters?.status) params.set("status", filters.status);
  if (filters?.projectId) params.set("projectId", filters.projectId);
  return request<unknown[]>(`/api/generations?${params}`);
}

// ============ User ============

export async function fetchUserCredits() {
  return request<{
    credits: number;
    plan: string;
    maxCredits: number;
    totalGenerations: number;
    totalProjects: number;
  }>("/api/user/credits");
}

export async function registerUser(data: {
  email: string;
  password: string;
  name?: string;
}) {
  return request("/api/auth/register", {
    method: "POST",
    body: JSON.stringify(data),
  });
}
