import { PassportStrategy } from '@nestjs/passport';
import { Strategy, VerifyCallback } from 'passport-google-oauth20';
import { config } from 'dotenv';

import { Injectable } from '@nestjs/common';

config();

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
    constructor() {
        super({
            clientID: '1034622234436-iq5dig17t1f9r6vke8suav63jvfiivn3.apps.googleusercontent.com',
            clientSecret: 'CgDlU0QNL7Sct9EXTK-8CWkE',
            callbackURL: 'http://localhost:8000/api/v1/auth/google/callback',
            scope: ['email', 'profile'],
            function(req, res){
                res.json({
                    funcion: "entro a la funcioncita",
                    usuario: req.user})
            }
        });
    }
    async validate(accessToken: string, refreshToken: string, profile: any, done: VerifyCallback): Promise<any> {
        const { name, emails, photos } = profile
       
        const user = {
            email: emails[0].value,
            firstName: name.givenName,
            lastName: name.familyName,
            picture: photos[0].value,
            accessToken
        }

        done(null, user);
    }
}