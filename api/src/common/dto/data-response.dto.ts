export class DataResponseDto<T> {
    data: T;

    constructor(data: T) {
        this.data = data;
    }
}
