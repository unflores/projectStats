export type DataSeries = {
  id: string;
  color: string;
  data: {
    x: string | number;
    y: number;
  }[];
};
