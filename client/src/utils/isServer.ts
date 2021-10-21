// Window object is accessible on the browser
// We can use this to our advantages decide wether or not we want to execute a certain query
export const isServer = () => typeof window === 'undefined';