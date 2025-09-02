import type { ClassValue } from "clsx"
import { clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function runSequentially<T>(tasks: Array<() => Promise<T>>): Promise<T[]> {
  return tasks.reduce((promise, task) => {
    return promise.then(results => {
      return task().then(result => {
        results.push(result)
        return results
      })
    })
  }, Promise.resolve([] as T[]))
}