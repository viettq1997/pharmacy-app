import { FC, memo, useContext, useEffect } from "react"
import { MedicineContext } from "./MedicineContext"

type TMedicine = FC

const Medicine: TMedicine = () => {
  const infoMedicine = useContext(MedicineContext)

  useEffect(() => {
    console.log(infoMedicine)
  }, [infoMedicine])

  return (
    <div>
      <div>Medicine</div>
      <div>Medicine</div>
      <div>Medicine</div>
      <div>Medicine</div>
      <div>Medicine</div>
      <div>Medicine</div>
      <div>Medicine</div>
      <div>Medicine</div>
      <div>Medicine</div>
      <div>Medicine</div>
      <div>Medicine</div>
      <div>Medicine</div>
      <div>Medicine</div>
      <div>Medicine</div>
      <div>Medicine</div>
      <div>Medicine</div>
      <div>Medicine</div>
      <div>Medicine</div>
      <div>Medicine</div>
      <div>Medicine</div>
      <div>Medicine</div>
      <div>Medicine</div>
      <div>Medicine</div>
      <div>Medicine</div>
      <div>Medicine</div>
      <div>Medicine</div>
      <div>Medicine</div>
      <div>Medicine</div>
      <div>Medicine</div>
      <div>Medicine</div>
      <div>Medicine</div>
      <div>Medicine</div>
      <div>Medicine</div>
      <div>Medicine</div>
      <div>Medicine</div>
      <div>Medicine</div>
      <div>Medicine</div>
      <div>Medicine</div>
      <div>Medicine</div>
      <div>Medicine</div>
      <div>Medicine</div>
      <div>Medicine</div>
      <div>Medicine</div>
      <div>Medicine</div>
      <div>Medicine</div>
      <div>Medicine</div>
      <div>Medicine</div>
      <div>Medicine</div>
      <div>Medicine</div>
      <div>Medicine</div>
      <div>Medicine</div>
      <div>Medicine</div>
      <div>Medicine</div>
      <div>Medicine</div>
      <div>Medicine</div>
      <div>Medicine</div>
      <div>Medicine</div>
      <div>Medicine</div>
      <div>Medicine</div>
      <div>Medicine</div>
      <div>Medicine</div>
      <div>Medicine</div>
      <div>Medicine</div>
      <div>Medicine</div>
      <div>Medicine</div>
      <div>Medicine</div>
      <div>Medicine</div>
      <div>Medicine</div>
      <div>Medicine</div>
      <div>Medicine</div>
      <div>Medicine</div>
      <div>Medicine</div>
      <div>Medicine</div>
      <div>Medicine</div>
      <div>Medicine</div>
      <div>Medicine</div>
      <div>Medicine</div>
      <div>Medicine</div>
      <div>Medicine</div>
      <div>Medicine</div>
      <div>Medicine</div>
      <div>Medicine</div>
      <div>Medicine</div>
      <div>Medicine</div>
      <div>Medicine</div>
    </div>
  )
}

export default memo(Medicine)
