export default class NotImplementedError extends Error {
    constructor() {
        super("This method is not implemented");
    }
}