import { App } from "antd"
import axios, { AxiosRequestConfig } from "axios"

const useApi = () => {
  const { notification } = App.useApp()

  const get = async (url: string, params?: AxiosRequestConfig["params"]) => {
    try {
      const res = await axios.get(url, { params })
      return res.data
    } catch (e: any) {
      notification.error({
        message: e.response?.data.message,
      })
      return null
    }
  }

  const post = async (url: string, body: Record<string, any>) => {
    try {
      const res = await axios.post(url, body)
      notification.success({
        message: res.data.message,
      })
      return true
    } catch (e: any) {
      notification.error({
        message: e.response?.data.message,
      })
      return false
    }
  }
  return { get, post }
}

export default useApi
