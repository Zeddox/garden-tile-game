export class ApiClientBase {
    constructor() { }

    protected async transformOptions(options: RequestInit): Promise<RequestInit> {
        return Promise.resolve(options);
    }
}