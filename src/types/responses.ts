interface SourceUrl {
  sourceUrl: string;
  priority: number;
  sourceName: string;
  type: string;
  className: string;
  streamerId: string;
  sandbox?: string;
  downloads?: {
    sourceName: string;
    downloadUrl: string;
  };
}