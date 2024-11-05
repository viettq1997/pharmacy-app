import moment from "moment";
import {FormInstance} from "rc-field-form/lib/interface";

export const maxDateByValue = (field: string, label: string, valueCompare: Date, message?: string) =>
    ({getFieldValue}: FormInstance) => ({
        validator(_: any, value: any) {
            if (!value || getFieldValue(field) <= moment(valueCompare).format('YYYY-MM-DD')) {
                return Promise.resolve();
            }
            return Promise.reject(new Error(message || `${label} must be less than or equal ${moment(valueCompare).format('DD-MM-YYYY HH:mm:ss')}!`));
        },
    })
export const minDateByValue = (field: string, label: string, valueCompare: Date, message?: string) =>
    ({getFieldValue}: FormInstance) => ({
        validator(_: any, value: any) {
            if (!value || getFieldValue(field) >= moment(valueCompare).format('YYYY-MM-DD')) {
                return Promise.resolve();
            }
            return Promise.reject(new Error(message || `${label} must be greater than or equal ${moment(valueCompare).format('DD-MM-YYYY HH:mm:ss')}!`));
        },
    })
export const maxDateByField = (field: string, label: string, fieldCompare: string, message?: string) =>
    ({getFieldValue}: FormInstance) => ({
        validator(_: any, value: any) {
            const valueCompare = getFieldValue(fieldCompare)
            if (!value || !valueCompare || getFieldValue(field) <= valueCompare) {
                return Promise.resolve();
            }
            return Promise.reject(new Error(message || `${label} must be less than or equal ${moment(valueCompare).format('DD-MM-YYYY HH:mm:ss')}!`));
        },
    })
export const minDateByField = (field: string, label: string, fieldCompare: string, message?: string) =>
    ({getFieldValue}: FormInstance) => ({
        validator(_: any, value: any) {
            const valueCompare = getFieldValue(fieldCompare)
            if (!value || !valueCompare || getFieldValue(field) >= valueCompare) {
                return Promise.resolve();
            }
            return Promise.reject(new Error(message || `${label} must be greater than or equal ${moment(valueCompare).format('DD-MM-YYYY HH:mm:ss')}!`));
        },
    })