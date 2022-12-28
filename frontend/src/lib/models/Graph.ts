import { Relation, type Contribution } from "./Contribution";
import type { id } from "./Id";



export class Graph{
    private mapOfContributions: Map<id, Contribution> = new Map<id, Contribution>();

    constructor(private contributions: Contribution[]){
        for(const c of contributions){
            this.mapOfContributions.set(c.id, c);
        }
    }

    // naive slow implementation, do a bfs for each node
    addCompleteChildParentCountToContributions(): Contribution[]{
        const countRelationsOfContribution = (contribution: Contribution, relation: Relation) => {
            let count = 0;
            let visited: Set<id> = new Set<id>();
            let queue: id[] = [];

            queue.push(... contribution.getDirectRelationsOfType(relation));
            while(queue.length > 0){
                let nextId = queue.pop() as number;
                if(visited.has(nextId)){
                    continue;
                }
                
                const contribution = this.mapOfContributions.get(nextId);
                if(contribution){
                    count += 1;
                    queue.push(...contribution.getDirectRelationsOfType(relation));
                    visited.add(nextId);
                }
            }

            return count;
        }

        for(const c of this.contributions){
            c.totalCountOfChildren = countRelationsOfContribution(c, Relation.Child);
            c.totalCountOfParents = countRelationsOfContribution(c, Relation.Parent);
        }

        return this.contributions;
    }
}