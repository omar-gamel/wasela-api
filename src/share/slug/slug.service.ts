import { Injectable } from '@nestjs/common';
import slug = require("speakingurl");
import uniqid = require('uniqid');

@Injectable()
export class SlugService {
    constructor() { }

    async generateSlug(name: string): Promise<string> {
        return await `${slug(name, { separator: '-', lang: 'en' })}-${uniqid()}`;
    };
}
