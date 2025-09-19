export interface Source {
  web: {
    uri: string;
    title: string;
  };
}

export interface HistoryEntry {
  id: string;
  query: string;
  text: string;
  sources: Source[];
}
