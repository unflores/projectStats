export interface Processor {
  buildOccurances(): Promise<{ timestamp: string; id: string; type: string }[]>;
}

export enum ProcessorName {
  ReleaseCandidates = "ReleaseCandidates",
}
