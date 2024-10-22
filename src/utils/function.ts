import { cx } from "class-variance-authority"
import { ClassValue } from "class-variance-authority/types"
import dayjs from "dayjs"
import { twMerge } from "tailwind-merge"

export const cn = (...inputs: ClassValue[]) => twMerge(cx(inputs))

export const convertISODate = (date: string) => {
  return dayjs(date).format("YYYY/MM/DD HH:mm")
}

export const objectIsEmpty = (obj: Record<string, any>) => {
  for (const _ in obj) return false
  return true
}
