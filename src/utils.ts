/* 



*/

export type Result<TErr, TData> = ["ok", TData] | ["err", TErr];

/* 



*/

export const Id = {
  generate() {
    return Math.random().toString(36).substring(2, 9);
  },
};
