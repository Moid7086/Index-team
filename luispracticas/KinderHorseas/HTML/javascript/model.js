class Model {
    constructor() {
        const storedData = localStorage.getItem('kinderHorseasData');
        this.state = storedData ? JSON.parse(storedData) : {
            likes: 0,
            user: "Visitante"
        };
        this.observers = [];
    }

    subscribe(callback) {
        this.observers.push(callback);
    }

    notify() {
        localStorage.setItem('kinderHorseasData', JSON.stringify(this.state));
        this.observers.forEach(callback => callback(this.state));
    }

    incrementLikes() {
        this.state.likes += 1;
        this.notify(); 
    }
}

export default new Model();