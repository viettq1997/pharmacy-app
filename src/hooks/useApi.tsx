import {App} from "antd"
import axios, {AxiosRequestConfig} from "axios"
import {useKeycloak} from "@react-keycloak/web";

const useApi = () => {
  const {notification} = App.useApp()
  const {keycloak} = useKeycloak()
  const hostApi = 'http://localhost:8081/pharmacy/api/v1'//process.env.API_BACKEND
  const apiGet = async (url: string, params?: AxiosRequestConfig["params"]) => {
    try {
      const res = await axios.get(`${hostApi}${url}`, {
        headers: {Authorization: `Bearer ${keycloak.token}`},
        params
      })
      return res.data
    } catch (e: any) {
      notification.error({
        message: e.response?.data.message,
      })
      return null
    }
  }

  const apiPost = async (url: string, body: Record<string, any>) => {
    try {
      const res = await axios.post(`${hostApi}${url}`, body, {
        headers: {Authorization: `Bearer ${keycloak.token}`},
      })
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

  const apiPut = async (url: string, body: Record<string, any>) => {
    try {
      const res = await axios.put(`${hostApi}${url}`, body, {
        headers: {Authorization: `Bearer ${keycloak.token}`},
      })
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

  const apiDelete = async (url: string) => {
    try {
      const res = await axios.delete(`${hostApi}${url}`, {
        headers: {Authorization: `Bearer ${keycloak.token}`},
      })
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
  return {apiGet, apiPost, apiPut, apiDelete}
}

export default useApi
