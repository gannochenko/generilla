export class URLParser {
    /**
     * possible urls:
     *      https://github.com/joe/generators/tree/master/awesome.generator
     *      https://github.com/joe/generators.git|master|/awesome.generator
     *      git@github.com:joe/generators.git|master|/awesome.generator
     */
    public static parse(url: string) {
        console.log(url);
        return {
            host: '',
            username: '',
            branch: '',
            path: '',
        };
    }
}
