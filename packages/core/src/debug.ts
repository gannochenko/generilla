export class Debug {
    private static enabled = false;

    public static enable() {
        this.enabled = true;
    }

    public static log(what: any) {
        if (!this.enabled) {
            return;
        }

        if (what instanceof Error) {
            // eslint-disable-next-line no-console
            console.error(what);
        } else {
            // eslint-disable-next-line no-console
            console.log(what);
        }
    }
}
