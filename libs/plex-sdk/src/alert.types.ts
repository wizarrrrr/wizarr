export interface NotificationContainer<T> {
    NotificationContainer: T;
}

export interface ActivityNotification {
    type: "activity";
    size: number;
    ActivityNotification: Array<{
        event: string;
        uuid: string;
        Activity: {
            uuid: string;
            type: "library.update.section";
            cancellable: false;
            userID: 1;
            title: string;
            subtitle: string;
            progress: 0;
        };
    }>;
}

export interface StatusNotification {
    type: "status";
    size: number;
    StatusNotification: Array<{
        title: string;
        description: string;
        notificationName: string;
    }>;
}

export interface TimelineNotification {
    type: "timeline";
    size: number;
    TimelineEntry: Array<{
        /** eg com.plexapp.plugins.library */
        identifier: string;
        sectionID: string;
        itemID: string;
        type: number;
        title: string;
        state: number;
        updatedAt: number;
    }>;
}

export interface ReachabilityNotification {
    type: "reachability";
    size: number;
    TimelineEntry: Array<{
        reachability: false;
    }>;
}

export interface BackgroundProcessingQueueEventNotification {
    type: "backgroundProcessingQueue";
    size: number;
    TimelineEntry: Array<{
        queueID: number;
        event: "queueRegenerated";
    }>;
}

export type AlertTypes = ActivityNotification | StatusNotification | TimelineNotification | ReachabilityNotification | BackgroundProcessingQueueEventNotification;
