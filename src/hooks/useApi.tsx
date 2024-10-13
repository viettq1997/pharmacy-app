import { App } from "antd"
import axios, { AxiosRequestConfig } from "axios"
import { useCookies } from "react-cookie"

const useApi = () => {
  const { notification } = App.useApp()
  const [{ token }] = useCookies(["token"])

  const api = axios.create({
    baseURL: import.meta.env.VITE_BASE_URL,
    timeout: 10000,
    withCredentials: true,
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })

  const get = async (url: string, params?: AxiosRequestConfig["params"]) => {
    try {
      const res = await api.get(url, { params })
      return res.data
    } catch (e: any) {
      notification.error({
        message: e.response?.data.message || "Something went wrong",
      })
      return null
    }
  }

  const post = async (url: string, body: Record<string, any>) => {
    try {
      const res = await api.post(url, body)
      if (res.data) return true
      return false
    } catch (e: any) {
      notification.error({
        message: e.response?.data.message || "Something went wrong",
      })
      return false
    }
  }

  const put = async (url: string, id: string, body: Record<string, any>) => {
    try {
      const res = await api.put(`${url}/${id}`, body)
      if (res.data) return true
      return false
    } catch (e: any) {
      notification.error({
        message: e.response?.data.message || "Something went wrong",
      })
      return false
    }
  }

  const del = async (url: string, id: string) => {
    try {
      const res = await api.delete(`${url}/${id}`)
      if (res.data) return true
      return false
    } catch (e: any) {
      notification.error({
        message: e.response?.data.message || "Something went wrong",
      })
      return false
    }
  }
  return { get, post, put, del }
}

export default useApi
