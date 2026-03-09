import { vi } from "vitest";

export function createMockDb() {
  const where = vi.fn().mockResolvedValue([]);
  const set = vi.fn().mockReturnValue({ where });
  const update = vi.fn().mockReturnValue({ set });
  const values = vi.fn().mockResolvedValue([]);
  const insert = vi.fn().mockReturnValue({ values });

  return {
    update,
    insert,
    query: {
      dateRequests: { findFirst: vi.fn(), findMany: vi.fn() },
      deposits: { findFirst: vi.fn(), findMany: vi.fn() },
      users: { findFirst: vi.fn(), findMany: vi.fn() },
      profiles: { findFirst: vi.fn() },
      subscriptions: { findFirst: vi.fn() },
    },
  };
}

export type MockDb = ReturnType<typeof createMockDb>;
