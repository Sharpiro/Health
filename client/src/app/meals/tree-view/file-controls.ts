import { Injectable } from '@angular/core'
import { BehaviorSubject } from 'rxjs'

export interface FileNode {
    children: FileNode[] | undefined
    filename: string
    type: any
}

export class FileFlatNode {
    constructor(
        public expandable: boolean, public filename: string, public level: number, public type: any) { }
}

@Injectable()
export class FileDatabase {
    dataChange = new BehaviorSubject<FileNode[]>([]);

    get data(): FileNode[] { return this.dataChange.value }

    update(treeData: any) {
        const fileNodes = this.buildFileTree(treeData, 0)
        this.dataChange.next(fileNodes)
    }

    buildFileTree(obj: { [key: string]: any }, level: number): FileNode[] {
        return Object.keys(obj).reduce<FileNode[]>((accumulator, key) => {
            const value = obj[key]

            let children: FileNode[] | undefined
            let type: object | undefined
            if (value != null) {
                if (typeof value === 'object') {
                    children = this.buildFileTree(value, level + 1)
                } else {
                    type = value
                }
            }
            const node = {
                filename: key,
                children,
                type
            }
            return accumulator.concat(node)
        }, [])
    }
}
