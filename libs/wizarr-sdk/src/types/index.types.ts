export * from "./api/index.types";

export interface ListResponse<T> {
    total_data: number;
    rows: T[];
}
