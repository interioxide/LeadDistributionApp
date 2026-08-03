export class DataResponseCollectionDto<T> {
    data: T[];

    constructor(data: T[]) {
        this.data = data;
    }
}
