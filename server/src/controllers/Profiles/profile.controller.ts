import express from "express";
import IController from "../controller";
import axios, { AxiosRequestConfig } from "axios";

class Profiles implements IController {
    public router: express.Router;
    public path: string;
    public constructor() {
        this.router = express.Router();
        this.path = "/profile";
        this.initRoutes();
    }

    public initRoutes(): void {
        this.router.get(`${this.path}`, this.getData);
    }

    public async getData(req: express.Request, res: express.Response) {
        res.header("Access-Control-Allow-Origin", "http://localhost:8080");
        const id = req.query?.id as string;
        let start: number = 0, end: number = 0;

        if (req.query?.start && req.query?.end) {
            start = parseInt(req.query.start as string);
            end = parseInt(req.query.end as string);
        }

        const type = req.query?.type as string;

        const data = {
            method: 'socialinsider_api.get_profile_data',
            id: 1,
            params: {
                id: id,
                profile_type: type,
                date: {
                    start: start,
                    end: end,
                    timezone: "Europe/London"
                }
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
            return res.status(200).json(response.data.resp[data.params.id]);
        }
        catch (error) {
            console.log(error);
            return res.status(500).json(error);
        }
    }
}

export default Profiles;