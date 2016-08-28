// @flow
export type TransportType = {
    in: (name: string, callback: Function) => void,
    out: (name: string) => (data: any) => void
}