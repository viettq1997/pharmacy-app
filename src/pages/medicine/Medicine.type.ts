export type TInfoMedicine = {
  id: string
  name: string
  quantity: number
  price: number
  category: string
  locationRack: string
  createdDate: string
  updatedDate: string
  createdBy: string
  updatedBy: string
}

export type TInfoContext = {
  data: TInfoMedicine[]
  total: number
  loading: boolean
	setPage: (page: number) => void
}

export type TDataGetMedicine = {
  content: TInfoMedicine[]
  totalElement: number
  size: number
  number: number
}
