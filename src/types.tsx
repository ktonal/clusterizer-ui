


export type BlobHash = string;

export type InputFile = {
    id: string
    name: string
    sr: number
    blobHash: BlobHash
}

export type ResultId = string | null;

export type Result = {
    blobHash: BlobHash
}

export type PreProcessing = {
    preProcessingId: string
    inputFileId: InputFile
    resultHash: BlobHash
}

export enum Algorithm {
    KMEANS = "kmeans",
    ARGMAX = "argmax"
}

export type Parameters = {
    [key: string]: string | number
}

export type AnalysisId = string;
export type AnalysisName = string;
export type Analysis = {
    id: AnalysisId;
    name: AnalysisName;

    algorithm: Algorithm;
    parameters: Parameters;

    preProcessingId: string;
    resultHash: BlobHash;
    blocks: Array<Block>
}

export type Label = {
    index: number
    name: string
};

export type BlockId = string;
export type BlockName = string;

export type Block = {
    blockId: BlockId;
    blockName: BlockName;

    label: Label
    blobHash: BlobHash // sound result of applying Query to Analysis

    length_frames: number;
    length_seconds: number;
}
