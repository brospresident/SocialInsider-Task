import express from 'express';
import IController from './controllers/Brands/brands.controller';
import cors from 'cors';

/**
 * Class that handles everything related to the server
 * @class App
 * @classdesc The App class handles everything related to the server
 */
class App {
    public app: express.Application;
    private readonly port: number;

    public constructor (port: number, controllers: IController[]) {
        this.app = express();
        this.port = port;

        this.app.all('*', (req: express.Request, res: express.Response, next: express.NextFunction) => {
            res.header("Access-Control-Allow-Origin", "http://localhost:8080");
            next();
        });

        this.initializeControllers(controllers);
        this.app.use(express.json());

        const allowedOrigins = ['http://localhost:8080'];
        this.app.use(cors({
            origin: allowedOrigins,
            credentials: false
        }));
    }

    /*
    * Initializes the controllers
    * @param {IController[]} controllers - The controllers to initialize
    * @returns {void}
    */
    private initializeControllers(controllers: IController[]): void {
        for (const controller of controllers) {
            this.app.use(`/api`, controller.router);
        }
    }

    public listen(): void {
        this.app.listen(this.port, () => {
            console.log(`Brand compare backend listening on the port ${this.port}`);
        });
    }
}

export default App;