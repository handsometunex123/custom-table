import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { UserSearchResponseModel } from 'src/app/models/api/users/user-search-response.model';

@Injectable({
  providedIn: 'root',
})
export class UsersService {
  constructor(private http: HttpClient) {}

  /**
   * Get users that matches the provided search string.
   */
  public getUsers(login: string): Observable<UserSearchResponseModel> {
    const queryParams = new HttpParams().append('q', `${login} in:login`);
    return this.http.get<UserSearchResponseModel>(`search/users`, { params: queryParams });
  }
}
