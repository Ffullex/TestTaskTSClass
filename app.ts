interface Array<T> {
    find(predicate: (value: T, index: number, obj: Array<T>) => boolean, thisArg?: any): T | undefined;
}

interface Array<T> {
    includes(searchElement: T, fromIndex?: number): boolean;
}

type ItemType = {
    id: string | number
    parent: string | number
    type?: string | null
}

const EXAMPLE_ITEMS_FOR_TEST:ItemType[] = [
    { id: 1, parent: 'root' },

    { id: 2, parent: 1, type: 'test' },
    { id: 3, parent: 1, type: 'test' },

    { id: 4, parent: 2, type: 'test' },
    { id: 5, parent: 2, type: 'test' },
    { id: 6, parent: 2, type: 'test' },

    { id: 7, parent: 4, type: null },
    { id: 8, parent: 4, type: null },
];

const items: ItemType[] = [
    { id: 1, parent: 'root' },

    { id: 2, parent: 1, type: 'test' },
    { id: 3, parent: 1, type: 'test' },

    { id: 4, parent: 2, type: 'test' },
    { id: 5, parent: 2, type: 'test' },
    { id: 6, parent: 2, type: 'test' },

    { id: 7, parent: 4, type: null },
    { id: 8, parent: 4, type: null },
];

class TreeStore {
    items: ItemType[];

    constructor(_items: ItemType[]){
        this.items = _items;
    }

    // - getAll() Должен возвращать изначальный массив элементов.
    getAll(): ItemType[] {
        console.log('getAll: ', this.items)

        return this.items
    }

    // - getItem(id) Принимает id элемента и возвращает сам объект элемента;
    getItem(id: number | string): ItemType {
        const result = this.items.find((item: ItemType) => {
            return item.id === id
        })

        console.log( 'getItem: ', result )

        return result
    }

    // - getChildren(id) Принимает id элемента и возвращает массив элементов, являющихся дочерними для того элемента, чей id получен в аргументе. Если у элемента нет дочерних, то должен возвращаться пустой массив;
    getChildren(id: string | number): ItemType[] {
        const result = this.items.filter((item: ItemType) => {
            return item.parent === id
        })

        console.log('getChildren: ',  result)

        return result
    }

    /* - getAllChildren(id) Принимает id элемента и возвращает массив элементов, являющихся прямыми дочерними элементами того,
     чей id получен в аргументе + если у них в свою очередь есть еще дочерние элементы, они все тоже будут включены в результат, и так до самого глубокого уровня. */
    getAllChildren(id: string | number): ItemType[] {
        const result = []
        const parents = [id]

        this.items.forEach((item: ItemType) => {
            if (parents.includes(item.parent)) {
                parents.push(item.id)

                result.push(item)
            }
        })

        console.log('getAllChildren: ', result)

        return result
    }

    // static checkParent = (result: ItemType[], items: ItemType[]): boolean => {
    //     const item = items.find( (item) => {})
    //     return false
    // }

    /* - getAllParents(id) Принимает id элемента и возвращает массив из цепочки родительских элементов, начиная от самого элемента,
    чей id был передан в аргументе и до корневого элемента, т.е. должен получиться путь элемента наверх дерева через цепочку
    родителей к корню дерева. в результате getAllParents ПОРЯДОК ЭЛЕМЕНТОВ ВАЖЕН! */
    getAllParents(id: string | number): ItemType[] {
        const result = []

        let flag = this.items.find((item: ItemType) => {
            return item.id === id
        })

        for (let index = this.items.length - 1; index >= 0; index--) {
            if (this.items[index].id && this.items[index].id === flag.parent){
                result.push(this.items[index])

                flag = JSON.parse(JSON.stringify(this.items[index]))
            }
        }

        console.log('getAllParents: ', result)

        return result
    }
}

const ts = new TreeStore(items);

ts.getAll()

ts.getItem(7)

ts.getChildren(4)

ts.getChildren(5)

ts.getChildren(2)

ts.getAllChildren(2)

    // [
    //     {"id": 4, "parent": 2, "type": "test"},
    //     {"id": 5, "parent": 2, "type": "test"},
    //     {"id": 6, "parent": 2, "type": "test"},
    //     {"id": 7, "parent": 4, "type": null},
    //     {"id": 8, "parent": 4, "type": null}
    // ]

ts.getAllParents(7)

function getAllTest():boolean {
    const testTreeStoreInstance = new TreeStore(EXAMPLE_ITEMS_FOR_TEST);

    const result = testTreeStoreInstance.getAll()

    if(JSON.stringify(result) === JSON.stringify(EXAMPLE_ITEMS_FOR_TEST)) {
        console.warn('Test TreeStore.getAll() success')

        return true
    }

    console.error('Test TreeStore.getAll() denied')

    return false
}

function getItemTest():boolean {
    const testTreeStoreInstance = new TreeStore(EXAMPLE_ITEMS_FOR_TEST);

    const result = testTreeStoreInstance.getItem(7)

    const expectedResult = { id: 7, parent: 4, type: null }

    if(JSON.stringify(result) === JSON.stringify(expectedResult)) {
        console.warn('Test TreeStore.getItem() success')

        return true
    }

    console.error('Test TreeStore.getItem() denied')

    return false
}

function getChildrenTest():boolean {
    const testTreeStoreInstance = new TreeStore(EXAMPLE_ITEMS_FOR_TEST);

    const result = testTreeStoreInstance.getChildren(4)

    const expectedResult = [{ id:7, parent: 4, type: null }, { id: 8,parent: 4, type: null }]

    if(JSON.stringify(result) === JSON.stringify(expectedResult)) {
        console.warn('Test TreeStore.getChildren() success')

        return true
    }

    console.error('Test TreeStore.getChildren() denied')

    return false
}

function getAllChildrenTest():boolean {
    const testTreeStoreInstance = new TreeStore(EXAMPLE_ITEMS_FOR_TEST);

    const result = testTreeStoreInstance.getAllChildren(2)

    const expectedResult =  [
        { id: 4, parent: 2, type: "test" },
        { id: 5, parent: 2, type: "test" },
        { id: 6, parent: 2, type: "test" },
        { id: 7, parent: 4, type: null },
        { id: 8, parent: 4, type: null },
    ]

    if(JSON.stringify(result) === JSON.stringify(expectedResult)) {
        console.warn('Test TreeStore.getAllChildren() success')

        return true
    }

    console.error('Test TreeStore.getAllChildren() denied')

    return false
}

function getAllParentsTest(): boolean {
    const testTreeStoreInstance = new TreeStore(EXAMPLE_ITEMS_FOR_TEST);

    const result = testTreeStoreInstance.getAllParents(7)

    const expectedResult =  [
        { id: 4, parent: 2, type: "test" },
        { id: 2, parent: 1, type: "test"},
        { id: 1, parent: "root"}
    ]

    if(JSON.stringify(result) === JSON.stringify(expectedResult)) {
        console.warn('Test TreeStore.getAllParents() success')

        return true
    }

    console.error('Test TreeStore.getAllParents() denied')

    return false
}

getAllTest()

getItemTest()

getChildrenTest()

getAllChildrenTest()

getAllParentsTest()