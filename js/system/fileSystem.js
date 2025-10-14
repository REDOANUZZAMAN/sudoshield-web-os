class VirtualFileSystem {
    constructor(initialTree = {}) {
        this.root = this.#createDirectoryNode('/');
        this.subscribers = new Set();
        if (initialTree && typeof initialTree === 'object') {
            this.#mergeTree(this.root, initialTree);
        }
    }

    subscribe(callback) {
        this.subscribers.add(callback);
        return () => this.subscribers.delete(callback);
    }

    notify(event) {
        const payload = { ...event, timestamp: Date.now() };
        this.subscribers.forEach(cb => {
            try {
                cb(payload);
            } catch (error) {
                console.error('[VFS] subscriber error', error);
            }
        });
    }

    list(path = '/') {
        const node = this.#resolve(path);
        if (!node || node.type !== 'directory') {
            throw new Error('Not a directory');
        }
        return Object.entries(node.contents)
            .sort(([aName], [bName]) => aName.localeCompare(bName))
            .map(([name, child]) => ({
                name,
                type: child.type,
                size: child.type === 'file' ? child.size : this.#directorySize(child),
                createdAt: child.createdAt,
                updatedAt: child.updatedAt,
                path: this.#joinPath(path, name)
            }));
    }

    readFile(path) {
        const node = this.#resolve(path);
        if (!node || node.type !== 'file') {
            throw new Error('File not found');
        }
        return node.content;
    }

    writeFile(path, content) {
        const { parent, name } = this.#prepareParent(path);
        const now = Date.now();
        parent.contents[name] = {
            type: 'file',
            content,
            size: this.#byteLength(content),
            createdAt: parent.contents[name]?.createdAt || now,
            updatedAt: now
        };
        parent.updatedAt = now;
        this.notify({ type: 'write', path });
    }

    appendFile(path, content) {
        const existing = this.#resolve(path);
        if (!existing) {
            this.writeFile(path, content);
            return;
        }
        if (existing.type !== 'file') {
            throw new Error('Cannot append to directory');
        }
        const updated = (existing.content || '') + content;
        this.writeFile(path, updated);
    }

    makeDirectory(path) {
        const { parent, name } = this.#prepareParent(path);
        if (parent.contents[name]) {
            throw new Error('Directory already exists');
        }
        parent.contents[name] = this.#createDirectoryNode(name);
        parent.updatedAt = Date.now();
        this.notify({ type: 'mkdir', path });
    }

    remove(path) {
        const { parent, name, node } = this.#resolveWithParent(path);
        if (!node) {
            throw new Error('Path not found');
        }
        delete parent.contents[name];
        parent.updatedAt = Date.now();
        this.notify({ type: 'delete', path });
    }

    rename(path, newName) {
        const { parent, name, node } = this.#resolveWithParent(path);
        if (!node) {
            throw new Error('Path not found');
        }
        if (parent.contents[newName]) {
            throw new Error('Target name already exists');
        }
        delete parent.contents[name];
        parent.contents[newName] = node;
        parent.updatedAt = node.updatedAt = Date.now();
        this.notify({ type: 'rename', path, newPath: this.#joinPath(this.#dirname(path), newName) });
    }

    exists(path) {
        return Boolean(this.#resolve(path));
    }

    stat(path) {
        const node = this.#resolve(path);
        if (!node) {
            throw new Error('Path not found');
        }
        return {
            type: node.type,
            size: node.type === 'file' ? node.size : this.#directorySize(node),
            createdAt: node.createdAt,
            updatedAt: node.updatedAt
        };
    }

    cloneTree() {
        return structuredClone(this.root);
    }

    // Private helpers --------------------------------------------------
    #mergeTree(targetDir, source) {
        Object.entries(source).forEach(([name, child]) => {
            if (child.type === 'directory') {
                const dirNode = this.#createDirectoryNode(name);
                targetDir.contents[name] = dirNode;
                this.#mergeTree(dirNode, child.contents || {});
            } else {
                targetDir.contents[name] = {
                    type: 'file',
                    content: child.content || '',
                    size: this.#byteLength(child.content || ''),
                    createdAt: child.createdAt || Date.now(),
                    updatedAt: child.updatedAt || Date.now()
                };
            }
        });
        targetDir.updatedAt = Date.now();
    }

    #resolve(path) {
        const parts = this.#toParts(path);
        let current = this.root;
        for (const part of parts) {
            if (!current.contents[part]) return null;
            current = current.contents[part];
        }
        return current;
    }

    #resolveWithParent(path) {
        const normalized = this.#normalize(path);
        if (normalized === '/') {
            return { parent: null, name: '/', node: this.root };
        }
        const parts = this.#toParts(path);
        const name = parts.pop();
        const parentPath = '/' + parts.join('/');
        const parent = this.#resolve(parentPath);
        if (!parent || parent.type !== 'directory') {
            throw new Error('Parent directory not found');
        }
        return { parent, name, node: parent.contents[name] };
    }

    #prepareParent(path) {
        const normalized = this.#normalize(path);
        const parts = this.#toParts(normalized);
        const name = parts.pop();
        const parentPath = '/' + parts.join('/');
        const parent = this.#resolve(parentPath);
        if (!parent) {
            throw new Error('Parent directory not found');
        }
        if (parent.type !== 'directory') {
            throw new Error('Parent is not a directory');
        }
        return { parent, name };
    }

    #createDirectoryNode(name) {
        const now = Date.now();
        return {
            type: 'directory',
            contents: {},
            createdAt: now,
            updatedAt: now,
            name
        };
    }

    #byteLength(text) {
        return new TextEncoder().encode(text || '').length;
    }

    #directorySize(dir) {
        let total = 0;
        Object.values(dir.contents).forEach(child => {
            if (child.type === 'file') {
                total += child.size;
            } else {
                total += this.#directorySize(child);
            }
        });
        return total;
    }

    #normalize(path) {
        if (!path) return '/';
        let result = path.trim();
        if (!result.startsWith('/')) {
            result = '/' + result;
        }
        if (result.length > 1 && result.endsWith('/')) {
            result = result.slice(0, -1);
        }
        return result;
    }

    #toParts(path) {
        const normalized = this.#normalize(path);
        if (normalized === '/') return [];
        return normalized.split('/').filter(Boolean);
    }

    #joinPath(base, name) {
        const normalized = this.#normalize(base);
        if (normalized === '/') {
            return `/${name}`;
        }
        return `${normalized}/${name}`;
    }

    #dirname(path) {
        const parts = this.#toParts(path);
        parts.pop();
        return parts.length ? `/${parts.join('/')}` : '/';
    }
}

window.VirtualFileSystem = VirtualFileSystem;
