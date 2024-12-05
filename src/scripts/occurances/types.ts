import { AnalysisEnum } from "@/lib/analyses";
export interface Processor {
  buildOccurances(): Promise<{ occurredAt: string; id: string; type: string }[]>;
}

// Processors supported from command-line
export enum AvailableProcessorEnum {
  ReleaseCandidates = AnalysisEnum.ReleaseCandidates,
  LOCChanged = AnalysisEnum.LOCChanged,
}

export enum AvailableAnalysisEnum {
  ReleaseCandidates = AnalysisEnum.ReleaseCandidates,
  LOCChanged = AnalysisEnum.LOCChanged,
  LOCAdded = AnalysisEnum.LOCAdded,
  LOCRemoved = AnalysisEnum.LOCRemoved,
}

export const iso8601Format = "ddd MMM DD HH:mm:ss YYYY Z";
