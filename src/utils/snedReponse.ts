import { Response } from "express";


type TMetaData = {
  page: number;
  limit: number;
  total: number;
};

type TSendData<T> = {
  success: boolean;
  statusCode: number;
  message: string;
  data: T;
  meta?: TMetaData;
};

export const sentResponse = <T>(res: Response, data: TSendData<T>) => {
  res.status(data.statusCode).json({
    success: data.success,
    statusCode: data.statusCode,
    message: data.message,
    data: data.data,
    meta: data.meta,
  });
};
