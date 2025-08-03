/* eslint-disable @typescript-eslint/no-explicit-any */
type DataModelID = string | number;

type DataModel = {
  id: DataModelID;
  [key: string]: unknown;
};

type OmitId<T> = Omit<T, 'id'>;

interface PaginationModel {
  page: number;
  pageSize: number;
}

interface FilterModel {
  [key: string]: unknown;
}

interface SortModel {
  field: string;
  direction: 'asc' | 'desc';
}

interface StandardSchemaV1<T> {
  '~standard': {
    validate: (value: T) => { success: boolean; issues?: string[] };
  };
}

type DataSourceState<
  D extends DataModel,
  P = Record<string, unknown>,
> = Partial<D> & {
  params?: P;
};

export interface DataSource<
  D extends DataModel,
  TCreate = Partial<OmitId<D>>,
  TUpdate = Partial<OmitId<D>>,
  P = Record<string, unknown>,
  TSelf = any,
  S = DataSourceState<D, P>,
> {
  createOne?(data: TCreate, params?: P): Promise<TSelf>;

  getMany?(filter: {
    paginationModel?: PaginationModel;
    filterModel?: FilterModel;
    sortModel?: SortModel;
    params?: P;
  }): Promise<TSelf>;

  getOne?(id: DataModelID, params?: P): Promise<TSelf>;

  updateOne?(id: DataModelID, data: TUpdate, params?: P): Promise<TSelf>;

  deleteOne?(id: DataModelID, params?: P): Promise<TSelf>;

  getData?(): Omit<Partial<S>, 'params'>;

  validate?: (
    value: Partial<OmitId<D>>
  ) => ReturnType<
    StandardSchemaV1<Partial<OmitId<D>>>['~standard']['validate']
  >;

  [key: `with${Capitalize<string>}`]: () => Promise<TSelf>;
}
