import { UsePaginationInstanceProps, UsePaginationState } from "react-table";

declare module "react-table" {
  export interface TableInstance<D extends object = {}> extends UsePaginationInstanceProps<D> {}
  export interface TableState<D extends object = {}> extends UsePaginationState<D> {}
}