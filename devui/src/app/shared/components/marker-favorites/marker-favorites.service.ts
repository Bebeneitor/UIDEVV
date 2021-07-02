import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { RoutingConstants } from '../../models/routing-constants';

@Injectable({
    providedIn: 'root'
})
export class MarkerFavoritesService {

    constructor(private http: HttpClient) {
    }

    public isFavoriteRule(userId, ruleId) {
        return this.http.get<any>(environment.restServiceUrl + RoutingConstants.RULES_URL + "/" + RoutingConstants.IS_FAVORITE_RULE_URL + "?userId=" + userId + "&ruleId=" + ruleId);
    }

    public isFavoriteIdea(userId, ruleId) {
        return this.http.get<any>(environment.restServiceUrl + RoutingConstants.IDEAS_URL + "/" + RoutingConstants.IS_FAVORITE_IDEA_URL + "?userId=" + userId + "&ideaId=" + ruleId);
    }

    public updateFavoriteRule(userId, ruleId, save) {
        return this.http.post<any>(environment.restServiceUrl + RoutingConstants.RULES_URL + "/" + RoutingConstants.UPDATE_FAVORITE_RULE_URL + "?userId=" + userId + "&ruleId=" + ruleId + "&isFavorite=" + save, {});
    }

    public updateFavoriteIdea(userId, ideaId, save) {
        return this.http.post<any>(environment.restServiceUrl + RoutingConstants.IDEAS_URL + "/" + RoutingConstants.UPDATE_FAVORITE_IDEA_URL + "?userId=" + userId + "&ideaId=" + ideaId + "&isFavorite=" + save, {});
    }

}