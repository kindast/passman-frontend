export type RequestState<T> =
  | {
      state: "loading";
    }
  | {
      state: "success";
      code: number;
      data: T;
    }
  | {
      state: "error";
      code: number;
      errors: string[];
    };
