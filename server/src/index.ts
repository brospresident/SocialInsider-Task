import App from './App';
import Brands from './controllers/Brands/brands.controller';
import Profiles from './controllers/Profiles/profile.controller';

const app = new App(3000, [
    new Brands(),
    new Profiles()
]);

app.listen();