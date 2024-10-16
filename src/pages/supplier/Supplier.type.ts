import { FormInstance } from 'antd';

export type TSupplierInfo = {
    id: number | null;
    name?: string;
    address?: string;
    phoneNo?: string;
    mail?: string;
    createdDate?: string;
    createdBy?: string;
    updatedDate?: string;
    updatedBy?: string;
};

export type TGetSupplierData = {
    content: TSupplierInfo[];
    size: number;
    number: number;
    totalElement: number;
};

export type TGetSupplierResponse = {
    data: TGetSupplierData | null;
};

export type TMutationSupplierResponse = {
    data: TSupplierInfo | null;
};

export type TSupplierForm = React.FC<{
    data: TSupplierInfo;
    onChange: (value: TSupplierInfo) => void;
    onFinish: () => void;
    formInstance: FormInstance;
}>;

export enum MutationActions {
    CREATE,
    EDIT,
    DELETE
}
