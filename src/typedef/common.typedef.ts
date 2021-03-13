export type Error = null | string;

export type Callback<T> = (error: Error, data: T) => void;

export type RequestType = 'schedule' | 'teachers' | 'groups';
