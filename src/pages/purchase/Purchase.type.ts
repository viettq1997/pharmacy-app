import {InfoBaseContextInterface, ResponseListBaseInterface} from "@/types/CommonTypes.ts";

export interface PurchaseInterface {
  id?: string,
  medicineId: string,
  supplierId: string,
  locationRackId: string,
  quantity: number,
  cost: number,
  mfgDate: string,
  expDate: string
  updatedDate: string
  createdDate: string
}
export type InfoPurchaseContextInterface = InfoBaseContextInterface<PurchaseInterface>
export type ResponseListPurchaseInterface = ResponseListBaseInterface<PurchaseInterface>
