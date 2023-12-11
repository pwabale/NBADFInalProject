import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Constants } from 'APP_CONSTANTS';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SpendingService {



  constructor(private http : HttpClient) { }

  updateSpendingItem(spendingItem: any, _id: any):Observable<any> {
    return this.http.put(`${Constants.API_URL}/spending/${_id}`, spendingItem);
  }
  getSpendingItems():Observable<any> {
    return this.http.get(`${Constants.API_URL}/spending`);
  }
  getSpendingItemById(id: string):Observable<any> {
    return this.http.get(`${Constants.API_URL}/spending/${id}`);
  }
  addSpendingItem(newSpendingItem: any):  Observable<any> {
    return this.http.post(`${Constants.API_URL}/spending`,newSpendingItem);
  }
  getMonthlySpendingItems(): Observable<any> {
    return this.http.get(`${Constants.API_URL}/spending`);
  }

  getSpendingBarChart(): Observable<any> {
    return this.http.get(`${Constants.API_URL}/spending/barChart`);
  }
  getMonthlyExpense(): Observable<any> {
    return this.http.get(`${Constants.API_URL}/spending/getBugetSpendingGraph`);
  }
  getSpendingPieChart() {
    return this.http.get(`${Constants.API_URL}/spending/pieChart`);
  }


}
