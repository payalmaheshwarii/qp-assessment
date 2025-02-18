import app from "./app";
import { server } from './config/config';

app.listen(server.SERVER_PORT, () => {
  console.log(`Server listening at ${server.SERVER_PORT}`);
});


