import { useKeycloak } from "@react-keycloak/web"
import { App } from "antd"
import axios, { AxiosRequestConfig, AxiosRequestHeaders } from "axios"
import { useEffect, useState } from "react"
import { useCookies } from "react-cookie"

const useApi = () => {
  const { notification } = App.useApp()
  const [{ token }, _, removeCookie] = useCookies(["token"])
  const { keycloak } = useKeycloak()
  const [headers, setHeaders] = useState<
    Pick<AxiosRequestHeaders, "Authorization"> | undefined
  >({
    Authorization: `Bearer ${token}`,
  })

  const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    timeout: 10000,
  })

  useEffect(() => {
    if (token)
      setHeaders({
        Authorization: `Bearer ${token}`,
      })
    else setHeaders(undefined)
  }, [token])

  const throwUnauthenticated = (e: any) => {
    setHeaders(undefined)
    removeCookie("token")
    keycloak.updateToken()
    throw e
  }

  const get = async (url: string, params?: AxiosRequestConfig["params"]) => {
    try {
      const res = await api.get(url, { params, headers })
      return res.data.data
    } catch (e: any) {
      if (e.status === 401) throwUnauthenticated(e)
      notification.error({
        message: e.response?.data.message || "Something went wrong",
      })
      return null
    }
  }

  const post = async (url: string, body: Record<string, any>) => {
    try {
      const res = await api.post(url, body, { headers })
      if (res.data) return true
      return false
    } catch (e: any) {
      if (e.status === 401) throwUnauthenticated(e)
      notification.error({
        message: e.response?.data.message || "Something went wrong",
      })
      return false
    }
  }

  const put = async (url: string, id: string, body: Record<string, any>) => {
    try {
      const res = await api.put(`${url}/${id}`, body, { headers })
      if (res.data) return true
      return false
    } catch (e: any) {
      if (e.status === 401) throwUnauthenticated(e)
      notification.error({
        message: e.response?.data.message || "Something went wrong",
      })
      return false
    }
  }

  const del = async (url: string, id: string) => {
    try {
      const res = await api.delete(`${url}/${id}`, { headers })
      if (res.data) return true
      return false
    } catch (e: any) {
      if (e.status === 401) throwUnauthenticated(e)
      notification.error({
        message: e.response?.data.message || "Something went wrong",
      })
      return false
    }
  }
  return { get, post, put, del }
}

export default useApi
