import { Component, OnInit, TemplateRef, inject } from '@angular/core';
import { NgbModal } from '@ng-bootstrap/ng-bootstrap';
import { BudgetTypeService } from '../services/budget-type.service';
import swal from 'sweetalert2';

@Component({
  selector: 'app-budget-type',
  templateUrl: './budget-type.component.html',
  styleUrls: ['./budget-type.component.css'],
})
export class BudgetTypeComponent implements OnInit {
  budgetItems: any[] = [];
  budgetTypes: any[] = [];

  newBudgetItem: any = {
    _id: '',
    budgetTypeId: '',
    budgetAmount: 0,
  };
  newBudgetType: any = {
    _id : '',
    budgetTypeId: '',
    budgetAmount: 0,
    budgetType: '',
  };
  isEdit: boolean = false;
  modalRef: any;
  private modalService = inject(NgbModal);
  constructor(private budgetTypeService: BudgetTypeService) {}

  ngOnInit(): void {
    this.getBudgetItems();
    this.getBudgetTypes();
  }

  getBudgetTypes() {
    return this.budgetTypeService
      .getBudgetTypes()
      .subscribe((response: any) => {
        this.budgetTypes = response.data;
      });
  }
  getBudgetItems() {
    return this.budgetTypeService
      .getBudgetItems()
      .subscribe((response: any) => {
        this.budgetItems = response.data;
      });
  }
  addBudgetItem() {
    console.log(this.newBudgetItem);
    if (
      this.newBudgetItem.budgetTypeId === '' ||
      this.newBudgetItem.budgetAmount === '' ||
      this.newBudgetItem.budgetAmount === 0
    ) {
      swal.fire('Error!', 'Please fill out all fields', 'error');
    }
    this.newBudgetItem = {
      budgetTypeId: this.newBudgetItem.budgetTypeId,
      budgetAmount: this.newBudgetItem.budgetAmount,
    };
    this.budgetTypeService
      .addBudgetItem(this.newBudgetItem)
      .subscribe((response: any) => {
        this.budgetItems.push(response.data);
        swal.fire('Success!', 'Budget Item Added', 'success');
        this.newBudgetItem =  {
          _id : '',
          budgetTypeId: '',
          budgetAmount: 0,
          budgetType: '',
        };
        this.modalRef.close();
      });
  }
  updateBudgetItem(budgetItem: any) {
    if (
      budgetItem.budgetTypeId === '' ||
      budgetItem.budgetAmount === '' ||
      budgetItem.budgetAmount === 0
    ) {
      swal.fire('Error!', 'Please fill out all fields', 'error');
    }
    this.budgetTypeService
      .updateBudgetItem(budgetItem, budgetItem._id)
      .subscribe((response: any) => {
        console.log(response);
        const index = this.budgetItems.findIndex(
          (item) => item._id === response.data._id
        );
        this.budgetItems[index] = response.data;
        swal.fire('Success!', 'Budget Item Updated', 'success');
        this.modalRef.close();
        this.newBudgetItem =  {
          _id : '',
          budgetTypeId: '',
          budgetAmount: 0,
          budgetType: '',
        };
      });
  }
  openAddBudgetType(content: TemplateRef<any>, budgetItem?: any) {
    this.modalRef = this.modalService.open(content);
    this.modalRef.result.then(
      (result: any) => {
        console.log(result);
      },
      (reason: any) => {
        console.log(reason);
      }
    );
  }
  openAddBudget(content: TemplateRef<any>, type: string, budgetItem?: any) {
    console.log(budgetItem);
    if (type === 'Add') {
      this.isEdit = false;
      this.newBudgetItem = {
        budgetTypeId: '',
        budgetAmount: 0,
        budgetType: '',
      };

    } else if (type === 'Edit') {
      this.isEdit = true;
      this.newBudgetItem = {
        _id : budgetItem._id,
        budgetTypeId: budgetItem.budgetTypeId._id,
        budgetAmount: budgetItem.budgetAmount,
        budgetType: budgetItem.budgetTypeId.budgetType,
      };
    }
    this.modalRef = this.modalService.open(content);

  }
  addBudgetType() {
    if (this.newBudgetType.budgetType === '') {
      swal.fire('Error!', 'Please fill out all fields', 'error');
    }
    this.newBudgetType = {
      budgetType: this.newBudgetType.budgetType,
    };
    this.budgetTypeService
      .addBudgetType(this.newBudgetType)
      .subscribe((response: any) => {
        this.budgetTypes.push(response.data);
        console.log(response);
        swal.fire('Success!', 'Budget Type Added', 'success');
        this.newBudgetType = {
          _id : '',
          budgetTypeId: '',
          budgetAmount: 0,
          budgetType: '',
        };
        this.modalRef.close();
      });

  }
  onSubmit() {
    if (this.isEdit) {
      console.log(this.newBudgetItem);

      this.updateBudgetItem(this.newBudgetItem);
    } else {
      this.addBudgetItem();
    }
  }
}
