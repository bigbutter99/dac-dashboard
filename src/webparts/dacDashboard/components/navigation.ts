export type HashQuery = { [key: string]: string | undefined };

export type HashNavigate = (path: string, qs?: HashQuery) => void;
