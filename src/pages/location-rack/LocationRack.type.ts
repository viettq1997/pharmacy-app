export type TLocationRackInfo = {
    id: string | null;
    position: string;
    createdDate: string;
    createdBy?: string;
    updatedDate?: string | null;
    updatedBy?: string | null;
};

export type TGetLocationRackData = {
    content: TLocationRackInfo[];
    size: number;
    number: number;
    totalElement: number;
};

export type TGetLocationRackResponse = {
    data: TGetLocationRackData | null;
};

export enum MutationActions {
    CREATE,
    EDIT,
    DELETE
}
