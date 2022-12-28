export type Result<TErr, TData> = ["ok", TData] | ["err", TErr];
