
export class Router {
    constructor()
    {
        console.log('coucou router');
    }

    async load () {
        let response = await fetch('routes.json');
        console.log('coucou caca');
        let json = await response.json();

        console.log(json);
        // let fileReader = new FileReader();
        // fileReader.readAsText(new Array(), new File('routes.json', true));
        // JSON.parse(fileReader.text);
    }
}
