export interface Tasks {
    queues: Task[];
}

export interface Task {
    name: string;
    statuses: string[];
    counts: Counts;
    jobs: Job[];
    pagination: Pagination;
    readOnlyMode: boolean;
    allowRetries: boolean;
    allowCompletedRetries: boolean;
    isPaused: boolean;
    type: string;
}

export interface Counts {
    active: number;
    completed: number;
    delayed: number;
    failed: number;
    paused: number;
    prioritized: number;
    waiting: number;
    "waiting-children": number;
}

export interface Job {
    id: string;
    timestamp: number;
    processedOn: number;
    finishedOn: number;
    progress: number;
    attempts: number;
    delay: number;
    stacktrace: any[];
    opts: Opts;
    data: Data;
    name: string;
    returnValue: ReturnValue;
    isFailed: boolean;
}

export interface Opts {
    attempts: number;
    delay: number;
    removeOnComplete: boolean;
}

export interface Data {}

export interface ReturnValue {}

export interface Pagination {
    pageCount: number;
    range: Range;
}

export interface Range {
    start: number;
    end: number;
}
