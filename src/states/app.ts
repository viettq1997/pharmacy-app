import { atom } from "jotai"

export const atomApp = atom<{headerText: string, customerSelected: any, noteRefund: string, typeOrder: string}>({
  headerText: "Dashboard",
  customerSelected: null,
  noteRefund: "",
  typeOrder: "order"
})
