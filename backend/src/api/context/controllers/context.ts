
import { factories } from '@strapi/strapi'
import { UserContext } from '../../user-context/services/user-context';
import { authorize } from '../../../lib/authHelper';

export default factories.createCoreController('api::contribution.contribution', ({ strapi }) => ({

    async find(ctx) {
        let terrainContext;
        try{
            terrainContext = await authorize(strapi, ctx);
        }catch(e){
            return ctx;
        }

        ctx.body = {
            data: terrainContext
        };
    },
}));
