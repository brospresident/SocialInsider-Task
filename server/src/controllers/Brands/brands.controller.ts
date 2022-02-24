import express from 'express';
import IController from '../controller';
import axios, { AxiosRequestConfig } from 'axios';

class Brands implements IController {
    public router: express.Router;
    public path: string;

    public constructor() {
        this.router = express.Router();
        this.path = '/brands';
        this.initRoutes();
    }

    public initRoutes(): void {
        this.router.get(`${this.path}`, this.getData);
    }

    public async getData(req: express.Request, res: express.Response) {
        res.header("Access-Control-Allow-Origin", "http://localhost:8080");
        const data = {
            jsonrpc: '2.0',
            method: 'socialinsider_api.get_brands',
            id: 0,
            params: {
                projectname: 'API_test'
            }
        }
        const axiosConfig: AxiosRequestConfig = {
            method: 'post',
            url: 'https://app.socialinsider.io/api',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': 'Bearer API_KEY_TEST'
            },
            data: JSON.stringify(data)
        };

        try {
            const response = await axios(axiosConfig);
            const brands = response.data.result;
            return res.status(200).json(brands);
        }
        catch (error) {
            console.log(error);
            return res.status(500).json(error);
        }
    }
}

export default Brands;