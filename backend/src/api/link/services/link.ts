/**
 * link service
 */

import { factories } from '@strapi/strapi';
import { UserContext } from '../../user-context/services/user-context';


export default factories.createCoreService('api::link.link', ({ strapi }) =>  ({
    /**
     * @param {number} contributionId
     * @param {UserContext|null} userContext // if null, assume terrain is public
     * @returns a collection of parent links
     */
    async parentsOfContribution(contributionId: number, userContext:any = null) {

        let data = await strapi.db.query('api::link.link').findMany({
            select: ['id',],
            where: {
                'child': contributionId,
            },
            populate: ['parent.author', 'child.author'],
        });

        // we only want to return the links that point to contributions that are either mine or with state published
        data = data.filter((elem: {
            id:number,
            parent:{state: string, author:{id:number}|null},
            child:{state: string, author:{id:number}|null}
        }) => {
            const p = elem.parent;
            if(userContext){
                const authorId = userContext.author.id;
                return p.state === "Published" || (p.author && p.author.id === authorId);
            }else{
                return p.state === "Published";
            }
        });

        return data;
    },

    /**
     * @param {number} contributionId
     * @param {UserContext|null} userContext // if null, assume terrain is public
     * @returns a collection of child links
     */
    async childrenOfContribution(contributionId: number, userContext:any = null) {
        let data = await strapi.db.query('api::link.link').findMany({
            select: ['id',],
            where: {
                'parent': contributionId,
            },
            populate: ['parent.author', 'child.author'],
        });

        // we only want to return the links that point to contributions that are either mine or with state published
        data = data.filter((elem: {
            id:number,
            parent:{state: string, author:{id:number}|null},
            child:{state: string, author:{id:number}|null}
        }) => {
            const c = elem.child;
            if(userContext){
                const authorId = userContext.author.id;
                return c.state === "Published" || (c.author && c.author.id === authorId);
            }else{
                return c.state === "Published";
            }
        });

        return data;
    },
}));
