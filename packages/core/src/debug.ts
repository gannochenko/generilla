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
            console.error(what);
        } else {
            console.log(what);
        }
    }
}
