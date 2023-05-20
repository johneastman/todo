import uuid from 'react-native-uuid';

export class List {
    name: string;
    id: string
    constructor(name: string, id: string = uuid.v4().toString()) {
        this.name = name;
        this.id = id;
    }
}
