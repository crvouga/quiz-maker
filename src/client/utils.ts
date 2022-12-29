import { ref } from "vue";

//
//
//
//

export const useHistoryState = <T>(
  key: string,
  initialState: T,
  isState: (x: unknown) => x is T
) => {
  const state = ref<T>(initialState);
  const push = (state: T) => {
    window.history.pushState(
      { ...window.history.state, [key]: state },
      document.title
    );
    window.dispatchEvent(new PopStateEvent("popstate"));
  };
  window.addEventListener("popstate", () => {
    const historyState = window.history.state;
    if (historyState && historyState[key] && isState(historyState[key])) {
      state.value = historyState[key];
    }
  });

  return [state, push] as const;
};

//
//
//
//

export type Result<TErr, TData> = ["ok", TData] | ["err", TErr];

//
//
//
//

export const Id = {
  generate() {
    return Math.random().toString(36).substring(2, 9);
  },
};
