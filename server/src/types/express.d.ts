declare global {
  namespace Express {
    interface Locals {
      coordinatorId?: string
    }
  }
}

export {}

