export type TInfoMedicine = {
  id: string
  name: string
  price: number
  categoryId: string
  category: string
  locationRack: string
  createdDate: string
  updatedDate: string
  createdBy: string
  updatedBy: string
}

export type TInfoContext = {
  data: TInfoMedicine[]
  dataCategory: { label: string; value: string }[]
  page: number
  total: number
  loading: boolean
  loadingSubmit: boolean
  setPage: (page: number) => void
  onDelete: (id: string) => void
  onSubmit: (values: any, id?: string) => void
  onSearch: (key: string, value: any) => void
}

export type TDataGetMedicine = {
  content: TInfoMedicine[]
  totalElement: number
  size: number
  number: number
}
