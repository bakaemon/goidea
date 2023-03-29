export enum Flag {
    Closed = 'closed',
    Queue = 'queue',
    Open = 'open',
    Approved = 'approved',
    Deleted = 'deleted',
}
export const FlagNames = Object.keys(Flag).map(key => Flag[key]);