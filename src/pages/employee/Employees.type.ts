import {InfoBaseContextInterface, ResponseListBaseInterface} from "@/types/CommonTypes.ts";

export interface EmployeeInterface {
    id?: string;
    username: string;
    role: string;
    password: string;
    firstName: string;
    lastName: string;
    birthDate: string;
    age: number;
    sex: string;
    type: string;
    address: string;
    mail: string;
    phoneNo: string;
    updatedDate: string;
    createdDate: string;
    salary: number;
}
export type InfoEmployeeContextInterface = InfoBaseContextInterface<EmployeeInterface>
export type ResponseListEmployeeInterface = ResponseListBaseInterface<EmployeeInterface>
