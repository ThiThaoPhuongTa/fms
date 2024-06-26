import type { PageLoad } from "./$types";
import { getSites } from "$lib/api/sites";
import { getTeam } from "$lib/api/teams";

export const load: PageLoad = async ({fetch, params, depends}) => {
    
    const team = await getTeam(params.team_id, fetch);

    depends("sites:reload")
    const {sites, total} = await getSites(params.team_id, fetch);

    return {
        ...team,
        sites,
        total
    }
}