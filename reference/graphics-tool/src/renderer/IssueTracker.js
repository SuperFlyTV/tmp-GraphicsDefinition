class IssueTracker {
    constructor () {
        this.issues = []
        this.listeners = []
    }
    add(msg) {
        this.issues.push(msg)
        this.onHasChanged()
    }
    clear() {
        this.issues = []
        this.onHasChanged()
    }
    onHasChanged () {
        if (this.hasChangedDelay) clearTimeout(this.hasChangedDelay)

        this.hasChangedDelay = setTimeout(() => {
            this.hasChangedDelay = null
            for (const listener of this.listeners) {
                listener()
            }
        }, 1)
    }
    listenToChanges(cb) {
        this.listeners.push(cb)
        return {
            stop: () => {
                const i = this.listeners.findIndex(c => c === cb)
                if (i === -1) throw new Error('stop: no index found for callback')
                this.listeners.splice(i, 1)
            }
        }
    }
}
export const issueTracker = new IssueTracker()
