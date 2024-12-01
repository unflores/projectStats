import { AnalysisEnum } from "@/lib/analyses";
export interface Processor {
  buildOccurances(): Promise<{ occurredAt: string; id: string; type: string }[]>;
}

export enum AvailableProcessorEnum {
  ReleaseCandidates = AnalysisEnum.ReleaseCandidates,
}
