import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Constants } from 'APP_CONSTANTS';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BudgetTypeService {

  constructor(private http : HttpClient) { }

  getBudgetTypes() :Observable<any>{
    return this.http.get(`${Constants.API_URL}/budgetType`);
  }
  addBudgetType(newBudgetType: any) {
    return this.http.post(`${Constants.API_URL}/budgetType`,newBudgetType);
  }
  getBudgetItems() {
    return this.http.get(`${Constants.API_URL}/budget`);
  }
  addBudgetItem(newBudgetItem: any) {
    return this.http.post(`${Constants.API_URL}/budget`,newBudgetItem);
  }
  updateBudgetItem(budgetItem: any,_id: string) {
    return this.http.put(`${Constants.API_URL}/budget/${_id}`,budgetItem);
  }

  getBudgetItemById(id: string) {
    return this.http.get(`${Constants.API_URL}/budget/${id}`);
  }
}
