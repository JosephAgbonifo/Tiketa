import { Router } from "express";
import { signin, signout } from "../controllers/userController";


export default function mountUserEndpoints(router: Router) {
    router.post('/signin', signin);
    router.post('/signout', signout);
}

